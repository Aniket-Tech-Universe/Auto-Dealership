import { Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { VehicleForm } from "@/components/forms/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add vehicle" description="Create a new inventory listing." />
      <Card>
        <CardHeader>
          <CardTitle>Vehicle details</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm />
        </CardContent>
      </Card>
    </div>
  );
}
