'use client'

import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, LogOut, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

interface SidebarFooterProps {
  isExpanded: boolean
}

export function SidebarFooter({ isExpanded }: SidebarFooterProps) {
  const { theme, setTheme } = useTheme()

  const items = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: theme === 'light' ? Moon : Sun, label: 'Theme', action: () => setTheme(theme === 'light' ? 'dark' : 'light') },
    { icon: LogOut, label: 'Sign Out', action: () => { window.location.href = '/' } },
  ]

  return (
    <div className={`mt-auto border-t border-zinc-300/50 dark:border-zinc-800/50 w-full ${isExpanded ? 'py-2' : 'py-4'}`}>
      {isExpanded ? (
        <div className="flex flex-col gap-2 px-4">
          {items.map(({ icon: Icon, label, href, action }) => (
            <div key={label}>
              {href ? (
                <Link href={href}>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent" onClick={action}>
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {items.map(({ icon: Icon, label, href, action }) => (
            <div key={label}>
              {href ? (
                <Link href={href}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={action}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}