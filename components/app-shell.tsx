import Link from "next/link";
import { Building2, ChartNoAxesCombined, CarFront, ClipboardList, LogOut, Users } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { Button } from "@/components/ui";

const adminNav = [
  { href: "/admin", label: "Overview", icon: ChartNoAxesCombined },
  { href: "/admin/inventory", label: "Inventory", icon: CarFront },
  { href: "/admin/employees", label: "Team", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: Building2 },
  { href: "/admin/enquiries", label: "Enquiries", icon: ClipboardList }
];

const salesNav = [
  { href: "/sales", label: "Overview", icon: ChartNoAxesCombined },
  { href: "/sales/inventory", label: "Inventory", icon: CarFront },
  { href: "/sales/enquiries", label: "Enquiries", icon: ClipboardList }
];

export function AppShell({
  role,
  name,
  children
}: {
  role: "ADMIN" | "SALES";
  name: string;
  children: React.ReactNode;
}) {
  const nav = role === "ADMIN" ? adminNav : salesNav;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1520px] lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-border bg-white">
          <div className="px-5 py-6">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Auto Dealership
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              Operations Platform
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {role === "ADMIN" ? "Administrator workspace" : "Sales workspace"}
            </div>
          </div>
          <nav className="space-y-1 px-3">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-border px-5 py-5">
            <div className="text-sm font-medium text-slate-950">{name}</div>
            <div className="mt-1 text-sm text-slate-500">
              {role === "ADMIN" ? "Administrator" : "Sales Executive"}
            </div>
            <form action={logoutAction} className="mt-4">
              <Button type="submit" variant="ghost" className="gap-2 px-0 text-slate-700">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>
        <main>
          <header className="border-b border-border bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Daily operating workspace</div>
                <div className="font-medium text-slate-950">Demo mode enabled</div>
              </div>
            </div>
          </header>
          <div className="px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
