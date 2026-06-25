"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Edit3, Save, X, Loader2, FolderKanban } from "lucide-react";
import { formatTime } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

export default function HandoffPageWrapperWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <HandoffPageWrapper />
    </Suspense>
  );
}

function HandoffPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <HandoffPage />
    </Suspense>
  );
}

function HandoffPage() {
  const searchParams = useSearchParams();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [content, setContent] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const params = projectFilter ? `?project=${encodeURIComponent(projectFilter)}` : "";
    const res = await fetch(`/api/handoff${params}`);
    const data = await res.json();
    setContent(data.content ?? "");
    setUpdatedAt(data.updatedAt ?? null);
    setLoading(false);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => {
      if (!editing) void load();
    }, 10000);
    return () => clearInterval(id);
  }, [load, editing]);

  const startEditing = useCallback(() => {
    setEditContent(content);
    setEditing(true);
  }, [content]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setEditContent("");
  }, []);

  const saveEditing = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        setContent(editContent);
        setEditing(false);
        setUpdatedAt(new Date().toISOString());
      }
    } catch { /* ignore */ }
    setSaving(false);
  }, [editContent]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Handoff</CardTitle>
            <CardDescription>
              Live state — what every agent reads first.
              {updatedAt && (
                <span className="ml-2 font-mono text-xs">
                  fetched {formatTime(updatedAt)}
                </span>
              )}
              {editing && (
                <span className="ml-2 font-mono text-xs" style={{ color: "var(--orange)" }}>
                  · editing
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button
                  onClick={saveEditing}
                  disabled={saving}
                  variant="default"
                  size="sm"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={cancelEditing}
                  variant="outline"
                  size="sm"
                >
                  <X size={12} />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={startEditing}
                variant="outline"
                size="sm"
              >
                <Edit3 size={12} />
                Edit
              </Button>
            )}
            <Button
              onClick={load}
              disabled={editing}
              variant="outline"
              size="sm"
            >
              <RefreshCw size={12} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg border p-5"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
        >
          {loading ? (
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Loading…</p>
          ) : editing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[60vh] text-xs leading-relaxed font-mono rounded-lg p-4 border resize-y"
              style={{
                background: "rgba(0,0,0,0.05)",
                color: "var(--foreground)",
                borderColor: "var(--orange)",
              }}
            />
          ) : (
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap font-mono"
              style={{ color: "var(--foreground)" }}
            >
              {content}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
