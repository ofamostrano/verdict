/**
 * Local-only HTTP server: serves the built GUI and a small JSON API over the
 * same engine the CLI uses. Binds 127.0.0.1 — this is a local app, not a
 * hosted service.
 */

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, existsSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { loadCandidates, scoreCandidate, sortScored, toMarkdown } from "./scoring.js";
import { QUESTIONS, classifyAnswer, interpret, gateToMarkdown, GateAnswer } from "./gate.js";
import { listSkills, loadSkill, skillsRoot } from "./agent.js";
import { initProject, slugify, VENTURES_DIR } from "./project.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

/** Stage id → the output document that marks it complete. */
export const STAGE_OUTPUTS: Record<string, string> = {
  "opportunity-scan": "register.md",
  "discovery-gate": "discovery-gate.md",
  "build-vs-buy": "build-vs-buy.md",
  "roi-model": "roi-model.md",
  "validation-loop": "validation-loop.md",
  "trust-pack": "trust-pack.md",
  "investor-targeting": "investor-targeting.md",
};

const PIPELINE_ORDER = Object.keys(STAGE_OUTPUTS);

function venturesDir(): string {
  return resolve(".", VENTURES_DIR);
}

function safeProjectDir(slug: string): string {
  const clean = slugify(slug);
  if (!clean) throw new Error("Bad project slug.");
  const dir = join(venturesDir(), clean);
  if (!existsSync(dir)) throw new Error(`No project '${clean}'.`);
  return dir;
}

function listProjects(): { slug: string; name: string; stages: Record<string, boolean> }[] {
  const root = venturesDir();
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = join(root, e.name);
      let name = e.name.replace(/-/g, " ");
      const ideaPath = join(dir, "idea.md");
      if (existsSync(ideaPath)) {
        const firstLine = readFileSync(ideaPath, "utf-8").split("\n")[0];
        if (firstLine.startsWith("# ")) name = firstLine.slice(2).trim();
      }
      const stages: Record<string, boolean> = {};
      for (const [stage, output] of Object.entries(STAGE_OUTPUTS)) {
        stages[stage] = existsSync(join(dir, output));
      }
      return { slug: e.name, name, stages };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolvePromise, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 5_000_000) reject(new Error("Body too large."));
    });
    req.on("end", () => resolvePromise(data));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

