import { useState } from "react";
import { api } from "./api";
import { DocViewer } from "./DocViewer";

const DEFAULT_TASKS: Record<string, string> = {
  "build-vs-buy": "Produce the component-level build/buy/partner decision matrix for this venture.",
  "roi-model": "Build the buyer-side ROI case and company-side model memo for this venture.",
  "validation-loop": "Design the evidence loop: instrumentation plan, methods, cohort, and targets.",
  "trust-pack": "Produce the stage-appropriate trust pack for this venture.",
  "investor-targeting": "Build the ranked, sequenced capital plan for this venture.",
};

export function RunPanel(props: {
  slug: string;
  stage: string;
  outputFile: string;
  done: boolean;
  onFinished: () => void;
}) {
  const [task, setTask] = useState(DEFAULT_TASKS[props.stage] ?? "Run this stage for the venture.");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showDoc, setShowDoc] = useState(props.done);

  if (showDoc && !running && !output) {
    return (
      <div>
        <div className="row">
          <h2 style={{ margin: 0, flex: 1 }}>{props.stage}</h2>
          <button onClick={() => setShowDoc(false)}>Re-run stage</button>
        </div>
        <DocViewer slug={props.slug} initialFile={props.outputFile} />
      </div>
    );
  }

  async function run() {
    setRunning(true);
    setOutput("");
    try {
      await api.run(props.slug, props.stage, task, (chunk) => setOutput((o) => o + chunk));
    } catch (e) {
      setOutput((o) => o + `\n[error] ${(e as Error).message}`);
    } finally {
      setRunning(false);
      props.onFinished();
    }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <h2>{props.stage}</h2>
      <p className="hint">
        Runs agentically through your local <code>claude</code> CLI on your existing subscription.
        The stage reads the venture&apos;s files and writes {props.outputFile} when done.
      </p>
      <textarea value={task} onChange={(e) => setTask(e.target.value)} />
      <div className="row">
        <button className="primary" disabled={running || !task.trim()} onClick={() => void run()}>
          {running ? "Running…" : "Run stage"}
        </button>
        {props.done && !running && (
          <button onClick={() => setShowDoc(true)}>View existing {props.outputFile}</button>
        )}
      </div>
      {output && <div className="stream">{output}</div>}
    </div>
  );
}
