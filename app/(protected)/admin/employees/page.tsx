import { Card, CardContent, PageHeader, Metric } from "@/components/ui";
import { currency } from "@/lib/utils";
import { getEmployees } from "@/lib/data";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const top = [...employees].sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];
  return (
    <div className="space-y-6">
      <PageHeader title="Team" description="Performance, coverage and access at a glance." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Sales staff" value={String(employees.filter((e) => e.role === "SALES").length)} />
        <Metric label="Active staff" value={String(employees.filter((e) => e.active).length)} />
        <Metric label="Top performer" value={top?.fullName ?? "—"} hint={top ? currency(top.revenueGenerated) : undefined} />
        <Metric label="Open assigned leads" value={String(employees.reduce((sum, e) => sum + e.assignedCount, 0))} />
      </div>
      <Card><CardContent className="py-5"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-border text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-500">Employee</th><th className="px-4 py-3 text-left font-medium text-slate-500">Role</th><th className="px-4 py-3 text-left font-medium text-slate-500">Sales</th><th className="px-4 py-3 text-left font-medium text-slate-500">Revenue</th><th className="px-4 py-3 text-left font-medium text-slate-500">Assigned enquiries</th></tr></thead><tbody className="divide-y divide-border bg-white">{employees.map((employee) => <tr key={employee.id}><td className="px-4 py-3"><div className="font-medium">{employee.fullName}</div><div className="text-slate-500">{employee.email}</div></td><td className="px-4 py-3">{employee.role}</td><td className="px-4 py-3">{employee.salesCount}</td><td className="px-4 py-3">{currency(employee.revenueGenerated)}</td><td className="px-4 py-3">{employee.assignedCount}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
