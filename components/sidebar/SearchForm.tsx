"use client"

import { Search } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          placeholder="Search..."
          className="pl-8"
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  )
}