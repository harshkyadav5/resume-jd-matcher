export default function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          backdrop-blur-2xl
          bg-white/70
          border border-white/30
          shadow-[0_18px_50px_rgba(0,0,0,0.14)]
          rounded-full
          px-14 py-5
          min-w-[420px] sm:min-w-[520px]
          flex items-center justify-between
          gap-6
          transition-all duration-300
          hover:shadow-[0_22px_65px_rgba(0,0,0,0.2)]
        "
      >
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            Resume–JD Matcher
          </span>
          <span className="text-sm text-gray-500">
            AI-powered resume screening
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full bg-black/5 text-gray-700">
            Fast
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-black/5 text-gray-700">
            Accurate
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-black/5 text-gray-700">
            Smart
          </span>
        </div>
      </div>
    </div>
  )
}
