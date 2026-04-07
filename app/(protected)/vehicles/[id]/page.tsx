import { notFound } from "next/navigation";
import { InteractionForm } from "@/components/forms/interaction-form";
import { SaleForm } from "@/components/forms/sale-form";
import { Badge, Card, CardContent, CardHeader, CardTitle, InfoList, PageHeader } from "@/components/ui";
import { getInventoryVehicle } from "@/lib/queries";
import { currency, date, titleCase } from "@/lib/utils";

export default async function VehicleDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getInventoryVehicle(id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        description={`${vehicle.trim} · ${currency(vehicle.price)}`}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <img
                src={`${vehicle.images[0]}?auto=format&fit=crop&w=1400&q=80`}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-[360px] w-full rounded-2xl object-cover"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <InfoList
                items={[
                  ["VIN", vehicle.vin],
                  ["Mileage", `${vehicle.mileage.toLocaleString()} mi`],
                  ["Fuel", vehicle.fuelType],
                  ["Transmission", vehicle.transmission],
                  ["Body", vehicle.bodyType],
                  ["Engine", vehicle.engine],
                  ["Horsepower", `${vehicle.horsepower} hp`],
                  ["Drivetrain", vehicle.drivetrain],
                  ["Color", vehicle.color],
                  ["Condition", titleCase(vehicle.condition)]
                ]}
              />
              <div>
                <div className="text-sm text-slate-500">Features</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {vehicle.features.map((feature) => (
                    <Badge key={feature}>{feature}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Description</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{vehicle.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicle.interactions.length ? (
                vehicle.interactions.map((item) => (
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
                <p className="text-sm text-slate-500">No recorded interactions yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Status</div>
                <Badge
                  tone={
                    vehicle.status === "SOLD" ? "danger" : vehicle.status === "RESERVED" ? "warning" : "success"
                  }
                >
                  {titleCase(vehicle.status)}
                </Badge>
              </div>
              {vehicle.sale ? (
                <div className="rounded-xl border border-border p-3 text-sm text-slate-700">
                  Sold for {currency(vehicle.sale.finalSalePrice)} to {vehicle.sale.customer.name} on{" "}
                  {date(vehicle.sale.saleDate)}.
                </div>
              ) : (
                <div className="rounded-xl border border-border p-3 text-sm text-slate-700">
                  Available for interaction logging and sale recording.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log sale</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.status === "SOLD" ? (
                <p className="text-sm text-slate-500">This vehicle is already marked as sold.</p>
              ) : (
                <SaleForm vehicleId={vehicle.id} askingPrice={vehicle.price} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractionForm vehicleId={vehicle.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linked enquiries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vehicle.enquiries.length ? (
                vehicle.enquiries.map((enquiry) => (
                  <div key={enquiry.id} className="rounded-xl border border-border p-3">
                    <div className="font-medium text-slate-950">{enquiry.customer.name}</div>
                    <div className="text-sm text-slate-500">
                      {titleCase(enquiry.status)} · {enquiry.assignedTo?.fullName ?? "Unassigned"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No linked enquiries.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
