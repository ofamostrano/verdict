import { useEffect, useState, useCallback } from "react";
import { api, Project } from "./api";
import { GateForm } from "./GateForm";
import { ScanPanel } from "./ScanPanel";
import { RunPanel } from "./RunPanel";
import { DocViewer } from "./DocViewer";

const STAGE_OUTPUTS: Record<string, string> = {
  "opportunity-scan": "register.md",
  "discovery-gate": "discovery-gate.md",
  "build-vs-buy": "build-vs-buy.md",
  "roi-model": "roi-model.md",
  "validation-loop": "validation-loop.md",
  "trust-pack": "trust-pack.md",
  "investor-targeting": "investor-targeting.md",
};

export function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pipeline, setPipeline] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (keepSelection = true) => {
    try {
      const [p, s] = await Promise.all([api.projects(), api.stages()]);
      setProjects(p.projects);
      setPipeline(p.pipeline);
      setQuestions(s.questions);
      if (keepSelection) {
        setSelected((cur) => (cur && p.projects.some((x) => x.slug === cur) ? cur : p.projects[0]?.slug ?? null));
      }
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const project = projects.find((p) => p.slug === selected) ?? null;

  async function createProject() {
    const name = newName.trim();
    if (!name) return;
    try {
      const { slug } = await api.createProject(name);
      setNewName("");
      await refresh(false);
      setSelected(slug);
      setStage(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <span className="gavel">⚖</span> Verdict
          <small>a verdict, not vibes</small>
        </div>
        <div className="project-list">
          {projects.map((p) => {
            const done = Object.values(p.stages).filter(Boolean).length;
            return (
              <div
                key={p.slug}
                className={"project-item" + (p.slug === selected ? " active" : "")}
                onClick={() => {
                  setSelected(p.slug);
                  setStage(null);
                }}
              >
                {p.name}
                <span className="done-count">
                  {done}/{Object.keys(p.stages).length}
                </span>
              </div>
            );
          })}
          {projects.length === 0 && <div className="project-item">No ventures yet — create one below.</div>}
        </div>
        <div className="new-project">
          <input
            placeholder="New venture idea…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void createProject()}
          />
          <button className="primary" onClick={() => void createProject()}>
            +
          </button>
        </div>
      </aside>

      <main className="main">
        {project && (
          <nav className="pipeline">
            {pipeline.map((s, i) => (
              <span key={s} style={{ display: "flex", alignItems: "center" }}>
                <span
                  className={
                    "stage-chip" + (project.stages[s] ? " done" : "") + (s === stage ? " active" : "")
                  }
                  onClick={() => setStage(s)}
                >
                  <span className="dot" />
                  {s}
                </span>
                {i < pipeline.length - 1 && <span className="arrow">→</span>}
              </span>
            ))}
          </nav>
        )}

        <section className="panel" style={{ display: "flex", flexDirection: "column" }}>
          {error && <div className="error">{error}</div>}
          {!project && (
            <div className="empty-state">
              <h2>Run your idea through the pipeline.</h2>
              <p>
                Create a venture on the left. Each stage produces a document with a decision in it —
                Pursue, Hold, or Killed. Killed ideas are evidence of rigor, not wasted work.
              </p>
            </div>
          )}
          {project && !stage && (
            <DocViewer key={project.slug} slug={project.slug} initialFile="idea.md" />
          )}
          {project && stage === "opportunity-scan" && (
            <ScanPanel slug={project.slug} onSaved={() => void refresh()} />
          )}
          {project && stage === "discovery-gate" && (
            <GateForm
              slug={project.slug}
              questions={questions}
              done={project.stages[stage]}
              onSaved={() => void refresh()}
            />
          )}
          {project &&
            stage &&
            stage !== "opportunity-scan" &&
            stage !== "discovery-gate" && (
              <RunPanel
                key={project.slug + stage}
                slug={project.slug}
                stage={stage}
                outputFile={STAGE_OUTPUTS[stage] ?? `${stage}.md`}
                done={project.stages[stage]}
                onFinished={() => void refresh()}
              />
            )}
        </section>
      </main>
    </>
  );
}
