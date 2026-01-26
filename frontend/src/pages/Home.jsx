import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center px-6">
      <div className="text-center space-y-6">

        <h1 className="text-4xl font-bold text-white">
          Resume–JD Matcher
        </h1>

        <p className="text-gray-400 max-w-md mx-auto">
          Upload your resume, paste a job description, and get AI-powered
          matching insights.
        </p>

        <button
          onClick={() => navigate("/analyze")}
          className="
            px-12 py-4 rounded-full
            bg-white text-black
            font-semibold
            shadow-[0_20px_60px_rgba(255,255,255,0.15)]
            hover:scale-[1.03]
            transition
          "
        >
          Start Analysis
        </button>

      </div>
    </div>
  )
}
