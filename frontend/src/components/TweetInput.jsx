import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

export default function TweetInput({ onPredict, loading }) {
  const [tweet, setTweet] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tweet.trim() && !loading) {
      onPredict(tweet)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Paste or type a tweet here to analyze..."
          className="input-field min-h-[150px] resize-none pr-12"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!tweet.trim() || loading}
          className="absolute bottom-4 right-4 bg-secondary hover:bg-secondary-dark text-primary p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        {tweet.length} characters
      </p>
    </form>
  )
}

