import Link from "next/link";
import { InventoryStatusChart, RevenueTrendChart } from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle, Metric, PageHeader, SectionGrid } from "@/components/ui";
import { getAdminDashboard } from "@/lib/queries";
import { currency, date } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Current inventory position, sales activity, and incoming leads."
      />

      <SectionGrid>
        <Metric label="Total inventory" value={String(data.vehicles.length)} />
        <Metric
          label="Active listings"
          value={String(data.vehicles.filter((vehicle) => vehicle.status !== "SOLD").length)}
        />
        <Metric label="Revenue" value={currency(data.monthlyRevenue)} />
        <Metric label="Closed sales" value={String(data.monthlySalesCount)} />
      </SectionGrid>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <RevenueTrendChart title="Revenue trend" data={data.revenueTrend} />
        <Card>
          <CardHeader>
            <CardTitle>Top performer</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topPerformer ? (
              <>
                <div className="text-lg font-semibold text-slate-950">{data.topPerformer.fullName}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {data.topPerformer.salesCount} deals this period
                </div>
                <div className="mt-4 text-2xl font-semibold text-slate-950">
                  {currency(data.topPerformer.revenue)}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">No completed sales yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <div className="font-medium text-slate-950">
                    {sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}
                  </div>
                  <div className="text-sm text-slate-500">
                    {sale.customer.name} · {sale.salesperson.fullName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-950">{currency(sale.finalSalePrice)}</div>
                  <div className="text-sm text-slate-500">{date(sale.saleDate)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <InventoryStatusChart data={data.inventoryByStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent enquiries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.enquiries.map((enquiry) => (
            <Link
              key={enquiry.id}
              href={`/enquiries/${enquiry.id}`}
              className="block rounded-xl border border-border p-3 transition-colors hover:bg-slate-50"
            >
              <div className="font-medium text-slate-950">{enquiry.customer.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                {enquiry.vehicle
                  ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}`
                  : "General enquiry"}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
