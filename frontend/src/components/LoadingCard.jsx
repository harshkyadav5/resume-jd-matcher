export default function LoadingCard() {
  return (
    <div className="mt-10 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="
            h-20 rounded-xl
            bg-white/5
            border border-white/10
            overflow-hidden
            relative
          "
        >
          <div
            className="
              absolute inset-0
              bg-gradient-to-r
              from-transparent via-white/10 to-transparent
              translate-x-[-200%]
              animate-[shimmer_1.6s_infinite]
            "
          />
        </div>
      ))}

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-200%); }
            100% { transform: translateX(200%); }
          }
        `}
      </style>
    </div>
  )
}
