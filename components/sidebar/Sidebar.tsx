"use client"

import { Button } from "@/components/ui/button"
import { SearchForm } from "./SearchForm"
import { SidebarFooter } from "./SidebarFooter"
import { useSidebar } from "@/lib/context/sidebar-context"
import { ChatForm } from "../ai-chat/chat"

export function Sidebar() {
  const { isExpanded } = useSidebar()

  return (
    <div
      className={`bg-background flex h-[calc(100vh-64px)] flex-col border-r border-zinc-300/50 transition-all duration-300 ease-in-out dark:border-zinc-800/50 ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      {isExpanded && (
        <div className="p-2">
          <SearchForm />
        </div>
      )}
      <nav className="flex-1 space-y-2 overflow-auto p-2">
        <Button
          variant="ghost"
          className="hover:bg-accent w-full justify-start"
        >
          Dashboard
        </Button>
        <Button
          variant="ghost"
          className="hover:bg-accent w-full justify-start"
        >
          Projects
        </Button>
      </nav>
      <div className="flex min-h-[300px] flex-col">
        <ChatForm />
      </div>
      <SidebarFooter isExpanded={isExpanded} />
    </div>
  )
}
