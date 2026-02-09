"use client"

import * as React from "react"
import { Send, Bot, User, Mic } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useMoltbot, Message } from "@/hooks/useMoltbot"

export function ChatInterface() {
    const [input, setInput] = React.useState("")
    const { messages, sendMessage, isConnected, isThinking } = useMoltbot()
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        sendMessage(input)
        setInput("")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/panda-avatar.png" alt="Panda" />
                        <AvatarFallback>🐼</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle>Panda AI</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            Powered by Moltbot & Gemini 2.0 Flash
                            {isConnected ? (
                                <span className="flex h-2 w-2 rounded-full bg-green-500" title="Connected" />
                            ) : (
                                <span className="flex h-2 w-2 rounded-full bg-red-500" title="Disconnected" />
                            )}
                        </CardDescription>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="flex flex-col gap-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground mt-20 opacity-50">
                                    <Bot size={48} className="mb-4" />
                                    <p>Start a conversation with Panda...</p>
                                </div>
                            )}
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                <Bot size={14} />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 text-sm ${message.role === "user"
                                                ? "bg-primary text-primary-foreground ml-12"
                                                : "bg-muted mr-12"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                    {message.role === "user" && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-slate-500 text-white">
                                                <User size={14} />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 mt-1">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <Bot size={14} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg p-3 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
                <Separator />
                <CardFooter className="p-4 pt-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="flex w-full items-center space-x-2"
                    >
                        <Input
                            placeholder={isConnected ? "Type your message..." : "Connecting to brain..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1"
                            disabled={!isConnected}
                        />
                        <Button type="submit" size="icon" disabled={!input.trim() || !isConnected}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                        <Button type="button" variant="ghost" size="icon">
                            <Mic className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
