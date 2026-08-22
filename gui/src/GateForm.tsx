import { useState } from "react";
import { api } from "./api";
import { DocViewer } from "./DocViewer";

export function GateForm(props: {
  slug: string;
  questions: string[];
  done: boolean;
  onSaved: () => void;
}) {
  const [answers, setAnswers] = useState<string[]>(() => props.questions.map(() => ""));
  const [buyer, setBuyer] = useState("");
  const [result, setResult] = useState<{ verdict: string; reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDoc, setShowDoc] = useState(props.done);
  const [busy, setBusy] = useState(false);

  if (showDoc && !result) {
    return (
      <div>
        <div className="row">
          <h2 style={{ margin: 0, flex: 1 }}>Discovery gate</h2>
          <button onClick={() => setShowDoc(false)}>Retake the gate</button>
        </div>
        <DocViewer slug={props.slug} initialFile="discovery-gate.md" />
      </div>
    );
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.gate(props.slug, answers, buyer);
      setResult(r);
      props.onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div style={{ maxWidth: 760 }}>
      <h2>Discovery gate</h2>
      <p className="hint">
        Five questions decide whether the next dollar goes into scoping or into building. Answer
        honestly — hedged answers count as no, and that is the point of the gate.
      </p>

      {props.questions.map((q, i) => (
        <div className="gate-q" key={i}>
          <label>
            <span className="qnum">Q{i + 1}</span>
            {q}
          </label>
          <textarea
            value={answers[i]}
            placeholder="Answer in your own words — it is recorded verbatim."
            onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))}
          />
        </div>
      ))}

      <div className="gate-q">
        <label>
          If Q1 leans no: name ONE real prospective buyer you could contact this week (optional
          otherwise).
        </label>
        <input value={buyer} onChange={(e) => setBuyer(e.target.value)} placeholder="A person or company" />
      </div>

      {error && <div className="error">{error}</div>}

      {result ? (
        <>
          <div className="verdict-box">
            <div className="v">{result.verdict}</div>
            <div>{result.reasoning}</div>
          </div>
          <p className="ok">
            Saved to discovery-gate.md — the document contains the empty assumption ledger to fill
            in next.
          </p>
          <button onClick={() => setShowDoc(true)}>View the gate document</button>
        </>
      ) : (
        <button className="primary" disabled={!allAnswered || busy} onClick={() => void submit()}>
          {busy ? "Judging…" : "Get the verdict"}
        </button>
      )}
    </div>
  );
}
