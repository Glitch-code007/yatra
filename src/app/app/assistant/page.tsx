"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Compass,
  IndianRupee,
  ShieldCheck,
  Utensils,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { INDIAN_DESTINATIONS } from "@/data/destinations"
import { AIService } from "@/services/ai.service"

interface ChatMessage {
  id: string
  sender: "user" | "assistant"
  text: string
  timestamp: string
  suggestions?: string[]
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading assistant...</div>}>
      <AssistantContent />
    </Suspense>
  )
}

function AssistantContent() {
  const searchParams = useSearchParams()
  const initialDest = searchParams.get("dest") || "jaipur"

  const [selectedDest, setSelectedDest] = useState(initialDest)
  const [inputQuery, setInputQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: `Namaste! 🙏 I'm your **Yatra AI Travel Assistant**.\n\nI can help you personalize your itinerary, discover hidden culinary gems, check auto fares, avoid local scams, or optimize your trip budget across India.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: [
        "What are the top must-eat dishes here?",
        "How can I make my trip more budget-friendly?",
        "What auto scams should I watch out for?",
        "Is 3 days sufficient to explore?",
      ],
    },
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery
    if (!query.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuery("")
    setIsLoading(true)

    try {
      const destObj = INDIAN_DESTINATIONS.find((d) => d.slug === selectedDest)
      const aiResult = await AIService.askAssistant(query, {
        destinationSlug: selectedDest,
        destinationName: destObj?.name || selectedDest,
        totalBudgetInr: 25000,
        numDays: 3,
        numTravelers: 2,
      })

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: aiResult.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: aiResult.suggestions,
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto space-y-4">
      {/* Header Bar with Destination Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border/60 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold flex items-center gap-1.5">
              <span>Yatra AI Travel Assistant</span>
              <Badge className="bg-primary/20 text-primary text-[10px] font-bold">Grounded Facts</Badge>
            </h1>
            <p className="text-xs text-muted-foreground">
              Contextually aware of verified Indian destination data, prices, and safety rules.
            </p>
          </div>
        </div>

        {/* Destination Context Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Focus City:</span>
          <select
            value={selectedDest}
            onChange={(e) => setSelectedDest(e.target.value)}
            className="h-9 px-3 text-xs rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {INDIAN_DESTINATIONS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-muted/20 border border-border/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                  : "bg-card border border-border/60 text-card-foreground rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] text-right ${msg.sender === "user" ? "opacity-70" : "text-muted-foreground"}`}>
                {msg.timestamp}
              </div>

              {/* Follow-up Suggestion Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 border-t border-border/40 space-y-1.5">
                  <div className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                    <Lightbulb className="h-3 w-3 text-amber-500" />
                    <span>Suggested Questions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors text-secondary-foreground border border-border/40 text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-1 border border-border/60">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1 shadow-xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none p-4 bg-card border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-spin" />
              <span>Yatra AI is consulting verified destination facts...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-card border border-border/60 shadow-md shrink-0"
      >
        <Input
          type="text"
          placeholder={`Ask about ${selectedDest} (food, price check, scams, budget)...`}
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm"
        />
        <Button type="submit" size="sm" disabled={isLoading || !inputQuery.trim()} className="rounded-xl px-4 gap-1.5 font-bold">
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  )
}
