import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/forms/vehicle-form";
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { getInventoryVehicle } from "@/lib/queries";

export default async function EditVehiclePage({
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
      <PageHeader title="Edit vehicle" description={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
      <Card>
        <CardHeader>
          <CardTitle>Vehicle details</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            vehicle={{
              id: vehicle.id,
              vin: vehicle.vin,
              make: vehicle.make,
              model: vehicle.model,
              trim: vehicle.trim,
              year: vehicle.year,
              mileage: vehicle.mileage,
              price: vehicle.price,
              color: vehicle.color,
              fuelType: vehicle.fuelType,
              transmission: vehicle.transmission,
              bodyType: vehicle.bodyType,
              engine: vehicle.engine,
              horsepower: vehicle.horsepower,
              drivetrain: vehicle.drivetrain,
              condition: vehicle.condition,
              status: vehicle.status,
              description: vehicle.description,
              features: vehicle.features.join(", "),
              images: vehicle.images.join(", ")
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