function sendError(res: ServerResponse, status: number, message: string): void {
  sendJson(res, status, { error: message });
}

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  const path = url.pathname;
  const method = req.method ?? "GET";

  if (path === "/api/projects" && method === "GET") {
    return sendJson(res, 200, { projects: listProjects(), pipeline: PIPELINE_ORDER });
  }

  if (path === "/api/projects" && method === "POST") {
    const { name } = JSON.parse(await readBody(req));
    if (!name || typeof name !== "string") return sendError(res, 400, "A project name is required.");
    const dir = initProject(name);
    return sendJson(res, 201, { slug: slugify(name), dir });
  }

  if (path === "/api/stages" && method === "GET") {
    return sendJson(res, 200, { stages: listSkills(), questions: QUESTIONS });
  }

  const fileMatch = path.match(/^\/api\/projects\/([a-z0-9-]+)\/file$/);
  if (fileMatch && method === "GET") {
    const dir = safeProjectDir(fileMatch[1]);
    const name = url.searchParams.get("name") ?? "";
    if (!/^[a-zA-Z0-9._-]+\.(md|json|csv)$/.test(name)) return sendError(res, 400, "Bad file name.");
    const filePath = join(dir, name);
    if (!existsSync(filePath)) return sendError(res, 404, `No file ${name}.`);
    return sendJson(res, 200, { name, content: readFileSync(filePath, "utf-8") });
  }

  const filesMatch = path.match(/^\/api\/projects\/([a-z0-9-]+)\/files$/);
  if (filesMatch && method === "GET") {
    const dir = safeProjectDir(filesMatch[1]);
    const files = readdirSync(dir)
      .filter((f) => /\.(md|json|csv)$/.test(f) && statSync(join(dir, f)).isFile())
      .sort();
    return sendJson(res, 200, { files });
  }

  if (path === "/api/scan" && method === "POST") {
    const { candidates, slug } = JSON.parse(await readBody(req));
    const rows = sortScored(loadCandidates(JSON.stringify(candidates), false).map(scoreCandidate));
    const markdown = toMarkdown(rows);
    let savedTo: string | null = null;
    if (slug) {
      const dir = safeProjectDir(slug);
      const outPath = join(dir, "register.md");
      writeFileSync(outPath, markdown + "\n", "utf-8");
      savedTo = "register.md";
    }
    return sendJson(res, 200, { markdown, rows, savedTo });
  }

  if (path === "/api/gate" && method === "POST") {
    const { slug, answers, buyer } = JSON.parse(await readBody(req));
    if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
      return sendError(res, 400, `Exactly ${QUESTIONS.length} answers required.`);
    }
    const dir = safeProjectDir(slug);
    const gateAnswers: GateAnswer[] = QUESTIONS.map((q, i) => ({
      question: q,
      verbatim: String(answers[i] ?? "").trim(),
      leaning: classifyAnswer(String(answers[i] ?? "")),
    }));
    const buyerNamed = String(buyer ?? "").trim() || null;
    const { verdict, reasoning } = interpret(
      gateAnswers.map((a) => a.leaning),
      buyerNamed
    );
    const result = {
      idea: slug.replace(/-/g, " "),
      answers: gateAnswers,
      buyerNamed,
      verdict,
      reasoning,
      date: new Date().toISOString().slice(0, 10),
    };
    writeFileSync(join(dir, "discovery-gate.md"), gateToMarkdown(result), "utf-8");
    return sendJson(res, 200, { verdict, reasoning, savedTo: "discovery-gate.md" });
  }

  if (path === "/api/run" && method === "POST") {
    const { slug, stage, task } = JSON.parse(await readBody(req));
    if (!stage || !task) return sendError(res, 400, "stage and task are required.");
    const dir = safeProjectDir(slug);
    const skill = loadSkill(stage); // validates the stage name
    const referencesDir = join(skillsRoot(), stage, "references");
    const referencesNote = existsSync(referencesDir)
      ? `\n\nThis stage's reference files are at: ${referencesDir} — read them before producing output.`
      : "";
    const systemPrompt =
      `You are running the '${stage}' stage of the Verdict venture pipeline. ` +
      `Follow this methodology exactly, including its output structure and style rules:\n\n${skill}${referencesNote}\n\n` +
      `The current venture project lives in the working directory. Read its files for context ` +
      `and write this stage's output document into it as ${STAGE_OUTPUTS[stage] ?? stage + ".md"}.`;

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    });
    const child = spawn("claude", ["-p", String(task), "--append-system-prompt", systemPrompt], {
      cwd: dir,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (chunk) => res.write(chunk));
    child.stderr.on("data", (chunk) => res.write(chunk));
    child.on("error", (err: NodeJS.ErrnoException) => {
      res.write(
        err.code === "ENOENT"
          ? "\n[verdict] The `claude` CLI was not found. Install Claude Code to run agentic stages.\n"
          : `\n[verdict] ${err.message}\n`
      );
      res.end();
    });
    child.on("close", (code) => {
      res.write(`\n[verdict] stage finished (exit ${code ?? "?"})\n`);
      res.end();
    });
    req.on("close", () => child.kill("SIGTERM"));
    return;
  }

  sendError(res, 404, `No such endpoint: ${method} ${path}`);
}

function serveStatic(res: ServerResponse, urlPath: string): void {
  const guiRoot = join(__dirname, "..", "gui", "dist");
  let filePath = join(guiRoot, urlPath === "/" ? "index.html" : urlPath.slice(1));
  if (!resolve(filePath).startsWith(resolve(guiRoot))) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(guiRoot, "index.html"); // SPA fallback
  }
  if (!existsSync(filePath)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<h1>Verdict</h1><p>The GUI has not been built yet. Run <code>npm run build</code> in the verdict repo, then restart <code>verdict gui</code>.</p>"
    );
    return;
  }
  res.writeHead(200, { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" });
  res.end(readFileSync(filePath));
}

export function startServer(port: number): Promise<string> {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname.startsWith("/api/")) {
      handleApi(req, res, url).catch((err: Error) => {
        if (!res.headersSent) sendError(res, 500, err.message);
        else res.end(`\n[verdict] ${err.message}\n`);
      });
    } else {
      serveStatic(res, url.pathname);
    }
  });
  return new Promise((resolvePromise, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolvePromise(`http://127.0.0.1:${port}`));
  });
}

export function openBrowser(address: string): void {
  const platform = process.platform;
  const command = platform === "darwin" ? "open" : platform === "win32" ? "cmd" : "xdg-open";
  const args = platform === "win32" ? ["/c", "start", "", address] : [address];
  try {
    spawn(command, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    // Opening the browser is a convenience; the printed URL is the contract.
  }
}
