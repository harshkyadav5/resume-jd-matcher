import UploadCard from "../components/UploadCard"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-32">

        {/* Resume Upload */}
        <UploadCard
          title="Upload Resume"
          subtitle="PDF recommended"
        >
          <label className="
            flex flex-col items-center justify-center
            h-40 rounded-xl cursor-pointer
            border border-dashed border-white/20
            hover:border-white/40
            transition
          ">
            <input type="file" className="hidden" />
            <span className="text-gray-300 font-medium">
              Drag & drop resume
            </span>
            <span className="text-xs text-gray-500 mt-1">
              or click to browse
            </span>
          </label>
        </UploadCard>

        {/* Job Description */}
        <UploadCard
          title="Job Description"
          subtitle="Paste the JD text"
        >
          <textarea
            rows={6}
            placeholder="Paste job description here..."
            className="
              w-full rounded-xl
              bg-black/30
              border border-white/10
              text-gray-200
              placeholder-gray-500
              focus:ring-2 focus:ring-white/20
              focus:outline-none
              p-4 text-sm
            "
          />
        </UploadCard>

        {/* Analyze Button */}
        <div className="md:col-span-2 flex justify-center mt-6">
          <button className="
            px-12 py-4 rounded-full
            bg-white text-black
            font-semibold
            shadow-[0_20px_60px_rgba(255,255,255,0.1)]
            hover:scale-[1.03]
            transition
          ">
            Analyze Match
          </button>
        </div>

      </div>
    </div>
  )
}
