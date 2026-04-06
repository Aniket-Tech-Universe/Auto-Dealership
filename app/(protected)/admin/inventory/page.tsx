import Link from "next/link";
import { PageHeader, Card, CardContent } from "@/components/ui";
import { getInventory } from "@/lib/data";
import { currency, titleCase } from "@/lib/utils";

export default async function AdminInventoryPage() {
  const inventory = await getInventory();
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Search, filter and maintain current stock." />
      <Card><CardContent className="py-5"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-border text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-500">Vehicle</th><th className="px-4 py-3 text-left font-medium text-slate-500">Price</th><th className="px-4 py-3 text-left font-medium text-slate-500">Mileage</th><th className="px-4 py-3 text-left font-medium text-slate-500">Status</th><th className="px-4 py-3 text-left font-medium text-slate-500"></th></tr></thead><tbody className="divide-y divide-border bg-white">{inventory.map((vehicle) => <tr key={vehicle.id}><td className="px-4 py-3"><div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div><div className="text-slate-500">{vehicle.trim}</div></td><td className="px-4 py-3">{currency(vehicle.price)}</td><td className="px-4 py-3">{vehicle.mileage.toLocaleString()} mi</td><td className="px-4 py-3">{titleCase(vehicle.status)}</td><td className="px-4 py-3"><Link href={`/vehicles/${vehicle.id}`} className="font-medium underline">Open</Link></td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
