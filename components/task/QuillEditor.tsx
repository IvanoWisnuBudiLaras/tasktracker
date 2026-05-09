"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Write a description…",
  className = "",
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    let destroyed = false;

    if (quillRef.current) return;

    // Dynamic import so Quill JS never runs during SSR
    import("quill").then(({ default: Quill }) => {
      if (destroyed || !containerRef.current || quillRef.current) return;

      // Ensure container is empty before appending
      containerRef.current.innerHTML = "";

      // Quill needs an inner element to mount into
      const editorEl = document.createElement("div");
      containerRef.current.appendChild(editorEl);

      const quill = new Quill(editorEl, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      // Set initial HTML value (without triggering onChange)
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        // Move cursor to end
        quill.setSelection(quill.getLength(), 0);
      }

      // Propagate changes upward
      quill.on("text-change", () => {
        const html = quill.getSemanticHTML();
        onChange(html === "<p><br></p>" ? "" : html);
      });
    });

    return () => {
      destroyed = true;
      // Cleanup on unmount
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. draft restore) WITHOUT losing cursor
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const currentHtml = quill.getSemanticHTML();
    const normalised = currentHtml === "<p><br></p>" ? "" : currentHtml;
    if (normalised !== value) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value ?? "");
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`quill-wrapper ${className}`}
      style={{ minHeight: 160 }}
    />
  );
}
