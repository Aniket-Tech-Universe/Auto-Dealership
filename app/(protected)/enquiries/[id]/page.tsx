import { Role } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { AssignEnquiryForm } from "@/components/forms/assign-enquiry-form";
import { EnquiryStatusForm } from "@/components/forms/enquiry-status-form";
import { InteractionForm } from "@/components/forms/interaction-form";
import { Card, CardContent, CardHeader, CardTitle, InfoList, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getEnquiry, getSalesEmployees } from "@/lib/queries";
import { date, titleCase } from "@/lib/utils";

export default async function EnquiryDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const enquiry = await getEnquiry(id);

  if (!enquiry) {
    notFound();
  }

  if (user.role === Role.SALES && enquiry.assignedToId !== user.employee?.id) {
    redirect("/unauthorized");
  }

  const employees = user.role === Role.ADMIN ? await getSalesEmployees() : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={enquiry.customer.name}
        description={
          enquiry.vehicle
            ? `${enquiry.vehicle.year} ${enquiry.vehicle.make} ${enquiry.vehicle.model}`
            : "General enquiry"
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoList
                items={[
                  ["Email", enquiry.customer.email],
                  ["Phone", enquiry.customer.phone],
                  ["Source", titleCase(enquiry.source)],
                  ["Assigned to", enquiry.assignedTo?.fullName ?? "Unassigned"],
                  ["Status", titleCase(enquiry.status)],
                  ["Priority", titleCase(enquiry.priority)]
                ]}
              />
              <div>
                <div className="text-sm text-slate-500">Message</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{enquiry.message}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {enquiry.interactions.length ? (
                enquiry.interactions.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-950">{titleCase(item.type)}</div>
                      <div className="text-sm text-slate-500">{date(item.createdAt)}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{item.employee.fullName}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No history yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {user.role === Role.ADMIN ? (
            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <AssignEnquiryForm
                  enquiryId={enquiry.id}
                  assignedToId={enquiry.assignedToId}
                  employees={employees.map((employee) => ({ id: employee.id, fullName: employee.fullName }))}
                />
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Status update</CardTitle>
            </CardHeader>
            <CardContent>
              <EnquiryStatusForm enquiryId={enquiry.id} currentStatus={enquiry.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractionForm
                enquiryId={enquiry.id}
                vehicleId={enquiry.vehicleId ?? undefined}
                customerId={enquiry.customerId}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
