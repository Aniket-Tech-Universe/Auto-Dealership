import { Role, VehicleStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getAdminDashboard() {
  const [vehicles, sales, enquiries, salesEmployees] = await Promise.all([
    db.vehicle.findMany({ orderBy: { createdAt: "desc" } }),
    db.saleTransaction.findMany({
      include: { vehicle: true, customer: true, salesperson: true },
      orderBy: { saleDate: "desc" }
    }),
    db.enquiry.findMany({
      include: { customer: true, vehicle: true, assignedTo: true },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    db.employee.findMany({
      where: { role: Role.SALES },
      include: { sales: true }
    })
  ]);

  const monthlyRevenue = sales.reduce((sum, sale) => sum + sale.finalSalePrice, 0);
  const monthlySalesCount = sales.length;

  const topPerformer = salesEmployees
    .map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      revenue: employee.sales.reduce((sum, sale) => sum + sale.finalSalePrice, 0),
      salesCount: employee.sales.length
    }))
    .sort((a, b) => b.revenue - a.revenue)[0] ?? null;

  const revenueTrend = sales
    .slice()
    .reverse()
    .map((sale, index) => ({
      name: `Deal ${index + 1}`,
      revenue: sale.finalSalePrice
    }));

  const inventoryByStatus = [
    { name: "Available", value: vehicles.filter((v) => v.status === VehicleStatus.AVAILABLE).length },
    { name: "Reserved", value: vehicles.filter((v) => v.status === VehicleStatus.RESERVED).length },
    { name: "Sold", value: vehicles.filter((v) => v.status === VehicleStatus.SOLD).length }
  ];

  return {
    vehicles,
    sales,
    enquiries,
    monthlyRevenue,
    monthlySalesCount,
    topPerformer,
    revenueTrend,
    inventoryByStatus
  };
}

export async function getInventory() {
  return db.vehicle.findMany({
    include: {
      sale: true,
      enquiries: true
    },
    orderBy: [{ status: "asc" }, { year: "desc" }, { make: "asc" }]
  });
}

export async function getInventoryVehicle(id: string) {
  return db.vehicle.findUnique({
    where: { id },
    include: {
      sale: { include: { customer: true, salesperson: true } },
      enquiries: {
        include: {
          customer: true,
          assignedTo: true
        }
      },
      interactions: {
        include: {
          employee: true,
          customer: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function getEmployees() {
  const rows = await db.employee.findMany({
    include: {
      sales: true,
      assignedEnquiries: true
    },
    orderBy: { fullName: "asc" }
  });

  return rows.map((row) => ({
    ...row,
    salesCount: row.sales.length,
    revenueGenerated: row.sales.reduce((sum, sale) => sum + sale.finalSalePrice, 0),
    assignedCount: row.assignedEnquiries.length,
    targetProgress:
      row.monthlyTarget > 0
        ? Math.round((row.sales.reduce((sum, sale) => sum + sale.finalSalePrice, 0) / row.monthlyTarget) * 100)
        : 0
  }));
}

export async function getTransactions() {
  const rows = await db.saleTransaction.findMany({
    include: {
      vehicle: true,
      customer: true,
      salesperson: true
    },
    orderBy: { saleDate: "desc" }
  });

  const byMake = Object.values(
    rows.reduce<Record<string, { name: string; count: number }>>((acc, row) => {
      if (!acc[row.vehicle.make]) {
        acc[row.vehicle.make] = { name: row.vehicle.make, count: 0 };
      }
      acc[row.vehicle.make].count += 1;
      return acc;
    }, {})
  );

  return {
    rows,
    byMake
  };
}

export async function getEnquiries(role?: Role, employeeId?: string) {
  return db.enquiry.findMany({
    where: role === Role.SALES ? { assignedToId: employeeId } : undefined,
    include: {
      customer: true,
      vehicle: true,
      assignedTo: true,
      interactions: {
        include: { employee: true },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });
}

export async function getEnquiry(id: string) {
  return db.enquiry.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      assignedTo: true,
      interactions: {
        include: {
          employee: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function getSalesOverview(employeeId: string) {
  return db.employee.findUnique({
    where: { id: employeeId },
    include: {
      sales: {
        include: {
          vehicle: true,
          customer: true
        },
        orderBy: { saleDate: "desc" }
      },
      assignedEnquiries: {
        include: {
          customer: true,
          vehicle: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

export async function getSalesEmployees() {
  return db.employee.findMany({
    where: { role: Role.SALES },
    orderBy: { fullName: "asc" }
  });
}
