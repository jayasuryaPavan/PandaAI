"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface MoltbotHook {
    messages: Message[]
    sendMessage: (text: string) => void
    isConnected: boolean
    isThinking: boolean
}

export function useMoltbot(): MoltbotHook {
    const [messages, setMessages] = useState<Message[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [isThinking, setIsThinking] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        // Connect to Moltbot Gateway with Auth Token
        // Token from global clawdbot.json
        const token = "25415d2e7014ed8afc5d00a7b464934477ef73512dffb2bb"
        const ws = new WebSocket(`ws://localhost:18789?token=${token}`)

        ws.onopen = () => {
            console.log("Connected to Moltbot Gateway 🦞")
            setIsConnected(true)
        }

        ws.onclose = () => {
            console.log("Disconnected from Moltbot Gateway")
            setIsConnected(false)
        }

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                // Handle incoming messages from the bot
                // Note: You'll need to adapt this parsing based on the actual 
                // JSON structure Moltbot sends back. 
                // This is a generic handler for now.
                if (data.type === "message" || data.text) {
                    const content = data.text || data.content || JSON.stringify(data)

                    const aiMessage: Message = {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: content,
                        timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, aiMessage])
                    setIsThinking(false)
                }
            } catch (error) {
                console.error("Failed to parse WebSocket message:", error)
            }
        }

        wsRef.current = ws

        return () => {
            ws.close()
        }
    }, [])

    const sendMessage = useCallback((text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket is not connected")
            return
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])
        setIsThinking(true)

        // Construct the payload expected by Moltbot
        // This might need adjustment based on exact Gateway API
        const payload = JSON.stringify({
            text: text,
            // You might need to specify an agent or session ID here
        })

        wsRef.current.send(payload)
    }, [])

    return { messages, sendMessage, isConnected, isThinking }
}
