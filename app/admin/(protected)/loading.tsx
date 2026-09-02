export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-7 w-48 rounded-lg bg-white/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
    </div>
  );
}
