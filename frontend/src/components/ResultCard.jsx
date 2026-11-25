import { Bot, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react'

export default function ResultCard({ result, onExplain }) {
  if (!result) return null

  const { prediction, confidence, keywords, explanation } = result
  const isBot = prediction === 'bot'
  const confidencePercent = Math.round(confidence * 100)

  // Calculate progress ring
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (confidence * circumference)

  return (
    <div className="card mt-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isBot ? (
            <Bot className="w-8 h-8 text-alert" />
          ) : (
            <UserIcon className="w-8 h-8 text-accent" />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-100">
              {isBot ? 'Bot-Generated' : 'Human-Written'}
            </h3>
            <p className="text-gray-400 text-sm">
              {isBot ? 'AI/Deepfake Detected' : 'Authentic Content'}
            </p>
          </div>
        </div>
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke={isBot ? '#1E293B' : '#1E293B'}
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke={isBot ? '#EF4444' : '#10B981'}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${isBot ? 'text-alert' : 'text-accent'}`}>
              {confidencePercent}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-primary rounded-lg">
        <div className="flex items-start space-x-2">
          {isBot ? (
            <AlertCircle className="w-5 h-5 text-alert mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-gray-300 text-sm leading-relaxed">
              {explanation || `This tweet is classified as ${prediction} with ${confidencePercent}% confidence.`}
            </p>
          </div>
        </div>
      </div>

      {keywords && keywords.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Indicators:</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary rounded-full text-xs text-secondary border border-secondary/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {onExplain && (
        <button
          onClick={() => onExplain(result)}
          className="mt-4 w-full btn-secondary text-sm"
        >
          Ask AI Chatbot to Explain
        </button>
      )}
    </div>
  )
}

