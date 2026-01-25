import { useState } from "react"
import UploadCard from "../components/UploadCard"
import LoadingCard from "../components/LoadingCard"
import { analyzeResume } from "../services/api"

export default function Analyze() {
  const [resume, setResume] = useState(null)
  const [jd, setJd] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!resume || !jd.trim()) {
      alert("Upload resume and paste job description")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await analyzeResume(resume, jd)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-8">

        <UploadCard
          resume={resume}
          setResume={setResume}
          jd={jd}
          setJd={setJd}
          onAnalyze={handleAnalyze}
        />

        {loading && <LoadingCard />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="text-3xl font-bold">
              Match Score: {result.match_percentage}%
            </div>

            <div>
              <h3 className="font-semibold mb-2">Top Matches</h3>
              <ul className="space-y-3">
                {result.top_matches.map((m, i) => (
                  <li
                    key={i}
                    className="bg-black/30 p-4 rounded-lg text-sm"
                  >
                    <div className="opacity-80 mb-1">
                      Score: {m.score}%
                    </div>
                    <div>{m.chunk}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI Feedback</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {result.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
