import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 shadow-soft">
        <h1 className="text-xl font-semibold">Access restricted</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          This area is limited to the assigned role for the current account.
        </p>
        <Link href="/" className="mt-5 inline-flex text-sm font-medium text-slate-900 underline">
          Return to workspace
        </Link>
      </div>
    </main>
  );
}
