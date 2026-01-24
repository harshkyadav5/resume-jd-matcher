export default function UploadCard({ title, subtitle, children }) {
  return (
    <div className="
      w-full max-w-lg
      rounded-2xl
      bg-white/5
      backdrop-blur-xl
      border border-white/10
      shadow-[0_25px_80px_rgba(0,0,0,0.7)]
      p-6
    ">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {subtitle}
      </p>
      {children}
    </div>
  )
}
