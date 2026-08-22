import { useEffect, useState } from "react";
import { marked } from "marked";
import { api } from "./api";

export function DocViewer(props: { slug: string; initialFile?: string }) {
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(props.initialFile ?? null);
  const [content, setContent] = useState<string>("");
  const [draft, setDraft] = useState<string | null>(null); // non-null = editing
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .files(props.slug)
      .then(({ files }) => {
        setFiles(files);
        setActive((cur) => (cur && files.includes(cur) ? cur : files[0] ?? null));
      })
      .catch((e: Error) => setError(e.message));
  }, [props.slug]);

  useEffect(() => {
    if (!active) return;
    setDraft(null);
    setStatus(null);
    api
      .file(props.slug, active)
      .then(({ content }) => setContent(content))
      .catch((e: Error) => setError(e.message));
  }, [props.slug, active]);

  async function save() {
    if (draft === null || !active) return;
    try {
      await api.saveFile(props.slug, active, draft);
      setContent(draft);
      setDraft(null);
      setStatus(`Saved ${active}`);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error) return <div className="error">{error}</div>;

  const isMarkdown = active?.endsWith(".md") ?? false;
  const editing = draft !== null;

  return (
    <div>
      <div className="file-tabs no-print">
        {files.map((f) => (
          <span
            key={f}
            className={"file-tab" + (f === active ? " active" : "")}
            onClick={() => setActive(f)}
          >
            {f}
          </span>
        ))}
        {active && (
          <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {!editing && (
              <>
                <span className="file-tab" onClick={() => setDraft(content)}>
                  ✎ Edit
                </span>
                {isMarkdown && (
                  <span className="file-tab" onClick={() => window.print()}>
                    ⇩ Export PDF
                  </span>
                )}
              </>
            )}
            {editing && (
              <>
                <span className="file-tab active" onClick={() => void save()}>
                  Save
                </span>
                <span className="file-tab" onClick={() => setDraft(null)}>
                  Cancel
                </span>
              </>
            )}
          </span>
        )}
      </div>
      {status && !editing && <div className="ok no-print">{status}</div>}
      {active && editing && (
        <textarea
          className="editor"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
        />
      )}
      {active && !editing && isMarkdown && (
        <div className="doc" dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} />
      )}
      {active && !editing && !isMarkdown && <pre className="stream">{content}</pre>}
      {!active && <p className="hint">No documents yet — run a stage to produce one.</p>}
    </div>
  );
}
