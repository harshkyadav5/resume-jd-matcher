export default function SkillBreakdown({ matched, missing, extra }) {
  const Pill = ({ text, type }) => {
    const styles = {
      matched: "bg-green-500/10 text-green-400 border-green-500/30",
      missing: "bg-red-500/10 text-red-400 border-red-500/30",
      extra: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    }

    return (
      <span
        className={`
          px-3 py-1 text-xs rounded-full
          border ${styles[type]}
        `}
      >
        {text}
      </span>
    )
  }

  const Section = ({ title, items, type }) => (
    <div>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      {items.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((s, i) => (
            <Pill key={i} text={s} type={type} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500">None</p>
      )}
    </div>
  )

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      <h3 className="font-semibold text-lg">Skill Match Breakdown</h3>

      <Section
        title="Matched Skills"
        items={matched}
        type="matched"
      />

      <Section
        title="Missing Skills"
        items={missing}
        type="missing"
      />

      <Section
        title="Extra Skills"
        items={extra}
        type="extra"
      />
    </div>
  )
}
