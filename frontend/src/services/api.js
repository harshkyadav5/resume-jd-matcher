const API_BASE = "http://localhost:8000/api"

export async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData()
  formData.append("resume", resumeFile)
  formData.append("job_description", jobDescription)

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to analyze resume")
  }

  return response.json()
}
