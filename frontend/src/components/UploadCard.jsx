export default function UploadCard({ onFileSelect }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Upload Resume
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        PDF, DOCX, or TXT supported
      </p>

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => onFileSelect(e.target.files[0])}
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:bg-gray-100 file:text-gray-700
          hover:file:bg-gray-200 cursor-pointer"
      />
    </div>
  )
}
