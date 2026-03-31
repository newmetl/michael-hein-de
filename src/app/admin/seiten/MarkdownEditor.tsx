"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor({
  name,
  defaultValue,
  rows = 10,
}: {
  name: string;
  defaultValue: string;
  rows?: number;
}) {
  const [content, setContent] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`text-[10px] tracking-widest uppercase px-3 py-1 transition-all ${
            !showPreview
              ? "bg-secondary/10 text-secondary"
              : "border border-outline/20 hover:bg-surface-container-low"
          }`}
        >
          Bearbeiten
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`text-[10px] tracking-widest uppercase px-3 py-1 transition-all ${
            showPreview
              ? "bg-secondary/10 text-secondary"
              : "border border-outline/20 hover:bg-surface-container-low"
          }`}
        >
          Vorschau
        </button>
      </div>

      {showPreview ? (
        <div className="border border-outline/20 p-4 min-h-[200px] prose prose-sm max-w-none prose-headings:font-headline prose-headings:tracking-tighter prose-p:text-on-surface prose-headings:text-on-surface">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          name={name}
          rows={rows}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent border border-outline/20 p-4 focus:ring-0 focus:border-secondary transition-colors resize-y font-mono text-sm"
        />
      )}
    </div>
  );
}
