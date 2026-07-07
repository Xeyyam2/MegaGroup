export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="glass h-12 w-2/3 animate-pulse rounded-xl bg-white/10" />
      <div className="glass mt-4 h-6 w-1/2 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass h-48 animate-pulse rounded-2xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}
