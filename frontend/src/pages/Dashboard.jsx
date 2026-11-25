import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { History, TrendingUp, Bot, User as UserIcon } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    // Only load history if user is authenticated
    if (user) {
      // Small delay to ensure token is properly set in API service
      const timer = setTimeout(() => {
        loadHistory()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setLoading(false)
    }
  }, [page, user])

  const loadHistory = async () => {
    // Check if user is authenticated before making request
    if (!user) {
      setLoading(false)
      return
    }

    // Double check token exists in localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found, skipping history load')
      setLoading(false)
      return
    }

    try {
      const response = await api.get(`/history?page=${page}&per_page=10`)
      setHistory(response.data.predictions || [])
    } catch (error) {
      console.error('Error loading history:', error)
      // If 401/422, check if it's a real auth error or just no data
      if (error.response?.status === 401 || error.response?.status === 422) {
        // Check if we have a token - if yes, it might be expired
        // If no token, it's a real auth issue
        const hasToken = localStorage.getItem('token')
        if (!hasToken) {
          // No token - this is a real auth issue, let interceptor handle
          return
        }
        // Has token but got 422 - might be expired or invalid
        // For now, just show empty history instead of redirecting
        setHistory([])
      } else {
        // Other errors - set empty array
        setHistory([])
      }
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const botCount = history.filter(p => p.prediction === 'bot').length
      const humanCount = history.filter(p => p.prediction === 'human').length
      const avgConfidence = history.length > 0
        ? history.reduce((sum, p) => sum + p.confidence, 0) / history.length
        : 0

      setStats({
        total: history.length,
        bot: botCount,
        human: humanCount,
        avgConfidence: avgConfidence
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  useEffect(() => {
    if (history.length > 0) {
      loadStats()
    }
  }, [history])

  const chartData = [
    { name: 'Bot', value: stats?.bot || 0, color: '#EF4444' },
    { name: 'Human', value: stats?.human || 0, color: '#10B981' }
  ]

  const confidenceData = history.slice(0, 10).map((p, idx) => ({
    name: `Prediction ${idx + 1}`,
    confidence: Math.round(p.confidence * 100)
  }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-100">{stats?.total || 0}</p>
            </div>
            <History className="w-8 h-8 text-secondary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bot Detections</p>
              <p className="text-2xl font-bold text-alert">{stats?.bot || 0}</p>
            </div>
            <Bot className="w-8 h-8 text-alert" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Human Detections</p>
              <p className="text-2xl font-bold text-accent">{stats?.human || 0}</p>
            </div>
            <UserIcon className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Confidence</p>
              <p className="text-2xl font-bold text-secondary">
                {stats?.avgConfidence ? Math.round(stats.avgConfidence * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Prediction Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Confidence Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="confidence" fill="#22D3EE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Predictions</h3>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No predictions yet. Start analyzing tweets!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Tweet</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Prediction</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Confidence</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((prediction) => (
                  <tr key={prediction.id} className="border-b border-primary/50">
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {prediction.tweet_text.length > 50
                        ? `${prediction.tweet_text.substring(0, 50)}...`
                        : prediction.tweet_text}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          prediction.prediction === 'bot'
                            ? 'bg-alert/20 text-alert'
                            : 'bg-accent/20 text-accent'
                        }`}
                      >
                        {prediction.prediction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {Math.round(prediction.confidence * 100)}%
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {new Date(prediction.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

