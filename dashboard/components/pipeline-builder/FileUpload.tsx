"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File as FileIcon, X, Loader, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: { name: string; path: string; size: number }[]) => void;
  maxSize?: number;
}

export function FileUpload({ onFilesSelected, maxSize = 10 * 1024 * 1024 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; path: string; size: number; progress: number }[]>([]);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter((f) => f.size <= maxSize)
      .map((file, i) => ({
        name: file.name,
        path: `uploaded/${Date.now()}-${i}-${file.name}`,
        size: file.size,
        progress: 0,
      }));

    if (newFiles.length === 0) return;

    setFiles((prev) => [...prev, ...newFiles]);
    onFilesSelected(newFiles.map(({ name, path, size }) => ({ name, path, size })));

    // Simulate upload progress
    newFiles.forEach((f) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
        }
        setFiles((prev) =>
          prev.map((pf) => (pf.path === f.path ? { ...pf, progress: Math.min(progress, 100) } : pf))
        );
      }, 200);
    });
  }, [maxSize, onFilesSelected]);

  const removeFile = useCallback((path: string) => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) processFiles(files);
          };
          input.click();
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
          isDragging
            ? "border-[var(--primary)] bg-[var(--primary)]/5"
            : "border-white/10 hover:border-white/20 hover:bg-white/5"
        )}
      >
        <UploadCloud
          size={20}
          className="mx-auto mb-1"
          style={{ color: isDragging ? "var(--primary)" : "var(--muted-foreground)" }}
        />
        <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {isDragging ? "Drop files here" : "Drop files or click to browse"}
        </p>
        <p className="text-[8px] mt-0.5 opacity-50" style={{ color: "var(--muted-foreground)" }}>
          Max {(maxSize / (1024 * 1024)).toFixed(0)} MB per file
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file.path}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5 text-[10px]"
            >
              {file.progress >= 100 ? (
                <CheckCircle size={10} className="text-green-500 shrink-0" />
              ) : (
                <Loader size={10} className="animate-spin shrink-0" style={{ color: "var(--primary)" }} />
              )}
              <FileIcon size={10} className="shrink-0 opacity-60" />
              <span className="truncate flex-1">{file.name}</span>
              <span className="opacity-50 shrink-0">{formatSize(file.size)}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(file.path); }}
                className="text-red-400 hover:text-red-300 shrink-0"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
