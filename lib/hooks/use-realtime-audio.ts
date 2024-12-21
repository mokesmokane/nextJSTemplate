import { useState, useRef, useEffect } from "react"

interface UseRealtimeAudioProps {
  onDataChannelMessage?: (event: MessageEvent) => void
  voice?: string
}

interface UseRealtimeAudioReturn {
  isSessionActive: boolean
  dataChannel: RTCDataChannel | null
  audioLevels: number[]
  userAudioLevels: number[]
  realtimeMode: "debug" | "openai"
  voice: string
  startSession: () => Promise<void>
  stopSession: () => void
  setRealtimeMode: (mode: "debug" | "openai") => void
  setVoice: (voice: string) => void
}

export function useRealtimeAudio({
  onDataChannelMessage
}: UseRealtimeAudioProps = {}): UseRealtimeAudioReturn {
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null)
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(30).fill(0))
  const [userAudioLevels, setUserAudioLevels] = useState<number[]>(
    Array(30).fill(0)
  )
  const [realtimeMode, setRealtimeMode] = useState<"debug" | "openai">("debug")
  const [voice, setVoice] = useState<string>("alloy")
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const audioElement = useRef<HTMLAudioElement | null>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const userAnalyser = useRef<AnalyserNode | null>(null)

  const calculateLevels = (analyserNode: AnalyserNode) => {
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount)
    analyserNode.getByteFrequencyData(dataArray)

    const levelCount = 30
    const segmentLength = Math.floor(dataArray.length / levelCount)

    var res = Array.from({ length: levelCount }, (_, i) => {
      const start = i * segmentLength
      const segment = dataArray.slice(start, start + segmentLength)
      const average = segment.reduce((a, b) => a + b, 0) / segmentLength
      return Number((average / 255).toFixed(1))
    })

    // Take first 15 items, reverse them, and add to front of array
    const mirror = res.slice(0, 15).reverse()
    res = [...mirror, ...res.slice(0, 15)]

    if (res[0] > 0.05) {
      console.log("level:", res[0])
    }

    return res
  }

  const updateAudioLevels = () => {
    if (!isSessionActive) return

    if (analyser.current) {
      setAudioLevels(calculateLevels(analyser.current))
    }

    if (userAnalyser.current) {
      setUserAudioLevels(calculateLevels(userAnalyser.current))
    }
  }

  // Start a realtime session
  const startSession = async () => {
    try {
      // Set up audio context and analyser
      audioContext.current = new AudioContext()

      if (realtimeMode === "debug") {
        // Debug mode - only set up local audio analysis
        const ms = await navigator.mediaDevices.getUserMedia({
          audio: true
        })

        if (audioContext.current) {
          userAnalyser.current = audioContext.current.createAnalyser()
          userAnalyser.current.fftSize = 2048
          const userSource = audioContext.current.createMediaStreamSource(ms)
          userSource.connect(userAnalyser.current)
        }

        setIsSessionActive(true)
        return
      }

      // Original OpenAI connection logic
      const tokenResponse = await fetch("/api/realtime-token")
      const data = await tokenResponse.json()
      const EPHEMERAL_KEY = data.client_secret.value

      const pc = new RTCPeerConnection()
      peerConnection.current = pc

      // Set up audio context and analyser
      audioContext.current = new AudioContext()
      analyser.current = audioContext.current.createAnalyser()
      analyser.current.fftSize = 2048

      // Set up to play remote audio from the model
      audioElement.current = document.createElement("audio")
      audioElement.current.autoplay = true

      pc.ontrack = e => {
        if (audioElement.current && audioContext.current && analyser.current) {
          audioElement.current.srcObject = e.streams[0]

          // Connect audio to analyser
          const source = audioContext.current.createMediaStreamSource(
            e.streams[0]
          )
          source.connect(analyser.current)
        }
      }

      // Add local audio track for microphone input
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      pc.addTrack(ms.getTracks()[0])

      // Add user audio analysis
      if (audioContext.current) {
        userAnalyser.current = audioContext.current.createAnalyser()
        userAnalyser.current.fftSize = 2048
        const userSource = audioContext.current.createMediaStreamSource(ms)
        userSource.connect(userAnalyser.current)
      }

      const dc = pc.createDataChannel("oai-events")
      setDataChannel(dc)

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const baseUrl = "https://api.openai.com/v1/realtime"
      const model = "gpt-4o-realtime-preview-2024-12-17"
      const sdpResponse = await fetch(
        `${baseUrl}?model=${model}&voice=${voice}`,
        {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp"
          }
        }
      )

      const answer = new RTCSessionDescription({
        type: "answer",
        sdp: await sdpResponse.text()
      })
      await pc.setRemoteDescription(answer)

      setIsSessionActive(true)
    } catch (err) {
      console.error("Failed to start realtime session:", err)
    }
  }

  const stopSession = () => {
    if (realtimeMode === "debug") {
      if (audioContext.current) {
        audioContext.current.close()
      }
      setIsSessionActive(false)
      setAudioLevels(Array(30).fill(0))
      setUserAudioLevels(Array(30).fill(0))
      return
    }

    if (dataChannel) {
      dataChannel.close()
    }
    if (peerConnection.current) {
      peerConnection.current.close()
    }
    if (audioContext.current) {
      audioContext.current.close()
    }
    setIsSessionActive(false)
    setDataChannel(null)
    peerConnection.current = null
    setAudioLevels(Array(30).fill(0))
    setUserAudioLevels(Array(30).fill(0))
  }

  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true)
      })

      if (onDataChannelMessage) {
        dataChannel.addEventListener("message", onDataChannelMessage)
      }

      return () => {
        if (onDataChannelMessage) {
          dataChannel.removeEventListener("message", onDataChannelMessage)
        }
      }
    }
  }, [dataChannel, onDataChannelMessage])

  // Animation frame loop for updating audio levels
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      updateAudioLevels()
      animationFrameId = requestAnimationFrame(animate)
    }

    if (isSessionActive) {
      animate()
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isSessionActive])

  return {
    isSessionActive,
    dataChannel,
    audioLevels,
    userAudioLevels,
    realtimeMode,
    voice,
    setVoice,
    setRealtimeMode,
    startSession,
    stopSession
  }
}
