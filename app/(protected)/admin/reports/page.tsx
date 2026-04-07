import { MakeMixChart, RevenueTrendChart } from "@/components/dashboard-charts";
import { Card, CardContent, PageHeader, SectionGrid, Metric } from "@/components/ui";
import { getTransactions } from "@/lib/queries";
import { currency, date } from "@/lib/utils";

export default async function ReportsPage() {
  const data = await getTransactions();
  const revenue = data.rows.reduce((sum, row) => sum + row.finalSalePrice, 0);
  const averageSale = data.rows.length ? Math.round(revenue / data.rows.length) : 0;

  const csv = [
    ["transaction_id", "sale_date", "vehicle", "salesperson", "customer", "final_sale_price", "payment_method"],
    ...data.rows.map((row) => [
      row.id,
      new Date(row.saleDate).toISOString(),
      `${row.vehicle.year} ${row.vehicle.make} ${row.vehicle.model}`,
      row.salesperson.fullName,
      row.customer.name,
      String(row.finalSalePrice),
      row.paymentMethod
    ])
  ]
    .map((row) => row.join(","))
    .join("\n");

  const trend = data.rows
    .slice()
    .reverse()
    .map((row, index) => ({ name: `Deal ${index + 1}`, revenue: row.finalSalePrice }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales reporting"
        description="Transactions, revenue, and make-level mix."
        action={
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="transactions.csv"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Export CSV
          </a>
        }
      />

      <SectionGrid>
        <Metric label="Total revenue" value={currency(revenue)} />
        <Metric label="Closed sales" value={String(data.rows.length)} />
        <Metric label="Average sale" value={currency(averageSale)} />
        <Metric label="Top make" value={data.byMake.sort((a, b) => b.count - a.count)[0]?.name ?? "—"} />
      </SectionGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <RevenueTrendChart title="Revenue trend" data={trend} />
        <MakeMixChart data={data.byMake} />
      </div>

      <Card>
        <CardContent className="py-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Salesperson</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Method</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">{date(row.saleDate)}</td>
                    <td className="px-4 py-3">{row.vehicle.year} {row.vehicle.make} {row.vehicle.model}</td>
                    <td className="px-4 py-3">{row.customer.name}</td>
                    <td className="px-4 py-3">{row.salesperson.fullName}</td>
                    <td className="px-4 py-3">{row.paymentMethod}</td>
                    <td className="px-4 py-3">{currency(row.finalSalePrice)}</td>
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
