/*
<ai_context>
This client component provides the providers for the app.
</ai_context>
*/

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import { CSPostHogProvider } from "./posthog/posthog-provider"
import { DateProvider } from "@/lib/context/date-context"
import { TasksProvider } from "@/lib/context/tasks-context"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <DateProvider>
        <TasksProvider>
          <TooltipProvider>
            <CSPostHogProvider>{children}</CSPostHogProvider>
          </TooltipProvider>
        </TasksProvider>
      </DateProvider>
    </ThemeProvider>
  )
}
