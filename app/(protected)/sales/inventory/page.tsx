import { InventoryTable } from "@/components/tables/inventory-table";
import { PageHeader } from "@/components/ui";
import { getInventory } from "@/lib/queries";

export default async function SalesInventoryPage() {
  const inventory = await getInventory();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Current stock with pricing and availability for customer conversations."
      />
      <InventoryTable
        data={inventory.map((vehicle) => ({
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.mileage,
          status: vehicle.status
        }))}
      />
    </div>
  );
}
