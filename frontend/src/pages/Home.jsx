import { useState } from 'react'
import { Shield, Zap, BarChart3, MessageCircle } from 'lucide-react'
import TweetInput from '../components/TweetInput'
import ResultCard from '../components/ResultCard'
import Chatbot from '../components/Chatbot'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const { user } = useAuth()

  const handlePredict = async (tweet) => {
    setLoading(true)
    setResult(null)

    try {
      const response = await api.post('/predict', {
        tweet,
        user_id: user?.id || null
      })

      setResult(response.data)
    } catch (error) {
      console.error('Prediction error:', error)
      alert(error.response?.data?.error || 'Failed to analyze tweet')
    } finally {
      setLoading(false)
    }
  }

  const handleExplain = (result) => {
    setChatbotOpen(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            AI-Powered Deepfake Tweet Detection
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Detect AI-generated and bot-created tweets with advanced machine learning.
            Get instant analysis with confidence scores and detailed explanations.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <Zap className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Real-Time Detection</h3>
            <p className="text-gray-400 text-sm">
              Instant analysis with 87-90% accuracy using Bi-LSTM neural networks
            </p>
          </div>
          <div className="card text-center">
            <BarChart3 className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Confidence Scores</h3>
            <p className="text-gray-400 text-sm">
              Get detailed confidence metrics and keyword analysis for every prediction
            </p>
          </div>
          <div className="card text-center">
            <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">AI Chatbot</h3>
            <p className="text-gray-400 text-sm">
              Intelligent assistant explains results and answers your questions
            </p>
          </div>
        </div>

        {/* Detection Interface */}
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Analyze a Tweet
            </h2>
            <TweetInput onPredict={handlePredict} loading={loading} />
          </div>

          {result && (
            <ResultCard result={result} onExplain={handleExplain} />
          )}

          {result && (
            <button
              onClick={() => setChatbotOpen(true)}
              className="mt-4 w-full btn-secondary"
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Open AI Chatbot
            </button>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        context={result}
      />
    </div>
  )
}

