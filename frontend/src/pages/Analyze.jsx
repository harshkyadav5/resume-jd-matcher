import { useState } from "react"
import LoadingCard from "../components/LoadingCard"
import SkillBreakdown from "../components/SkillBreakdown"
import { analyzeResume } from "../services/api"
import AnalyzeForm from "../components/AnalyzeForm"

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
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white px-6 pt-50 pb-24">
      <div className="max-w-5xl mx-auto space-y-12">

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            Resume–JD Analysis
          </h1>
          <p className="text-gray-400 text-sm">
            Upload your resume and paste the job description to analyze match quality.
          </p>
        </div>

        <AnalyzeForm
          resume={resume}
          setResume={setResume}
          jd={jd}
          setJd={setJd}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {loading && (
          <div className="flex justify-center">
            <LoadingCard />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-10 animate-fade-in">

            {/* Score */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">Match Score</p>
              <h2 className="text-5xl font-bold text-white mt-2">
                {result.match_percentage}%
              </h2>
            </div>

            <SkillBreakdown
              matched={result.matched_skills || []}
              missing={result.missing_skills || []}
              extra={result.extra_skills || []}
            />

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-lg">
                Top Matching Resume Sections
              </h3>

              <ul className="space-y-4">
                {result.top_matches?.map((m, i) => (
                  <li
                    key={i}
                    className="bg-black/40 p-4 rounded-xl text-sm border border-white/5 hover:border-white/15 transition"
                  >
                    <div className="text-gray-400 text-xs mb-2">
                      Score: {m.score}%
                    </div>
                    <div className="text-gray-200 leading-relaxed">
                      {m.chunk?.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold mb-3 text-lg">
                AI Feedback
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {result.feedback}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
