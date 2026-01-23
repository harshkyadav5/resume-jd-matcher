export default function TextAreaCard({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Job Description
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Paste the job description text
      </p>

      <textarea
        rows={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste job description here..."
        className="w-full rounded-lg border border-gray-200 p-3
          text-sm text-gray-700 focus:outline-none
          focus:ring-2 focus:ring-gray-300 resize-none"
      />
    </div>
  )
}
