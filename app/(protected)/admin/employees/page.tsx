import { toggleEmployeeActiveAction, updateEmployeeRoleAction } from "@/lib/actions";
import { Card, CardContent, PageHeader, SectionGrid, Metric } from "@/components/ui";
import { currency, date, titleCase } from "@/lib/utils";
import { getEmployees } from "@/lib/queries";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const top = [...employees].sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Team" description="Performance, roles, and current coverage." />

      <SectionGrid>
        <Metric label="Sales staff" value={String(employees.filter((employee) => employee.role === "SALES").length)} />
        <Metric label="Active staff" value={String(employees.filter((employee) => employee.active).length)} />
        <Metric label="Top performer" value={top?.fullName ?? "—"} hint={top ? currency(top.revenueGenerated) : undefined} />
        <Metric label="Assigned enquiries" value={String(employees.reduce((sum, employee) => sum + employee.assignedCount, 0))} />
      </SectionGrid>

      <Card>
        <CardContent className="py-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Employee</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Sales</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Revenue</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Target</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-slate-950">{employee.fullName}</div>
                      <div className="text-slate-500">{employee.email}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <form action={async (formData) => {
                        "use server";
                        await updateEmployeeRoleAction(employee.id, String(formData.get("role")) as "ADMIN" | "SALES");
                      }} className="flex items-center gap-2">
                        <select
                          name="role"
                          defaultValue={employee.role}
                          className="h-9 rounded-lg border border-border px-2 text-sm"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="SALES">SALES</option>
                        </select>
                        <button className="text-sm font-medium underline">Save</button>
                      </form>
                    </td>
                    <td className="px-4 py-3 align-top">{employee.salesCount}</td>
                    <td className="px-4 py-3 align-top">{currency(employee.revenueGenerated)}</td>
                    <td className="px-4 py-3 align-top">
                      {employee.monthlyTarget ? `${employee.targetProgress}% of target` : "—"}
                    </td>
                    <td className="px-4 py-3 align-top">{date(employee.joinedAt)}</td>
                    <td className="px-4 py-3 align-top">
                      <form action={async () => {
                        "use server";
                        await toggleEmployeeActiveAction(employee.id, employee.active);
                      }}>
                        <button className="text-sm font-medium underline">
                          {employee.active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                      <div className="mt-2 text-slate-500">{titleCase(String(employee.active ? "active" : "inactive"))}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
