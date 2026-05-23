export default function MacroRing({ value, label, tone = 'green' }) {
  const clamped = Math.min(Math.max(value, 0), 100)
  return (
    <div className="macro-ring" style={{ '--value': `${clamped}%` }} data-tone={tone}>
      <div className="macro-ring__inner">
        <strong>{clamped}%</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
