export interface Project {
  slug: string;
  name: string;
  stages: Record<string, boolean>;
}

export interface ProjectsResponse {
  projects: Project[];
  pipeline: string[];
}

async function json<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) throw new Error((body as { error?: string }).error ?? res.statusText);
  return body as T;
}

export const api = {
  projects: () => fetch("/api/projects").then((r) => json<ProjectsResponse>(r)),

  createProject: (name: string) =>
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => json<{ slug: string }>(r)),

  stages: () => fetch("/api/stages").then((r) => json<{ stages: string[]; questions: string[] }>(r)),

  files: (slug: string) => fetch(`/api/projects/${slug}/files`).then((r) => json<{ files: string[] }>(r)),

  file: (slug: string, name: string) =>
    fetch(`/api/projects/${slug}/file?name=${encodeURIComponent(name)}`).then((r) =>
      json<{ name: string; content: string }>(r)
    ),

  scan: (slug: string | null, candidates: unknown) =>
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, candidates }),
    }).then((r) => json<{ markdown: string; savedTo: string | null }>(r)),

  gate: (slug: string, answers: string[], buyer: string) =>
    fetch("/api/gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, answers, buyer }),
    }).then((r) => json<{ verdict: string; reasoning: string; savedTo: string }>(r)),

  /** Streams stage output; calls onChunk as text arrives. */
  run: async (slug: string, stage: string, task: string, onChunk: (text: string) => void): Promise<void> => {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, stage, task }),
    });
    if (!res.ok || !res.body) {
      const body = await res.text();
      throw new Error(body || res.statusText);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  },
};
