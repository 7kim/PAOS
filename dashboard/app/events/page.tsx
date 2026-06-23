"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Activity, FolderKanban, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const projectFilter = urlProject || (viewAll ? "" : (getActiveProject() || "__none__"));
  const [events, setEvents] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!projectFilter || projectFilter === "__none__") {
      setEvents("Select a project to view its event log.\n\nTip: Add ?project=ProjectName to the URL, or disable View All in Settings.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/events?project=${encodeURIComponent(projectFilter)}`);
    const data = await res.json();
    setEvents(data.content || "No events found.");
    setLoading(false);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Activity size={18} style={{ color: "var(--primary)" }} />
        <h1 className="text-xl font-semibold">Project Events</h1>
        {projectFilter && projectFilter !== "__none__" && (
          <Badge variant="outline" className="text-[10px]">
            <FolderKanban size={10} className="inline mr-1" />
            {projectFilter}
          </Badge>
        )}
        <Button variant="outline" size="sm" onClick={() => load()} className="ml-auto gap-1.5 text-xs">
          <RefreshCw size={12} />
          Refresh
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xs font-semibold flex items-center gap-2">
            <Activity size={12} />
            Event Log
            <span className="ml-auto text-[10px] font-normal text-muted-foreground">
              {projectFilter === "__none__" ? "No project selected" : `${projectFilter}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-14rem)]">
            {loading ? (
              <div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-4" style={{ opacity: 0.85 }}>
                {events}
              </pre>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
