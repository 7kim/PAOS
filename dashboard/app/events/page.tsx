"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Activity, FolderKanban, RefreshCw, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

export default function EventsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <EventsPage />
    </Suspense>
  );
}

function EventsPage() {
  const searchParams = useSearchParams();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const [projectData, setProjectData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = urlProject ? `?project=${encodeURIComponent(urlProject)}` : "";
    const res = await fetch(`/api/events${params}`);
    const data = await res.json();

    if (urlProject) {
      setProjectData({ [urlProject]: data.content || "No events found." });
    } else if (data.projects) {
      setProjectData(data.projects);
    } else if (data.content) {
      setProjectData({ [data.project || "project"]: data.content });
    }
    setLoading(false);
  }, [urlProject]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  const projectNames = Object.keys(projectData);
  const showAll = viewAll && !urlProject;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <Activity size={18} style={{ color: "var(--primary)" }} />
        <h1 className="text-xl font-semibold">Project Events</h1>
        {showAll ? (
          <Badge variant="outline" className="text-[10px] gap-1">
            <Eye size={10} />
            View All ({projectNames.length})
          </Badge>
        ) : urlProject ? (
          <Badge variant="outline" className="text-[10px]">
            <FolderKanban size={10} className="inline mr-1" />
            {urlProject}
          </Badge>
        ) : null}
        <Button variant="outline" size="sm" onClick={() => load()} className="ml-auto gap-1.5 text-xs">
          <RefreshCw size={12} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : projectNames.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No projects found. Create a project to see its events.
          </CardContent>
        </Card>
      ) : showAll ? (
        <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto">
          {projectNames.map((proj) => (
            <Card key={proj} className="flex-1 overflow-hidden">
              <CardHeader className="py-3">
                <CardTitle className="text-xs font-semibold flex items-center gap-2">
                  <FolderKanban size={12} />
                  {proj}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[30vh]">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-3" style={{ opacity: 0.85 }}>
                    {projectData[proj]}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex-1 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Activity size={12} />
              Event Log
              <span className="ml-auto text-[10px] font-normal text-muted-foreground">{urlProject}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-14rem)]">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono p-4" style={{ opacity: 0.85 }}>
                {projectData[urlProject] || "No events found."}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
