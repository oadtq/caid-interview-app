"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessage {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: number
  isTyping?: boolean
}

export function LiveChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const demoSequence = [
    {
      type: "user" as const,
      content:
        "I'm trying to find a mentor in Vietnam with a background in tech leadership — ideally someone who's scaled teams, published research, or mentored before.",
      delay: 1000,
    },
    {
      type: "ai" as const,
      content:
        "AI is searching...\n\nScanning 3,000+ direct connections and 150,000+ extended network across Vietnam...",
      delay: 2000,
      isTyping: true,
    },
    {
      type: "ai" as const,
      content:
        "✓ Found 8 perfect matches\n\n• 8 matches with team scaling experience\n• 8 matches with published research\n• 8 matches with active mentoring history\n\nConnection strength: Strong (75%)",
      delay: 3000,
    },
  ]

  useEffect(() => {
    const runDemo = () => {
      setMessages([])
      setCurrentStep(0)

      let timeoutId: NodeJS.Timeout

      const addMessage = (index: number) => {
        if (index >= demoSequence.length) {
          // Restart demo after a pause
          timeoutId = setTimeout(() => runDemo(), 5000)
          return
        }

        const message = demoSequence[index]

        if (message.isTyping) {
          setIsTyping(true)
          timeoutId = setTimeout(() => {
            setIsTyping(false)
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + index,
                type: message.type,
                content: message.content,
                timestamp: Date.now(),
              },
            ])
            setCurrentStep(index + 1)
            timeoutId = setTimeout(() => addMessage(index + 1), 1000)
          }, 2000)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + index,
              type: message.type,
              content: message.content,
              timestamp: Date.now(),
            },
          ])
          setCurrentStep(index + 1)
          timeoutId = setTimeout(() => addMessage(index + 1), message.delay)
        }
      }

      timeoutId = setTimeout(() => addMessage(0), 1000)

      return () => {
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    const cleanup = runDemo()
    return cleanup
  }, [])

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-4 border-gray-200 shadow-2xl overflow-hidden relative">
      {/* Header with window controls */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="text-xs text-gray-500 font-medium">EveryMatch AI Chat</div>
        <div className="w-12"></div>
      </div>

      {/* Chat Interface - Eliminated excess whitespace at bottom */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mx-4 mb-4">
        <div className="p-4 space-y-3 min-h-[500px] max-h-[500px] overflow-y-auto flex flex-col">
          <div className="flex-1">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-3`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-sm ${
                      message.type === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    {message.type === "ai" && message.content.includes("Found 8 perfect matches") ? (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold text-xs">✓</span>
                          </div>
                          <span className="text-sm font-medium text-primary">Found 8 perfect matches</span>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-600">• 8 matches with team scaling experience</div>
                          <div className="text-xs text-gray-600">• 8 matches with published research</div>
                          <div className="text-xs text-gray-600">• 8 matches with active mentoring history</div>
                        </div>

                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Connection strength:</div>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <motion.div
                                className="bg-primary h-1 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-xs text-primary font-medium">Strong</span>
                          </div>
                        </div>
                      </div>
                    ) : message.type === "ai" && message.content.includes("AI is searching") ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                          <span className="text-xs text-gray-500">AI is searching...</span>
                        </div>
                        <p className="text-sm">
                          Scanning 3,000+ direct connections and 150,000+ extended network across Vietnam...
                        </p>
                      </div>
                    ) : (
                      <p className={`text-sm whitespace-pre-line ${message.type === "user" ? "text-white" : ""}`}>
                        {message.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-3"
              >
                <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
