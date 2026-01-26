export default function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-12 py-4 rounded-full
        bg-white text-black
        font-semibold
        shadow-[0_20px_60px_rgba(255,255,255,0.1)]
        hover:scale-[1.03]
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  )
}
