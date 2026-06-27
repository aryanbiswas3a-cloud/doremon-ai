"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Bot, X, FileText, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AiSidebarProps {
  open: boolean;
  onClose: () => void;
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
];

export function AiSidebar({ open, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 72), 160)}px`;
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    resizeTextarea();
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (chip: string) => {
    setInput(chip);
    textareaRef.current?.focus();
    requestAnimationFrame(resizeTextarea);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 top-11 z-40 flex w-80 flex-col border-l border-[var(--border-default)] bg-[var(--bg-surface)] shadow-2xl transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Bot className="h-4 w-4 shrink-0 text-[var(--accent-ai-text)]" />
          <div>
            <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
              AI Workspace
            </p>
            <p className="text-xs leading-tight text-[var(--text-muted)]">
              Collaborate with Questionputer
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 shrink-0 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="architect" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-4 mt-3 shrink-0 rounded-xl bg-[var(--bg-elevated)] p-1">
          <TabsTrigger
            value="architect"
            className="flex-1 rounded-lg text-xs data-[state=active]:bg-[var(--accent-ai)] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[var(--text-muted)]"
          >
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="flex-1 rounded-lg text-xs data-[state=active]:bg-[var(--accent-ai)] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=inactive]:text-[var(--text-muted)]"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect tab */}
        <TabsContent
          value="architect"
          className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-4 py-10">
                <Bot className="h-8 w-8 text-[var(--text-faint)]" />
                <p className="text-center text-sm text-[var(--text-muted)]">
                  Ask Questionputer to design and architect your system
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="cursor-pointer rounded-full bg-[var(--bg-subtle)] px-3 py-1.5 text-xs text-[var(--accent-ai-text)] transition-opacity hover:opacity-75"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-4 py-4">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-xl border-2 border-[rgba(0,136,255,0.5)] bg-[var(--accent-primary-dim)] px-3 py-2 text-sm text-[var(--text-primary)]">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-start">
                      <div className="max-w-[85%] rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--accent-ai-text)]">
                        {msg.content}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="shrink-0 border-t border-[var(--border-default)] p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask Questionputer…"
                rows={1}
                className="flex-1 resize-none rounded-xl border-[var(--border-default)] bg-[var(--bg-elevated)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus-visible:ring-1 focus-visible:ring-[var(--accent-ai)]"
                style={{ minHeight: "72px", maxHeight: "160px", overflowY: "auto" }}
              />
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="h-8 w-8 shrink-0 rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-[var(--text-faint)]">
              Enter to send · Shift+Enter for newline
            </p>
          </div>
        </TabsContent>

        {/* Specs tab */}
        <TabsContent value="specs" className="mt-0 flex flex-1 flex-col gap-4 p-4">
          <Button className="w-full rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary)]/90">
            Generate Spec
          </Button>

          {/* Demo spec card */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-ai-text)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  E-commerce Backend Spec
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--text-muted)]">
                  Defines API gateway, product service, order service, and payment service with async event architecture.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="h-7 w-7 shrink-0 text-[var(--text-faint)]"
                aria-label="Download spec"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
