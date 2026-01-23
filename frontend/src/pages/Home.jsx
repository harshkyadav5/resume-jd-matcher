import { useState } from "react"
import UploadCard from "../components/UploadCard"
import TextAreaCard from "../components/TextAreaCard"

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdText, setJdText] = useState("")

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
      <div className="grid md:grid-cols-2 gap-8">
        <UploadCard onFileSelect={setResumeFile} />
        <TextAreaCard value={jdText} onChange={setJdText} />
      </div>

      <div className="flex justify-center mt-10">
        <button
          disabled={!resumeFile || !jdText}
          className="px-8 py-3 rounded-full
            bg-gray-900 text-white text-sm font-medium
            hover:bg-gray-800 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Analyze Match
        </button>
      </div>
    </div>
  )
}
