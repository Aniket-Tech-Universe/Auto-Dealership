import Link from "next/link";
import { Card, CardContent, PageHeader } from "@/components/ui";
import { getEnquiries } from "@/lib/data";
import { date, titleCase } from "@/lib/utils";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  return (
    <div className="space-y-6">
      <PageHeader title="Enquiries" description="Lead pipeline, assignment and current status." />
      <Card><CardContent className="py-5"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-border text-sm"><thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-500">Lead</th><th className="px-4 py-3 text-left font-medium text-slate-500">Vehicle</th><th className="px-4 py-3 text-left font-medium text-slate-500">Status</th><th className="px-4 py-3 text-left font-medium text-slate-500">Assigned to</th><th className="px-4 py-3 text-left font-medium text-slate-500">Created</th></tr></thead><tbody className="divide-y divide-border bg-white">{enquiries.map((enquiry) => <tr key={enquiry.id}><td className="px-4 py-3"><Link href={`/enquiries/${enquiry.id}`} className="font-medium underline">{enquiry.customer.name}</Link><div className="text-slate-500">{enquiry.message}</div></td><td className="px-4 py-3">{enquiry.vehicle ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}` : "General enquiry"}</td><td className="px-4 py-3">{titleCase(enquiry.status)}</td><td className="px-4 py-3">{enquiry.assignedTo?.fullName ?? "Unassigned"}</td><td className="px-4 py-3">{date(enquiry.createdAt)}</td></tr>)}</tbody></table></div></CardContent></Card>
    </div>
  );
}
