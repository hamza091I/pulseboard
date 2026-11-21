import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfbfd] px-6 py-12">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink">Page not found.</h1>
        <p className="mt-3 text-slate-500">The page you requested does not exist in PulseBoard.</p>
        <Link
          className="mt-7 inline-flex rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          href="/"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
