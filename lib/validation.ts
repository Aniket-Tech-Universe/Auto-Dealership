import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required.")
});

export const vehicleFormSchema = z.object({
  vin: z.string().min(8, "VIN is required."),
  make: z.string().min(1, "Make is required."),
  model: z.string().min(1, "Model is required."),
  trim: z.string().min(1, "Trim is required."),
  year: z.coerce.number().min(2000).max(2035),
  mileage: z.coerce.number().min(0),
  price: z.coerce.number().min(1),
  color: z.string().min(1, "Color is required."),
  fuelType: z.string().min(1, "Fuel type is required."),
  transmission: z.string().min(1, "Transmission is required."),
  bodyType: z.string().min(1, "Body type is required."),
  engine: z.string().min(1, "Engine is required."),
  horsepower: z.coerce.number().min(40),
  drivetrain: z.string().min(1, "Drivetrain is required."),
  condition: z.enum(["NEW", "USED", "CERTIFIED"]),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
  description: z.string().min(20, "Description should be a little more specific."),
  features: z.string().min(3, "Add at least one feature."),
  images: z.string().min(5, "Add at least one image URL.")
});

export const saleSchema = z.object({
  vehicleId: z.string().min(1),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6),
  finalSalePrice: z.coerce.number().min(1),
  paymentMethod: z.enum(["CASH", "FINANCE", "LEASE", "BANK_TRANSFER", "CARD"]),
  notes: z.string().optional()
});

export const interactionSchema = z.object({
  enquiryId: z.string().optional(),
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
  type: z.enum(["CALL", "EMAIL", "SHOWROOM_VISIT", "TEST_DRIVE", "CHAT", "FOLLOW_UP_NOTE"]),
  note: z.string().min(4),
  followUpAt: z.string().optional()
});

export type VehicleFormInput = z.infer<typeof vehicleFormSchema>;
