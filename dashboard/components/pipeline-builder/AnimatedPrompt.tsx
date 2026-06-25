"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedPromptProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  agentName?: string;
  agentColor?: string;
}

export function AnimatedPrompt({
  value,
  onChange,
  placeholder = "Write the instructions for this agent...",
  minHeight = 80,
  maxHeight = 240,
  agentName,
  agentColor = "var(--primary)",
}: AnimatedPromptProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
    setCharCount(value.length);
  }, [value, adjustHeight]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl+Enter to quickly "send" (fires onChange with a slight action trigger)
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Just a visual cue—the parent handles the actual action
      }
    },
    []
  );

  return (
    <div className="relative">
      {/* Animated container */}
      <motion.div
        className={cn(
          "relative rounded-xl border backdrop-blur-sm transition-all duration-300",
          isFocused
            ? "border-[var(--primary)]/40 shadow-lg shadow-[var(--primary)]/5"
            : "border-white/10 hover:border-white/20"
        )}
        style={{ background: "rgba(0,0,0,0.2)" }}
        animate={{
          scale: isFocused ? 1.005 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Glow effect on focus */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute -inset-0.5 rounded-xl opacity-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `linear-gradient(135deg, ${agentColor}22, transparent, ${agentColor}11)`,
                filter: "blur(8px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Agent indicator bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
          style={{
            background: isFocused
              ? `linear-gradient(90deg, ${agentColor}, ${agentColor}44, transparent)`
              : `linear-gradient(90deg, ${agentColor}44, transparent)`,
          }}
        />

        {/* Textarea */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full resize-none bg-transparent text-sm leading-relaxed",
              "focus:outline-none",
              "placeholder:text-white/20",
              "transition-colors duration-200"
            )}
            style={{
              color: value ? "var(--foreground)" : "var(--muted-foreground)",
              minHeight: `${minHeight}px`,
              maxHeight: `${maxHeight}px`,
              overflow: "auto",
            }}
          />
        </div>

        {/* Bottom bar with controls */}
        <div
          className="flex items-center justify-between px-3 py-2 border-t rounded-b-xl"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          {/* Agent badge */}
          <div className="flex items-center gap-1.5">
            {agentName && (
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]"
                style={{ background: `${agentColor}15`, color: agentColor }}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles size={8} />
                {agentName}
              </motion.div>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Word/char count */}
            <motion.span
              className="text-[9px] font-mono"
              style={{ color: "var(--muted-foreground)" }}
              animate={{ opacity: isFocused ? 1 : 0.5 }}
            >
              {charCount} chars
              {charCount > 0 && (
                <span className="ml-1">
                  · ~{Math.max(1, Math.round(charCount / 4))} tokens
                </span>
              )}
            </motion.span>

            {/* Send / action button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-[9px] transition-all",
                value.trim()
                  ? "opacity-100"
                  : "opacity-30 cursor-not-allowed"
              )}
              style={{
                background: value.trim() ? `${agentColor}20` : "transparent",
                color: value.trim() ? agentColor : "var(--muted-foreground)",
              }}
              onClick={() => {
                if (!value.trim()) return;
                // Visual feedback — ripple effect
                const btn = textareaRef.current?.parentElement?.parentElement;
                if (btn) {
                  const ripple = document.createElement("span");
                  ripple.className = "absolute inset-0 rounded-xl pointer-events-none";
                  ripple.style.background = `${agentColor}10`;
                  ripple.style.animation = "ripple 0.6s ease-out";
                  btn.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }
              }}
            >
              <Send size={8} />
              Apply
            </motion.button>
          </div>
        </div>

        {/* Sparkle/ambient particles on focus */}
        <AnimatePresence>
          {isFocused && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full pointer-events-none"
                  initial={{
                    opacity: 0,
                    x: Math.random() * 100,
                    y: Math.random() * 100 + 20,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    y: [null, null, -20 - Math.random() * 40],
                    x: [null, null, Math.random() * 200 - 100],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    bottom: "40%",
                    background: agentColor,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ripple animation keyframes injected once */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
