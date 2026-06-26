"use client";
import { useEffect, useRef, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  fileName?: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  fileName,
  onSave,
  onCancel,
  height = "400px",
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [dirty, setDirty] = useState(false);
  const currentValue = useRef(value);

  useEffect(() => {
    currentValue.current = value;
  }, [value]);

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newVal = update.state.doc.toString();
        currentValue.current = newVal;
        setDirty(true);
        onChange?.(newVal);
      }
    });

    const readOnlyComp = new Compartment();

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown({ base: markdownLanguage }),
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        updateListener,
        EditorView.theme({
          "&": { fontSize: "13px", height },
          ".cm-scroller": { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
          ".cm-gutters": { fontSize: "11px" },
        }),
        readOnlyComp.of(readOnly ? EditorView.editable.of(false) : []),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Mount once

  const handleSave = () => {
    if (onSave && currentValue.current) {
      onSave(currentValue.current);
      setDirty(false);
    }
  };

  const handleCancel = () => {
    if (viewRef.current && value !== undefined) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
    setDirty(false);
    onCancel?.();
  };

  return (
    <div className="space-y-2">
      {(fileName || onSave) && (
        <div className="flex items-center justify-between">
          {fileName && (
            <span className="text-[10px] font-mono opacity-60" style={{ color: "var(--muted-foreground)" }}>
              {fileName}
            </span>
          )}
          <div className="flex items-center gap-1">
            {dirty && onCancel && (
              <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 text-[10px]">
                <X size={12} />
                Revert
              </Button>
            )}
            {onSave && (
              <Button variant="ghost" size="sm" onClick={handleSave} disabled={!dirty} className="h-6 text-[10px]">
                <Save size={12} />
                {dirty ? "Save" : "Saved"}
              </Button>
            )}
          </div>
        </div>
      )}
      <div
        ref={editorRef}
        className="rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}
