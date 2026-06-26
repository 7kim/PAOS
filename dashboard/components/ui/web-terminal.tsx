"use client";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

interface WebTerminalProps {
  /** WebSocket URL or /api/terminal endpoint for streaming output. */
  streamUrl?: string;
  /** Initial session ID to reconnect to an existing terminal session. */
  sessionId?: string;
  /** Height of the terminal container. */
  height?: string;
  /** Called when the terminal session closes. */
  onClose?: () => void;
}

export function WebTerminal({
  streamUrl,
  sessionId,
  height = "400px",
  onClose,
}: WebTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      theme: {
        background: "#0d1117",
        foreground: "#e6edf3",
        cursor: "#f0b90b",
        selectionBackground: "#f0b90b40",
        black: "#484f58",
        red: "#ff7b72",
        green: "#3fb950",
        yellow: "#d29922",
        blue: "#58a6ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#b1bac4",
        brightBlack: "#6e7681",
        brightRed: "#ffa198",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#d2a8ff",
        brightCyan: "#56d4dd",
        brightWhite: "#f0f6fc",
      },
      allowTransparency: true,
      rows: 24,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(containerRef.current);
    fitAddon.fit();
    terminalRef.current = term;

    term.writeln("\x1b[33mPAOS Terminal\x1b[0m — connected");
    term.writeln("");

    // Auto-fit on resize
    const resizeObserver = new ResizeObserver(() => {
      try { fitAddon.fit(); } catch { /* ignore */ }
    });
    resizeObserver.observe(containerRef.current);

    // Connect to stream if URL provided
    let ws: WebSocket | null = null;
    if (streamUrl) {
      try {
        ws = new WebSocket(streamUrl);
        ws.onmessage = (event) => {
          term.write(event.data);
        };
        ws.onclose = () => {
          term.writeln("\r\n\x1b[31mConnection closed\x1b[0m");
          onClose?.();
        };
        ws.onerror = () => {
          term.writeln("\r\n\x1b[31mConnection error\x1b[0m");
        };

        // Send keystrokes to WebSocket
        term.onData((data) => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
        });
      } catch {
        term.writeln("\x1b[31mWebSocket not available — display only\x1b[0m");
      }
    } else {
      term.writeln("No stream URL configured. Display mode only.");
      if (sessionId) {
        term.writeln(`Session: ${sessionId}`);
      }
    }

    return () => {
      resizeObserver.disconnect();
      ws?.close();
      term.dispose();
      terminalRef.current = null;
    };
  }, [streamUrl, sessionId, onClose]);

  return (
    <div
      ref={containerRef}
      style={{
        height,
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    />
  );
}
