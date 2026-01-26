import Card from "./Card"

export default function AnalyzeForm({
  resume,
  setResume,
  jd,
  setJd,
  onAnalyze,
  loading
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Resume */}
      <Card title="Upload Resume" subtitle="PDF recommended">
        <label className="
          flex flex-col items-center justify-center
          h-40 rounded-xl cursor-pointer
          border border-dashed border-white/20
          hover:border-white/40 transition
        ">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <span className="text-gray-300 font-medium">
            {resume ? resume.name : "Drag & drop resume"}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            or click to browse
          </span>
        </label>
      </Card>

      {/* JD */}
      <Card title="Job Description" subtitle="Paste the JD text">
        <textarea
          rows={6}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste job description here..."
          className="
            w-full rounded-xl bg-black/30
            border border-white/10
            text-gray-200 placeholder-gray-500
            focus:ring-2 focus:ring-white/20
            focus:outline-none p-4 text-sm
          "
        />
      </Card>

      {/* Button */}
      <div className="md:col-span-2 flex justify-center mt-4">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="
            px-12 py-4 rounded-full
            bg-white text-black font-semibold
            shadow-[0_20px_60px_rgba(255,255,255,0.15)]
            hover:scale-[1.03]
            transition disabled:opacity-50
          "
        >
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>
      </div>

    </div>
  )
}
