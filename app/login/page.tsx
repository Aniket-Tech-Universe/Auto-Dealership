import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-white shadow-soft lg:grid-cols-[1.15fr_0.85fr]">
        <section className="border-b border-border p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            Auto Dealership
          </div>
          <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-tight text-slate-950">
            Dealership operations without the noise.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
            Inventory, enquiries, sales reporting, and team visibility in one restrained internal
            workspace.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Administrator</div>
              <p className="mt-1 text-sm text-slate-500">
                Overview, inventory, employees, reporting, and all enquiries.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">Sales Executive</div>
              <p className="mt-1 text-sm text-slate-500">
                Personal performance, assigned enquiries, interactions, and sale logging.
              </p>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center p-8 lg:p-12">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
