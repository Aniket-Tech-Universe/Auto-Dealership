import { Role } from "@prisma/client";
import { RevenueTrendChart } from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle, Metric, PageHeader, SectionGrid } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getSalesOverview } from "@/lib/queries";
import { currency, date } from "@/lib/utils";

export default async function SalesDashboardPage() {
  const user = await requireUser(Role.SALES);
  const employee = await getSalesOverview(user.employee!.id);

  if (!employee) {
    return null;
  }

  const revenue = employee.sales.reduce((sum, sale) => sum + sale.finalSalePrice, 0);
  const converted = employee.assignedEnquiries.filter((enquiry) => enquiry.status === "CONVERTED").length;
  const conversionRate = employee.assignedEnquiries.length
    ? Math.round((converted / employee.assignedEnquiries.length) * 100)
    : 0;

  const trend = employee.sales
    .slice()
    .reverse()
    .map((sale, index) => ({ name: `Deal ${index + 1}`, revenue: sale.finalSalePrice }));

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Personal performance, recent deals, and current pipeline." />

      <SectionGrid>
        <Metric label="Sales count" value={String(employee.sales.length)} />
        <Metric label="Revenue" value={currency(revenue)} />
        <Metric
          label="Target progress"
          value={`${employee.monthlyTarget ? Math.round((revenue / employee.monthlyTarget) * 100) : 0}%`}
        />
        <Metric label="Conversion rate" value={`${conversionRate}%`} />
      </SectionGrid>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <RevenueTrendChart title="Personal revenue trend" data={trend} />
        <Card>
          <CardHeader>
            <CardTitle>Recent deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employee.sales.length ? (
              employee.sales.map((sale) => (
                <div key={sale.id} className="rounded-xl border border-border p-3">
                  <div className="font-medium text-slate-950">
                    {sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}
                  </div>
                  <div className="text-sm text-slate-500">
                    {sale.customer.name} · {date(sale.saleDate)}
                  </div>
                  <div className="mt-2 font-medium text-slate-950">{currency(sale.finalSalePrice)}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No completed deals yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned enquiries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {employee.assignedEnquiries.length ? (
            employee.assignedEnquiries.slice(0, 5).map((enquiry) => (
              <div key={enquiry.id} className="rounded-xl border border-border p-3">
                <div className="font-medium text-slate-950">{enquiry.customer.name}</div>
                <div className="text-sm text-slate-500">
                  {enquiry.vehicle
                    ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}`
                    : "General enquiry"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No assigned enquiries.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
