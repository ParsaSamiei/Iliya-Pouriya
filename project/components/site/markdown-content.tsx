import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders project/post content, which is authored as Markdown in the admin
 * panel (see components/admin/markdown-editor.tsx) — GitHub Flavored
 * Markdown (tables, strikethrough, task lists, autolinks) via remark-gfm.
 *
 * Deliberately does NOT pass through raw HTML (no rehype-raw) — content
 * renders to React elements rather than being injected as HTML, so there's
 * no sanitization step needed and no dangerouslySetInnerHTML anywhere in
 * this flow.
 */
export function MarkdownContent({ content, dir }: { content: string; dir?: "ltr" | "rtl" }) {
  return (
    <div
      dir={dir}
      className="prose mt-8 max-w-none [&_code]:font-mono [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius-md)] [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-raised [&_pre]:p-4 [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
