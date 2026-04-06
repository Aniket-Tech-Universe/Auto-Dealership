import Link from "next/link";
import { RevenueChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle, Metric, PageHeader } from "@/components/ui";
import { currency, date } from "@/lib/utils";
import { getAdminDashboard } from "@/lib/data";

export default async function AdminPage() {
  const data = await getAdminDashboard();
  const trend = data.sales.slice(0, 6).reverse().map((sale, i) => ({ name: `Deal ${i + 1}`, value: sale.finalSalePrice }));
  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description="Current inventory position, sales activity and incoming leads." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total inventory" value={String(data.vehicles.length)} />
        <Metric label="Active listings" value={String(data.vehicles.filter((v) => v.status !== "SOLD").length)} />
        <Metric label="Revenue" value={currency(data.monthlyRevenue)} />
        <Metric label="Closed sales" value={String(data.sales.length)} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <RevenueChart data={trend} />
        <Card>
          <CardHeader><CardTitle>Top performer</CardTitle></CardHeader>
          <CardContent>{data.topPerformer ? <><div className="font-medium">{data.topPerformer.fullName}</div><div className="mt-1 text-sm text-slate-500">{data.topPerformer.salesCount} deals</div><div className="mt-3 text-2xl font-semibold">{currency(data.topPerformer.revenue)}</div></> : <p className="text-sm text-slate-500">No sales yet.</p>}</CardContent>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent transactions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.sales.map((sale) => <div key={sale.id} className="flex items-center justify-between rounded-lg border border-border p-3"><div><div className="font-medium">{sale.vehicle.year} {sale.vehicle.make} {sale.vehicle.model}</div><div className="text-sm text-slate-500">{sale.customer.name}</div></div><div className="text-right"><div className="font-medium">{currency(sale.finalSalePrice)}</div><div className="text-sm text-slate-500">{date(sale.saleDate)}</div></div></div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent enquiries</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.enquiries.map((enquiry) => <Link key={enquiry.id} href={`/enquiries/${enquiry.id}`} className="block rounded-lg border border-border p-3 hover:bg-slate-50"><div className="font-medium">{enquiry.customer.name}</div><div className="text-sm text-slate-500">{enquiry.vehicle ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}` : "General enquiry"}</div></Link>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
