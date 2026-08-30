"use client";

import {
  Bold,
  Code,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  SquareCode,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ToolbarAction = {
  icon: typeof Bold;
  label: string;
  /** Wraps the current selection, or inserts a placeholder if nothing's selected. */
  before?: string;
  after?: string;
  /** For line-prefix actions (headings, lists, quotes) instead of wrapping. */
  linePrefix?: string;
  placeholder?: string;
};

const TOOLBAR: ToolbarAction[] = [
  { icon: Bold, label: "Bold", before: "**", after: "**", placeholder: "bold text" },
  { icon: Italic, label: "Italic", before: "_", after: "_", placeholder: "italic text" },
  { icon: Heading2, label: "Heading", linePrefix: "## ", placeholder: "Heading" },
  { icon: Quote, label: "Quote", linePrefix: "> ", placeholder: "Quote" },
  { icon: Code, label: "Inline code", before: "`", after: "`", placeholder: "code" },
  {
    icon: SquareCode,
    label: "Code block",
    before: "```\n",
    after: "\n```",
    placeholder: "code block",
  },
  { icon: Link2, label: "Link", before: "[", after: "](https://)", placeholder: "link text" },
  {
    icon: ImageIcon,
    label: "Image",
    before: "![",
    after: "](/uploads/…)",
    placeholder: "alt text",
  },
  { icon: List, label: "Bulleted list", linePrefix: "- ", placeholder: "List item" },
  { icon: ListOrdered, label: "Numbered list", linePrefix: "1. ", placeholder: "List item" },
];

/**
 * A GitHub-README-style editor: a plain Markdown textarea (still a real
 * form field, submitted by `name` like any other input) with a formatting
 * toolbar and Write/Preview tabs. Content is stored as Markdown text, not
 * HTML — rendered on the public site by components/site/markdown-content.tsx.
 */
export function MarkdownEditor({
  name,
  label,
  defaultValue = "",
  dir = "ltr",
  rows = 12,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  dir?: "ltr" | "rtl";
  rows?: number;
}) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");

  function applyAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || action.placeholder || "";

    if (action.linePrefix) {
      // Prefix every selected line (or the current line if nothing's selected).
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const before = value.slice(0, lineStart);
      const target = value.slice(lineStart, selectionEnd) || action.placeholder || "";
      const prefixed = target
        .split("\n")
        .map((line) => `${action.linePrefix}${line}`)
        .join("\n");
      const after = value.slice(selectionEnd);
      const next = `${before}${prefixed}${after}`;
      setValue(next);
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = lineStart + prefixed.length;
        textarea.setSelectionRange(pos, pos);
      });
      return;
    }

    const before = action.before ?? "";
    const inserted = `${before}${selected}${action.after ?? ""}`;
    const cursorOffset = before.length + selected.length;

    const next = value.slice(0, selectionStart) + inserted + value.slice(selectionEnd);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = selectionStart + cursorOffset;
      textarea.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "write" | "preview")}>
          <TabsList className="h-7">
            <TabsTrigger value="write" className="h-5 text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-5 text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
        {tab === "write" && (
          <div className="flex flex-wrap gap-0.5 border-b border-border bg-surface-raised p-1">
            {TOOLBAR.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                title={action.label}
                aria-label={action.label}
                onClick={() => applyAction(action)}
              >
                <action.icon className="size-3.5" />
              </Button>
            ))}
          </div>
        )}

        {tab === "write" ? (
          <Textarea
            ref={textareaRef}
            id={id}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            dir={dir}
            rows={rows}
            className="rounded-none border-0 focus-visible:ring-0"
            placeholder="Write Markdown here — **bold**, _italic_, `code`, [links](https://…), and GitHub-style tables and task lists all work."
          />
        ) : (
          <div
            dir={dir}
            className="prose max-w-none px-3 py-2"
            style={{ minHeight: `${rows * 1.5}em` }}
          >
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-fg-muted italic">Nothing to preview yet.</p>
            )}
          </div>
        )}
        {/* Preview mode still needs the value submitted with the form. */}
        {tab === "preview" && <input type="hidden" name={name} value={value} />}
      </div>
    </div>
  );
}
