"use client"

import { SiteHeader } from "@/components/site/SiteHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

export default function HelpPage() {
  const helpSections = [
    {
      title: "Getting Started",
      items: [
        {
          question: "What is a Business Model Canvas?",
          answer:
            "A Business Model Canvas is a strategic management template used to document and develop business models."
        },
        {
          question: "How do I create my first model?",
          answer:
            "Click the 'New Model' button in the sidebar to create your first model."
        }
      ]
    },
    {
      title: "Using Features",
      items: [
        {
          question: "How does the AI assistant work?",
          answer:
            "Our AI assistant helps by providing suggestions and insights based on your inputs."
        },
        {
          question: "What can I ask the AI?",
          answer: "You can ask for help with any aspect of your business model."
        }
      ]
    }
  ]

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader />
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {helpSections.map(section => (
                <div key={section.title} className="mb-6">
                  <h2 className="mb-4 text-lg font-semibold">
                    {section.title}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
