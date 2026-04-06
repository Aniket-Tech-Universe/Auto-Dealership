import { Card, CardContent, PageHeader, Metric } from "@/components/ui";
import { currency, date } from "@/lib/utils";
import { getTransactions } from "@/lib/data";

export default async function ReportsPage() {
  const transactions = await getTransactions();
  const revenue = transactions.reduce((sum, tx) => sum + tx.finalSalePrice, 0);
  const avg = transactions.length ? Math.round(revenue / transactions.length) : 0;
  const csv = [["transaction_id","sale_date","vehicle","salesperson","customer","final_sale_price","payment_method"], ...transactions.map((tx) => [tx.id, new Date(tx.saleDate).toISOString(), `${tx.vehicle.year} ${tx.vehicle.make} ${tx.vehicle.model}`, tx.salesperson.fullName, tx.customer.name, String(tx.finalSalePrice), tx.paymentMethod])].map((row) => row.join(",")).join("\n");
  return (
    <div className="space-y-6">
      <PageHeader title="Sales reporting" description="Transactions, revenue and model mix." action={<a href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download="transactions.csv" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">Export CSV</a>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Metric label="Total revenue" value={currency(revenue)} />
        <Metric label="Closed sales" value={String(transactions.length)} />
        <Metric label="Average sale" value={currency(avg)} />
      </div>
      <Card><CardContent className="py-5"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-border text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-500">Date</th><th className="px-4 py-3 text-left font-medium text-slate-500">Vehicle</th><th className="px-4 py-3 text-left font-medium text-slate-500">Customer</th><th className="px-4 py-3 text-left font-medium text-slate-500">Salesperson</th><th className="px-4 py-3 text-left font-medium text-slate-500">Price</th></tr></thead><tbody className="divide-y divide-border bg-white">{transactions.map((tx) => <tr key={tx.id}><td className="px-4 py-3">{date(tx.saleDate)}</td><td className="px-4 py-3">{tx.vehicle.year} {tx.vehicle.make} {tx.vehicle.model}</td><td className="px-4 py-3">{tx.customer.name}</td><td className="px-4 py-3">{tx.salesperson.fullName}</td><td className="px-4 py-3">{currency(tx.finalSalePrice)}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
