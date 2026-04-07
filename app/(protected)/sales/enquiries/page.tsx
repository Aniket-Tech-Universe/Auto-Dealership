import { Role } from "@prisma/client";
import { EnquiriesTable } from "@/components/tables/enquiries-table";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getEnquiries } from "@/lib/queries";

export default async function SalesEnquiriesPage() {
  const user = await requireUser(Role.SALES);
  const enquiries = await getEnquiries(Role.SALES, user.employee!.id);

  return (
    <div className="space-y-6">
      <PageHeader title="Assigned enquiries" description="Only the leads currently assigned to you." />
      <EnquiriesTable
        data={enquiries.map((enquiry) => ({
          id: enquiry.id,
          customerName: enquiry.customer.name,
          message: enquiry.message,
          vehicleLabel: enquiry.vehicle
            ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}`
            : "General enquiry",
          assignedTo: enquiry.assignedTo?.fullName ?? "Unassigned",
          status: enquiry.status,
          createdAt: enquiry.createdAt.toISOString()
        }))}
      />
    </div>
  );
}
