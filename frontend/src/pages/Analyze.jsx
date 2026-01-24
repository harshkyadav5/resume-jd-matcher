import { useState } from "react"

export default function Analyze() {
  const [resume, setResume] = useState(null)
  const [jd, setJd] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    if (!resume || !jd.trim()) {
      setError("Please upload a resume and enter a job description.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("job_description", jd)

      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Analysis failed. Please try again.")
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 pt-32 pb-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Resume ↔ JD Analyzer
          </h1>
          <p className="text-neutral-400 text-sm">
            Upload a resume and paste a job description to evaluate fit.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
          {/* Resume */}
          <div>
            <label className="block text-sm mb-2 text-neutral-300">
              Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="block w-full text-sm text-neutral-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:bg-neutral-800 file:text-neutral-200
                         hover:file:bg-neutral-700"
            />
          </div>

          {/* JD */}
          <div>
            <label className="block text-sm mb-2 text-neutral-300">
              Job Description
            </label>
            <textarea
              rows={6}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full rounded-lg bg-neutral-950 border border-neutral-800
                         px-4 py-3 text-sm text-neutral-100
                         focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>

          {/* Action */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600
                       hover:bg-indigo-500 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze Match"}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-medium">Result</h2>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Match Score</span>
                    <span className="font-semibold text-indigo-400">
                        {result.match_percentage}%
                    </span>
                </div>

                <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${result.match_percentage}%`,
                            background:
                            result.match_percentage > 70
                                ? "linear-gradient(to right, #22c55e, #16a34a)"
                                : result.match_percentage > 40
                                ? "linear-gradient(to right, #eab308, #f59e0b)"
                                : "linear-gradient(to right, #ef4444, #dc2626)",
                        }}
                    />
                </div>

                {result.matched_skills && (
                    <div className="space-y-4">
                        {/* Matched Skills */}
                        <div>
                            <p className="text-sm text-neutral-400 mb-2">Matched Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {result.matched_skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs rounded-full
                                                bg-emerald-500/15 text-emerald-400
                                                border border-emerald-500/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Missing Skills */}
                        <div>
                            <p className="text-sm text-neutral-400 mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs rounded-full
                                                bg-red-500/15 text-red-400
                                                border border-red-500/20"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
              <p className="text-neutral-400 text-sm mb-2">
                Top Resume Matches
              </p>
              <ul className="space-y-3 text-sm">
                {result.top_matches?.map((m, idx) => (
                  <li
                    key={idx}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                  >
                    <p className="text-neutral-200">
                      {m.chunk.slice(0, 220)}...
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Score: {m.score}%
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {result.feedback && (
              <div>
                <p className="text-neutral-400 text-sm mb-2">
                  Hiring Feedback
                </p>
                <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-line">
                  {result.feedback}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
