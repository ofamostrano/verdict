import { useState } from "react";
import { marked } from "marked";
import { api } from "./api";

const TEMPLATE = JSON.stringify(
  [
    {
      name: "Example: AI prevailing-wage payroll compliance",
      pain: 5,
      moat: 5,
      reach: 4,
      velocity: 4,
      capital: 4,
      grant: 3,
      note: "Replace with your candidates. Axes are 1-5; pain=1 or moat=1 kills outright.",
    },
  ],
  null,
  2
);

export function ScanPanel(props: { slug: string; onSaved: () => void }) {
  const [input, setInput] = useState(TEMPLATE);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function score(save: boolean) {
    setError(null);
    try {
      const candidates = JSON.parse(input);
      const r = await api.scan(save ? props.slug : null, candidates);
      setMarkdown(r.markdown);
      setSaved(r.savedTo);
      if (save) props.onSaved();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <h2>Opportunity scan</h2>
      <p className="hint">
        Paste candidates as JSON — one object per idea, each axis scored 1–5. Weights: pain 25%,
        moat 20%, velocity 20%, reach 15%, capital 10%, grant 10%. Pursue ≥ 3.75, Hold ≥ 3.00.
        Kill rules apply before ranking.
      </p>
      <textarea
        style={{ minHeight: 180, fontFamily: "ui-monospace, monospace", fontSize: 12.5 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="row">
        <button onClick={() => void score(false)}>Score (preview)</button>
        <button className="primary" onClick={() => void score(true)}>
          Score &amp; save register.md
        </button>
        {saved && <span className="ok">Saved to {saved}</span>}
      </div>
      {error && <div className="error">{error}</div>}
      {markdown && (
        <div className="doc" dangerouslySetInnerHTML={{ __html: marked.parse(markdown) as string }} />
      )}
    </div>
  );
}
