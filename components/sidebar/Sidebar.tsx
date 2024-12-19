'use client'

import { Button } from "@/components/ui/button"
import { SearchForm } from "./SearchForm"
import { SidebarFooter } from "./SidebarFooter"
import { useSidebar } from "@/lib/context/sidebar-context"

export function Sidebar() {
  const { isExpanded } = useSidebar()

  return (
    <div 
      className={`flex flex-col h-[calc(100vh-64px)] bg-background border-r border-zinc-300/50 dark:border-zinc-800/50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      {isExpanded && (
        <div className="p-2">
          <SearchForm />
        </div>
      )}
      <nav className="flex-1 overflow-auto p-2 space-y-2">
        <Button variant="ghost" className="w-full justify-start hover:bg-accent">
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-accent">
          Projects
        </Button>
      </nav>
      <SidebarFooter isExpanded={isExpanded} />
    </div>
  )
}