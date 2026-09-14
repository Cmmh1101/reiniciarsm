export default function SessionsBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(0, ...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2.5 h-[180px]">
      {data.map((d, i) => {
        const pct = max > 0 ? Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0) : 0;
        return (
          <div key={`${d.label}-${i}`} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
            <span className="font-mono text-[10px] opacity-0 group-hover:opacity-60 transition-opacity">{d.value}</span>
            <div className="w-full rounded-t-[2px] bg-clay/80 hover:bg-clay transition-colors" style={{ height: `${pct}%` }} />
          </div>
        );
      })}
    </div>
  );
}
