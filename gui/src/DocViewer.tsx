import { useEffect, useState } from "react";
import { marked } from "marked";
import { api } from "./api";

export function DocViewer(props: { slug: string; initialFile?: string }) {
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(props.initialFile ?? null);
  const [content, setContent] = useState<string>("");
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
    api
      .file(props.slug, active)
      .then(({ content }) => setContent(content))
      .catch((e: Error) => setError(e.message));
  }, [props.slug, active]);

  if (error) return <div className="error">{error}</div>;

  const isMarkdown = active?.endsWith(".md") ?? false;

  return (
    <div>
      <div className="file-tabs">
        {files.map((f) => (
          <span
            key={f}
            className={"file-tab" + (f === active ? " active" : "")}
            onClick={() => setActive(f)}
          >
            {f}
          </span>
        ))}
      </div>
      {active && isMarkdown && (
        <div className="doc" dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} />
      )}
      {active && !isMarkdown && <pre className="stream">{content}</pre>}
      {!active && <p className="hint">No documents yet — run a stage to produce one.</p>}
    </div>
  );
}
