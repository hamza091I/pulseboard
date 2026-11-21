export default function AppLoading() {
  return (
    <div className="p-6 lg:p-10" aria-label="Loading workspace" role="status">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-slate-100" />
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white"
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
