export default function BarRow({
  label,
  value,
  max,
  formatValue,
}: {
  label: string;
  value: number;
  max: number;
  formatValue: (v: number) => string;
}) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 3 : 0) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] opacity-60 w-14 shrink-0">{label}</span>
      <div className="flex-1 bg-[rgba(20,25,43,0.06)] rounded-[2px] h-6 relative overflow-hidden">
        <div className="h-full bg-clay rounded-[2px]" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] opacity-70 w-16 text-right shrink-0">{formatValue(value)}</span>
    </div>
  );
}
