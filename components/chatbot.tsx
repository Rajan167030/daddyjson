"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

type ChatRole = "user" | "assistant"

type ChatMessage = {
  role: ChatRole
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm JSON AI, your assistant. I can help you learn about our channel, tech topics, and our creator Rajan Jha. What would you like to know? 🚀" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'failed'>('unknown')
  const [lastError, setLastError] = useState("")

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = { role: "user", content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as {
          error?: string
          details?: string
          model?: string
        }

        const serverError = [
          `API request failed with status ${response.status}`,
          errorBody.error,
          errorBody.details,
          errorBody.model ? `(model: ${errorBody.model})` : null,
        ]
          .filter(Boolean)
          .join(' | ')

        throw new Error(serverError)
      }

      const data = (await response.json()) as { reply?: string }
      const text = data.reply?.trim()

      if (!text) {
        throw new Error('Empty response from chat API')
      }

      setApiStatus('working')
      setLastError('')
      setMessages(prev => [...prev, { role: "assistant", content: `🤖 ${text}` }])

    } catch (error) {
      console.error('❌ Chat API Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown chat API error'
      setLastError(errorMessage)

      setApiStatus('failed')
      const fallbackResponses = [
        `JSON AI temporarily offline hai. Reason: ${errorMessage}. Quick answer: daddy.json aur Rajan Jha ka same goal hai - tech ko practical aur easy banana. Subscribe @DaddyJSON 🎥`,
        "Rajan Jha hi daddy.json ke creator hain, aur dono ka mission same hai: coding tutorials, software reviews, aur useful tech insights dena. 💻",
        "Agar API issue ho bhi, core info yehi hai: daddy.json + Rajan Jha ek hi vision share karte hain - tech learning ko simple aur real-world focused banana. 🚀",
        "Connect karna ho to Rajan Jha: rajan.jha114430@gmail.com | GitHub: github.com/Rajan167030 | LinkedIn profile available. 📧",
        "JSON AI fallback mode: daddy.json brand aur Rajan Jha personal work dono ka goal same hai - users ko build karna sikhana, sirf theory nahi. 🎯"
      ]

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
      setMessages(prev => [...prev, { role: "assistant", content: `📝 ${randomResponse}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button - Fixed in bottom right corner */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Chat Window - Responsive sizes */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 left-4 md:bottom-24 md:right-6 md:left-auto md:w-[480px] h-[85vh] md:h-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-t-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full animate-pulse ${
                apiStatus === 'working' ? 'bg-green-500' :
                apiStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-base md:text-lg">JSON AI</h3>
                <span className="text-xs text-muted-foreground">
                  {apiStatus === 'working' ? '🤖 AI Active' : apiStatus === 'failed' ? '📝 Offline Mode' : '⏳ Checking...'}
                </span>
                {apiStatus === 'failed' && lastError ? (
                  <span className="text-[10px] text-red-500 max-w-[250px] truncate" title={lastError}>
                    {lastError}
                  </span>
                ) : null}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted p-2 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-transparent to-muted/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-sm md:text-base shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border p-4 rounded-2xl rounded-bl-sm max-w-[85%] shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 md:p-5 border-t bg-muted/30 rounded-b-2xl">
            <div className="flex gap-2 md:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
                placeholder="Ask me anything about tech..."
                className="flex-1 px-4 py-3 md:py-3.5 text-sm md:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background shadow-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-4 md:px-5 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}