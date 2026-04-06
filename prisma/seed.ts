import { PrismaClient, Role, VehicleCondition, VehicleStatus, EnquiryStatus, EnquiryPriority, LeadSource, PaymentMethod, InteractionType } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();
const hashPassword = (value: string) => createHash("sha256").update(value).digest("hex");

const vehicles = [
  { vin: "1HGCV1F30NA100201", make: "Honda", model: "Accord", trim: "EX-L", year: 2022, mileage: 24800, price: 28900, color: "Meteorite Gray", fuelType: "Petrol", transmission: "CVT", bodyType: "Sedan", engine: "1.5L Turbo", horsepower: 192, drivetrain: "FWD", condition: VehicleCondition.USED, status: VehicleStatus.AVAILABLE, description: "Clean sedan with strong service history and one private owner.", features: ["Leather seats", "Wireless Apple CarPlay", "Blind spot monitoring"], images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d"] },
  { vin: "1FTFW1E82NFA11027", make: "Ford", model: "F-150", trim: "Lariat", year: 2022, mileage: 31250, price: 46900, color: "Oxford White", fuelType: "Petrol", transmission: "10-speed automatic", bodyType: "Pickup", engine: "3.5L EcoBoost", horsepower: 400, drivetrain: "4WD", condition: VehicleCondition.USED, status: VehicleStatus.AVAILABLE, description: "Crew-cab truck with towing and premium tech package.", features: ["360 camera", "Tow package", "Heated seats"], images: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b"] },
  { vin: "WBA53AK01PCM12241", make: "BMW", model: "5 Series", trim: "530i", year: 2023, mileage: 14100, price: 54800, color: "Alpine White", fuelType: "Petrol", transmission: "8-speed automatic", bodyType: "Sedan", engine: "2.0L Turbo", horsepower: 248, drivetrain: "RWD", condition: VehicleCondition.CERTIFIED, status: VehicleStatus.RESERVED, description: "Certified car with low mileage and remaining service package.", features: ["Parking assistant", "Adaptive LED", "Harman Kardon audio"], images: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"] },
  { vin: "5YJ3E1EA1PF441255", make: "Tesla", model: "Model 3", trim: "Long Range", year: 2023, mileage: 11800, price: 41750, color: "Pearl White", fuelType: "Electric", transmission: "Single-speed", bodyType: "Sedan", engine: "Dual Motor", horsepower: 425, drivetrain: "AWD", condition: VehicleCondition.USED, status: VehicleStatus.AVAILABLE, description: "Dual-motor EV with strong range and clean battery report.", features: ["Autopilot", "Premium interior", "Glass roof"], images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89"] },
  { vin: "19XFL2H82RE003511", make: "Honda", model: "Civic", trim: "Sport Touring", year: 2024, mileage: 6200, price: 32400, color: "Sonic Gray", fuelType: "Petrol", transmission: "CVT", bodyType: "Hatchback", engine: "1.5L Turbo", horsepower: 180, drivetrain: "FWD", condition: VehicleCondition.NEW, status: VehicleStatus.AVAILABLE, description: "Current-model hatchback with strong practicality and tasteful spec.", features: ["Bose audio", "Leather trim", "Wireless charging"], images: ["https://images.unsplash.com/photo-1542282088-fe8426682b8f"] },
  { vin: "3CZRS6H93RM700522", make: "Honda", model: "CR-V Hybrid", trim: "Sport Touring", year: 2024, mileage: 5400, price: 38600, color: "Crystal Black", fuelType: "Hybrid", transmission: "eCVT", bodyType: "SUV", engine: "2.0L Hybrid", horsepower: 204, drivetrain: "AWD", condition: VehicleCondition.NEW, status: VehicleStatus.AVAILABLE, description: "Best-selling compact SUV in top hybrid trim.", features: ["Hands-free tailgate", "Bose audio", "Google built-in"], images: ["https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98"] }
];

const employees = [
  { fullName: "Maya Chen", email: "admin@dealer.com", phone: "+1 415 555 0101", role: Role.ADMIN, monthlyTarget: 0, active: true },
  { fullName: "Jordan Hayes", email: "sales@dealer.com", phone: "+1 415 555 0102", role: Role.SALES, monthlyTarget: 220000, active: true },
  { fullName: "Priya Nair", email: "priya@dealer.com", phone: "+1 415 555 0103", role: Role.SALES, monthlyTarget: 180000, active: true },
  { fullName: "Daniel Brooks", email: "daniel@dealer.com", phone: "+1 415 555 0104", role: Role.SALES, monthlyTarget: 190000, active: true }
];

const customers = [
  ["Olivia Martinez", "olivia.martinez@example.com", "+1 628 555 2001"],
  ["Liam Thompson", "liam.thompson@example.com", "+1 628 555 2002"],
  ["Ava Johnson", "ava.johnson@example.com", "+1 628 555 2003"],
  ["Noah Parker", "noah.parker@example.com", "+1 628 555 2004"],
  ["Emma Walker", "emma.walker@example.com", "+1 628 555 2005"]
] as const;

async function main() {
  await prisma.saleTransaction.deleteMany();
  await prisma.interactionLog.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({ data: { email: "admin@dealer.com", passwordHash: hashPassword("password"), role: Role.ADMIN } });
  const salesUser = await prisma.user.create({ data: { email: "sales@dealer.com", passwordHash: hashPassword("password"), role: Role.SALES } });

  const createdEmployees = [];
  for (const [index, item] of employees.entries()) {
    createdEmployees.push(await prisma.employee.create({
      data: {
        ...item,
        joinedAt: new Date(Date.now() - (index + 3) * 30 * 24 * 60 * 60 * 1000),
        userId: index === 0 ? adminUser.id : index === 1 ? salesUser.id : undefined
      }
    }));
  }

  const createdVehicles = [];
  for (const item of vehicles) createdVehicles.push(await prisma.vehicle.create({ data: item }));

  const createdCustomers = [];
  for (const [name, email, phone] of customers) createdCustomers.push(await prisma.customer.create({ data: { name, email, phone } }));

  await prisma.saleTransaction.create({
    data: {
      vehicleId: createdVehicles[0].id,
      salespersonId: createdEmployees[1].id,
      customerId: createdCustomers[0].id,
      saleDate: new Date(),
      finalSalePrice: 28100,
      paymentMethod: PaymentMethod.FINANCE,
      notes: "Trade-in approved and finance finalized same day."
    }
  });
  await prisma.vehicle.update({ where: { id: createdVehicles[0].id }, data: { status: VehicleStatus.SOLD, soldAt: new Date() } });

  const enquiry = await prisma.enquiry.create({
    data: {
      customerId: createdCustomers[1].id,
      vehicleId: createdVehicles[2].id,
      assignedToId: createdEmployees[1].id,
      message: "Can you confirm the total on-road price and warranty details?",
      source: LeadSource.WEBSITE,
      status: EnquiryStatus.NEW,
      priority: EnquiryPriority.HIGH
    }
  });

  await prisma.interactionLog.create({
    data: {
      employeeId: createdEmployees[1].id,
      customerId: createdCustomers[1].id,
      vehicleId: createdVehicles[2].id,
      enquiryId: enquiry.id,
      type: InteractionType.CALL,
      note: "Initial call completed and brochure shared by email."
    }
  });
}

main().finally(async () => prisma.$disconnect());
