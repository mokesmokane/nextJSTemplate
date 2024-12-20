"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useChat } from "ai/react"
import { ArrowUpIcon, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/ai-chat/autoresize-textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat"
  })

  const [isPoppedOut, setIsPoppedOut] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 400, height: 500 })
  const [isResizing, setIsResizing] = useState(false)
  const resizeDirection = useRef<string | null>(null)
  const initialSize = useRef({ width: 0, height: 0 })
  const initialPosition = useRef({ x: 0, y: 0 })

  // Realtime session states
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const audioElement = useRef<HTMLAudioElement | null>(null)

  const handlePopOutToggle = () => {
    setIsPoppedOut(!isPoppedOut)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isSessionActive) {
      // Normal chat mode
      void append({ content: input, role: "user" })
    } else {
      // Realtime session active - send via data channel
      if (dataChannel && dataChannel.readyState === "open") {
        const event = {
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: input
              }
            ]
          }
        }
        dataChannel.send(JSON.stringify(event))
        // Also request a response
        dataChannel.send(JSON.stringify({ type: "response.create" }))
      }
    }
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  // Start a realtime session
  async function startSession() {
    try {
      const tokenResponse = await fetch("/api/realtime-token")
      const data = await tokenResponse.json()
      const EPHEMERAL_KEY = data.client_secret.value

      const pc = new RTCPeerConnection()

      // Set up to play remote audio from the model
      audioElement.current = document.createElement("audio")
      audioElement.current.autoplay = true
      pc.ontrack = e => (audioElement.current!.srcObject = e.streams[0])

      // Add local audio track for microphone input
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      pc.addTrack(ms.getTracks()[0])

      const dc = pc.createDataChannel("oai-events")
      setDataChannel(dc)

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = "https://api.openai.com/v1/realtime"
      const model = "gpt-4o-realtime-preview-2024-12-17"
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        }
      })

      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: await sdpResponse.text()
      })
      await pc.setRemoteDescription(answer)

      peerConnection.current = pc
    } catch (err) {
      console.error("Failed to start realtime session:", err)
    }
  }

  function stopSession() {
    if (dataChannel) {
      dataChannel.close()
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    setIsSessionActive(false)
    setDataChannel(null)
    peerConnection.current = null
  }

  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true)
      })
      dataChannel.addEventListener("message", e => {
        // Handle incoming messages if desired
        // console.log("Realtime event:", JSON.parse(e.data))
      })
    }
  }, [dataChannel])

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.content}
        </div>
      ))}
    </div>
  )

  const mainContent = (
    <main
      className={cn(
        "ring-none flex size-full flex-col items-stretch border-none",
        className
      )}
      {...props}
    >
      <div className="min-h-0 flex-1 content-center overflow-y-auto px-6 [&::-webkit-scrollbar]:hidden">
        {messages.length ? messageList : <div>No messages yet</div>}
      </div>
      <div className="shrink-0">
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={v => setInput(v)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-1 right-1 size-6 rounded-full"
              >
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </div>
    </main>
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPoppedOut) return
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    const newX = e.clientX - dragOffset.current.x
    const newY = e.clientY - dragOffset.current.y
    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeDirection.current = direction
    initialSize.current = { width: size.width, height: size.height }
    initialPosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const dx = e.clientX - initialPosition.current.x
    const dy = e.clientY - initialPosition.current.y

    switch (resizeDirection.current) {
      case "e":
        setSize(prev => ({
          ...prev,
          width: Math.max(300, initialSize.current.width + dx)
        }))
        break
      case "s":
        setSize(prev => ({
          ...prev,
          height: Math.max(400, initialSize.current.height + dy)
        }))
        break
      case "se":
        setSize({
          width: Math.max(300, initialSize.current.width + dx),
          height: Math.max(400, initialSize.current.height + dy)
        })
        break
      case "n":
        {
          const newHeight = Math.max(200, initialSize.current.height - dy)
          setSize(prev => ({ ...prev, height: newHeight }))
        }
        break
    }
  }

  const handleResizeUp = () => {
    setIsResizing(false)
    resizeDirection.current = null
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove)
      window.addEventListener("mouseup", handleResizeUp)
    } else {
      window.removeEventListener("mousemove", handleResizeMove)
      window.removeEventListener("mouseup", handleResizeUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove)
      window.removeEventListener("mouseup", handleResizeUp)
    }
  }, [isResizing])

  if (!isPoppedOut) {
    // Inline mode
    return (
      <Card
        className="relative flex flex-col border-none shadow-none"
        style={{ height: size.height }}
      >
        <CardHeader className="shrink-0 p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            <CardTitle className="flex-1 text-sm font-medium">
              AI Assistant
            </CardTitle>
            {!isSessionActive ? (
              <Button variant="outline" size="sm" onClick={startSession}>
                Start Realtime Chat
              </Button>
            ) : (
              <Button variant="destructive" size="sm" onClick={stopSession}>
                Stop Realtime Chat
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handlePopOutToggle}>
              Pop Out
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col p-4 pt-0">
          {mainContent}
        </CardContent>

        <div
          className="group absolute inset-x-0 top-0 h-2 cursor-n-resize hover:bg-gray-300/20"
          onMouseDown={e => handleResizeMouseDown(e, "n")}
        >
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-200 group-hover:bg-gray-400 dark:bg-gray-700 dark:group-hover:bg-gray-500" />
        </div>
      </Card>
    )
  }

  // Popped out mode
  return (
    <div
      className="fixed z-50 flex flex-col rounded border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        position: "fixed"
      }}
    >
      <div
        className="flex shrink-0 cursor-move items-center border-b border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800"
        onMouseDown={handleMouseDown}
      >
        <MessageCircle className="size-5" />
        <span className="ml-2 flex-1 text-sm font-medium">AI Assistant</span>
        {!isSessionActive ? (
          <Button variant="outline" size="sm" onClick={startSession}>
            Start Realtime Chat
          </Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={stopSession}>
            Stop Realtime Chat
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handlePopOutToggle}>
          Dock
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{mainContent}</div>

      {/* Resize handles */}
      <div
        className="absolute inset-y-0 right-0 w-2 cursor-e-resize hover:bg-gray-300/20"
        onMouseDown={e => handleResizeMouseDown(e, "e")}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2 cursor-s-resize hover:bg-gray-300/20"
        onMouseDown={e => handleResizeMouseDown(e, "s")}
      />
      <div
        className="absolute bottom-0 right-0 size-4 cursor-se-resize hover:bg-gray-300/20"
        onMouseDown={e => handleResizeMouseDown(e, "se")}
      />
    </div>
  )
}
