export default function SiteLoading() {
  return (
    <div className="section animate-pulse py-16 sm:py-24">
      <div className="mx-auto h-4 w-32 rounded-full bg-white/10" />
      <div className="mx-auto mt-4 h-9 w-2/3 max-w-xl rounded-lg bg-white/10" />
      <div className="mx-auto mt-3 h-4 w-1/2 max-w-md rounded-lg bg-white/5" />
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
