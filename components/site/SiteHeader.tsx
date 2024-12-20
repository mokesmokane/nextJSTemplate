"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import { Menu, User, LogOut } from "lucide-react"
import { useState } from "react"
import { ThemeSwitcher } from "@/components/utilities/theme-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Settings, CreditCard } from "lucide-react"
import { useSidebar } from "@/lib/context/sidebar-context"
import { SubscriptionBadge } from "./SubscriptionBadge"
import { getAuth, signOut } from "firebase/auth"

export function SiteHeader() {
  const { user, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isExpanded, toggleSidebar } = useSidebar()

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      const auth = getAuth()
      await signOut(auth)

      // Clear session cookie
      await fetch("/api/auth/session", { method: "DELETE" })

      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="size-6" />
          </Button>
          <Link href="/" className="text-xl font-bold hover:opacity-80">
            MyApp
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden items-center space-x-4 md:flex">
            {isAuthenticated ? (
              <SubscriptionBadge />
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="rounded-full px-3 py-1 hover:opacity-80"
                >
                  Pricing
                </Link>
                <Link
                  href="/help"
                  className="rounded-full px-3 py-1 hover:opacity-80"
                >
                  Help
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-8 rounded-full p-0"
                  >
                    <User className="size-4" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/settings"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/billing"
                      className="flex w-full cursor-pointer items-center"
                    >
                      <CreditCard className="mr-2 size-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-1 hover:opacity-80"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full px-3 py-1 hover:opacity-80"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden"
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="bg-primary-foreground text-primary p-4 md:hidden">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="block hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    href="/pricing"
                    className="block hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="block hover:underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Help
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li>
                <Link
                  href="/settings"
                  className="block hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
