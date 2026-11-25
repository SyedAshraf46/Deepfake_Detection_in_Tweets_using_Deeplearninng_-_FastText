import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, Loader2 } from 'lucide-react'
import api from '../services/api'

export default function Chatbot({ isOpen, onClose, context }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I'm your AI assistant for deepfake tweet detection. I can explain how the model works, interpret results, and answer questions. How can I help you?",
      suggestions: [
        "How does the model work?",
        "What does the confidence score mean?",
        "Why was this tweet classified as bot?"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (message = null) => {
    const userMessage = message || input.trim()
    if (!userMessage && !message) return

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/chat', {
        message: userMessage,
        context: context || {}
      })

      setMessages([
        ...newMessages,
        {
          role: 'bot',
          content: response.data.response,
          suggestions: response.data.suggestions || []
        }
      ])
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          suggestions: []
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (suggestion) => {
    handleSend(suggestion)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end">
      <div className="bg-primary-light w-full md:w-96 h-[600px] flex flex-col border-l border-primary shadow-2xl">
        {/* Header */}
        <div className="bg-primary border-b border-primary-light p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-secondary" />
            <h3 className="text-lg font-semibold text-gray-100">AI Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-secondary text-primary'
                    : 'bg-primary text-gray-100'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.suggestions.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSuggestion(suggestion)}
                        className="block w-full text-left text-xs px-3 py-2 bg-primary-light hover:bg-primary rounded border border-primary transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-primary rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-primary-light p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-secondary hover:bg-secondary-dark text-primary p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

