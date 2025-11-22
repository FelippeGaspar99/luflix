interface ProgressProps {
  value: number;
}

export function Progress({ value }: ProgressProps) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-800">
      <div
        className="h-2 rounded-full bg-rose-500 transition-all"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
