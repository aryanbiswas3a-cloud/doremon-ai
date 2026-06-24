"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-3">
      {/* Left */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Center */}
      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center" />
    </nav>
  );
}
