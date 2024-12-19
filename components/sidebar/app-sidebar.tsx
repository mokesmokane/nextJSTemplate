"use client"

import { Sidebar } from "./Sidebar"

const data = {
  navMain: [
    {
      title: "Playground",
      url: "#",
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" }
      ]
    },
    {
      title: "Models",
      url: "#",
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" }
      ]
    },
    {
      title: "Documentation",
      url: "#",
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" }
      ]
    },
    {
      title: "Settings",
      url: "#",
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" }
      ]
    }
  ],
  projects: [
    { name: "Design Engineering", url: "#" },
    { name: "Sales & Marketing", url: "#" },
    { name: "Travel", url: "#" }
  ]
}

export function AppSidebar() {
  return (
    <Sidebar />
  )
}