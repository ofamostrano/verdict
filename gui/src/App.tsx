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

const STAGE_LABELS: Record<string, string> = {
  "opportunity-scan": "Opportunity scan",
  "discovery-gate": "Discovery gate",
  "build-vs-buy": "Build vs buy",
  "roi-model": "ROI model",
  "validation-loop": "Validation loop",
  "trust-pack": "Trust pack",
  "investor-targeting": "Investor targeting",
};

export const stageLabel = (s: string) => STAGE_LABELS[s] ?? s;

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
  const doneCount = project ? Object.values(project.stages).filter(Boolean).length : 0;
  const stageCount = project ? Object.keys(project.stages).length : 0;

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
          <span className="gavel">⚖</span>
          <span>
            Verdict
            <small>a verdict, not vibes</small>
          </span>
        </div>
        <div className="project-list">
          {projects.length > 0 && <div className="list-label">Ventures</div>}
          {projects.map((p) => {
            const done = Object.values(p.stages).filter(Boolean).length;
            const total = Object.keys(p.stages).length;
            return (
              <div
                key={p.slug}
                className={
                  "project-item" +
                  (p.slug === selected ? " active" : "") +
                  (done === total ? " complete" : "")
                }
                onClick={() => {
                  setSelected(p.slug);
                  setStage(null);
                }}
              >
                <div className="row-top">
                  <span className="name">{p.name}</span>
                  <span className="done-count">
                    {done}/{total}
                  </span>
                </div>
                <div className={"progress" + (done === total ? " full" : "")}>
                  <i style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="project-item">No ventures yet — create one below.</div>
          )}
        </div>
        <div className="new-project">
          <input
            placeholder="New venture idea…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void createProject()}
          />
          <button className="primary" title="Create venture" onClick={() => void createProject()}>
            +
          </button>
        </div>
      </aside>

      <main className="main">
        {project && (
          <header className="topbar">
            <h1>{project.name}</h1>
            <span className="meta">
              {doneCount === stageCount
                ? "Pipeline complete"
                : `${doneCount} of ${stageCount} stages complete`}
            </span>
            <div className={"progress" + (doneCount === stageCount ? " full" : "")}>
              <i style={{ width: `${stageCount ? (doneCount / stageCount) * 100 : 0}%` }} />
            </div>
          </header>
        )}

        {project && (
          <nav className="pipeline">
            {pipeline.map((s, i) => (
              <span key={s} style={{ display: "flex", alignItems: "center" }}>
                <span
                  className={
                    "stage-chip" + (project.stages[s] ? " done" : "") + (s === stage ? " active" : "")
                  }
                  title={project.stages[s] ? "Complete — click to view" : "Not run yet"}
                  onClick={() => setStage(s === stage ? null : s)}
                >
                  <span className="num">{project.stages[s] ? "✓" : i + 1}</span>
                  {stageLabel(s)}
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
              <div className="mark">⚖</div>
              <h2>Run your idea through the pipeline.</h2>
              <p>
                Each stage produces a document with a decision in it — Pursue, Hold, or Killed.
                Killed ideas are evidence of rigor, not wasted work.
              </p>
              <div className="steps">
                <div>
                  <b>1</b> Create a venture in the sidebar
                </div>
                <div>
                  <b>2</b> Score it and face the discovery gate
                </div>
                <div>
                  <b>3</b> Let the agentic stages build the case
                </div>
              </div>
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
                label={stageLabel(stage)}
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
