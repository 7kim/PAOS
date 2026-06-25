"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, MessageSquare, Calendar, FolderKanban, ChevronRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DailyNote {
  date: string;
  preview: string;
  path: string;
}

interface ChatEntry {
  slug: string;
  title: string;
  preview: string;
  path: string;
}

export default function VaultPageWrapperWrapper() {
  return (
    <Suspense fallback={"Loading..."}>
      <VaultPageWrapper />
    </Suspense>
  );
}

function VaultPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <VaultPage />
    </Suspense>
  );
}

function VaultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectFilter = searchParams?.get("project") || "";
  const [tab, setTab] = useState<"daily" | "chats">("daily");
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);

    const [dailyRes, chatsRes] = await Promise.all([
      fetch(`/api/vault?type=daily&${params}`),
      fetch(`/api/vault?type=chats&${params}`),
    ]);
    const dailyData = await dailyRes.json();
    const chatsData = await chatsRes.json();
    setNotes(dailyData.notes ?? []);
    setChats(chatsData.chats ?? []);
    setLoading(false);
  }, [projectFilter]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  async function openNote(date: string) {
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    params.set("date", date);
    const res = await fetch(`/api/vault?type=daily&${params}`);
    const data = await res.json();
    setSelectedContent(data.content || "Not found");
  }

  async function openChat(slug: string) {
    const params = new URLSearchParams();
    if (projectFilter) params.set("project", projectFilter);
    params.set("slug", slug);
    const res = await fetch(`/api/vault?type=chats&${params}`);
    const data = await res.json();
    setSelectedContent(data.content || "Not found");
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Left: list */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} style={{ color: "var(--primary)" }} />
          <h1 className="text-xl font-semibold">Vault</h1>
          {projectFilter && (
            <Badge variant="outline" className="text-[10px] ml-auto">
              <FolderKanban size={10} className="inline mr-1" />
              {projectFilter}
            </Badge>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex bg-muted rounded-lg p-1 border">
          <button
            onClick={() => setTab("daily")}
            className="flex-1 px-3 py-1.5 text-xs rounded-md transition-all flex items-center justify-center gap-1"
            style={{
              background: tab === "daily" ? "var(--primary)" : "transparent",
              color: tab === "daily" ? "var(--primary-foreground)" : undefined,
              fontWeight: tab === "daily" ? 600 : 400,
            }}
          >
            <Calendar size={11} />
            Daily Notes
          </button>
          <button
            onClick={() => setTab("chats")}
            className="flex-1 px-3 py-1.5 text-xs rounded-md transition-all flex items-center justify-center gap-1"
            style={{
              background: tab === "chats" ? "var(--primary)" : "transparent",
              color: tab === "chats" ? "var(--primary-foreground)" : undefined,
              fontWeight: tab === "chats" ? 600 : 400,
            }}
          >
            <MessageSquare size={11} />
            Chats
          </button>
        </div>

        {/* Item list */}
        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-2">
            {loading ? (
              <div className="text-xs text-center py-8 text-muted-foreground">Loading...</div>
            ) : tab === "daily" ? (
              notes.length === 0 ? (
                <div className="text-xs text-center py-8 text-muted-foreground">No daily notes</div>
              ) : (
                notes.map((n) => (
                  <button
                    key={n.date}
                    type="button"
                    onClick={() => openNote(n.date)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors mb-1"
                  >
                    <div className="text-xs font-medium">{n.date}</div>
                    {n.preview && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{n.preview}</div>
                    )}
                  </button>
                ))
              )
            ) : (
              chats.length === 0 ? (
                <div className="text-xs text-center py-8 text-muted-foreground">No chats</div>
              ) : (
                chats.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => openChat(c.slug)}
                    className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors mb-1"
                  >
                    <div className="text-xs font-medium truncate">{c.title}</div>
                    {c.preview && (
                      <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{c.preview}</div>
                    )}
                  </button>
                ))
              )
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Right: content viewer */}
      <div className="flex-1 min-w-0">
        {selectedContent ? (
          <Card className="h-full overflow-hidden">
            <ScrollArea className="h-full p-4">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ opacity: 0.85 }}>
                {selectedContent}
              </pre>
            </ScrollArea>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground rounded-lg border bg-card">
            <div className="text-center">
              <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
              <p>Select a note or chat to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
