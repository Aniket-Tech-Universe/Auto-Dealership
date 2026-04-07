"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  EnquiryStatus,
  InteractionType,
  PaymentMethod,
  Role,
  VehicleCondition,
  VehicleStatus
} from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { AUTH_COOKIE_NAME, encodeSession } from "@/lib/session";
import { interactionSchema, loginSchema, saleSchema, vehicleFormSchema } from "@/lib/validation";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const hashPassword = (value: string) => createHash("sha256").update(value).digest("hex");

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || "")
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
    include: { employee: true }
  });

  if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
    return { message: "Email or password is incorrect." };
  }

  const store = await cookies();
  store.set(AUTH_COOKIE_NAME, encodeSession({ userId: user.id, role: user.role }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/sales");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function saveVehicleAction(input: Record<string, unknown>): Promise<ActionState> {
  await requireUser(Role.ADMIN);

  const parsed = vehicleFormSchema.safeParse(input);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const payload = {
    ...parsed.data,
    condition: parsed.data.condition as VehicleCondition,
    status: parsed.data.status as VehicleStatus,
    features: parseList(parsed.data.features),
    images: parseList(parsed.data.images)
  };

  const id = typeof input.id === "string" ? input.id : undefined;

  if (id) {
    await db.vehicle.update({
      where: { id },
      data: payload
    });
  } else {
    await db.vehicle.create({
      data: payload
    });
  }

  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function deleteVehicleAction(id: string) {
  await requireUser(Role.ADMIN);

  await db.interactionLog.deleteMany({ where: { vehicleId: id } });
  await db.enquiry.updateMany({ where: { vehicleId: id }, data: { vehicleId: null } });
  await db.saleTransaction.deleteMany({ where: { vehicleId: id } });
  await db.vehicle.delete({ where: { id } });

  revalidatePath("/admin/inventory");
}

export async function markVehicleAvailableAction(id: string) {
  await requireUser(Role.ADMIN);

  await db.saleTransaction.deleteMany({ where: { vehicleId: id } });
  await db.vehicle.update({
    where: { id },
    data: {
      status: VehicleStatus.AVAILABLE,
      soldAt: null
    }
  });

  revalidatePath("/admin/inventory");
  revalidatePath(`/vehicles/${id}`);
}

export async function toggleEmployeeActiveAction(id: string, active: boolean) {
  await requireUser(Role.ADMIN);

  await db.employee.update({
    where: { id },
    data: { active: !active }
  });

  revalidatePath("/admin/employees");
}

export async function updateEmployeeRoleAction(id: string, role: "ADMIN" | "SALES") {
  await requireUser(Role.ADMIN);

  const employee = await db.employee.update({
    where: { id },
    data: { role: role as Role }
  });

  if (employee.userId) {
    await db.user.update({
      where: { id: employee.userId },
      data: { role: role as Role }
    });
  }

  revalidatePath("/admin/employees");
}

export async function assignEnquiryAction({
  enquiryId,
  assignedToId
}: {
  enquiryId: string;
  assignedToId: string;
}) {
  await requireUser(Role.ADMIN);

  await db.enquiry.update({
    where: { id: enquiryId },
    data: {
      assignedToId: assignedToId || null
    }
  });

  revalidatePath("/admin/enquiries");
  revalidatePath(`/enquiries/${enquiryId}`);
}

export async function updateEnquiryStatusAction({
  enquiryId,
  status,
  note
}: {
  enquiryId: string;
  status: string;
  note?: string;
}) {
  const user = await requireUser();
  const enquiry = await db.enquiry.findUnique({ where: { id: enquiryId } });

  if (!enquiry) {
    return;
  }

  if (user.role === Role.SALES && enquiry.assignedToId !== user.employee?.id) {
    return;
  }

  await db.enquiry.update({
    where: { id: enquiryId },
    data: {
      status: status as EnquiryStatus
    }
  });

  if (note && user.employee) {
    await db.interactionLog.create({
      data: {
        employeeId: user.employee.id,
        enquiryId,
        vehicleId: enquiry.vehicleId ?? undefined,
        customerId: enquiry.customerId ?? undefined,
        type: InteractionType.FOLLOW_UP_NOTE,
        note
      }
    });
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/sales/enquiries");
  revalidatePath(`/enquiries/${enquiryId}`);
}

export async function createInteractionAction(input: {
  enquiryId?: string;
  vehicleId?: string;
  customerId?: string;
  type: string;
  note: string;
  followUpAt?: string;
}) {
  const user = await requireUser();
  const parsed = interactionSchema.safeParse(input);

  if (!parsed.success || !user.employee) {
    return;
  }

  if (parsed.data.enquiryId) {
    const enquiry = await db.enquiry.findUnique({ where: { id: parsed.data.enquiryId } });
    if (!enquiry) return;
    if (user.role === Role.SALES && enquiry.assignedToId !== user.employee.id) return;
  }

  await db.interactionLog.create({
    data: {
      employeeId: user.employee.id,
      enquiryId: parsed.data.enquiryId || undefined,
      vehicleId: parsed.data.vehicleId || undefined,
      customerId: parsed.data.customerId || undefined,
      type: parsed.data.type as InteractionType,
      note: parsed.data.note,
      followUpAt: parsed.data.followUpAt ? new Date(parsed.data.followUpAt) : undefined
    }
  });

  if (parsed.data.enquiryId) {
    revalidatePath(`/enquiries/${parsed.data.enquiryId}`);
  }

  if (parsed.data.vehicleId) {
    revalidatePath(`/vehicles/${parsed.data.vehicleId}`);
  }

  revalidatePath("/sales/enquiries");
}

export async function createSaleAction(input: {
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  finalSalePrice: number;
  paymentMethod: string;
  notes?: string;
}) {
  const user = await requireUser();
  const parsed = saleSchema.safeParse(input);

  if (!parsed.success || !user.employee) {
    return;
  }

  const customer =
    (await db.customer.findUnique({ where: { email: parsed.data.customerEmail } })) ??
    (await db.customer.create({
      data: {
        name: parsed.data.customerName,
        email: parsed.data.customerEmail,
        phone: parsed.data.customerPhone
      }
    }));

  await db.saleTransaction.upsert({
    where: { vehicleId: parsed.data.vehicleId },
    update: {
      salespersonId: user.employee.id,
      customerId: customer.id,
      saleDate: new Date(),
      finalSalePrice: parsed.data.finalSalePrice,
      paymentMethod: parsed.data.paymentMethod as PaymentMethod,
      notes: parsed.data.notes || null
    },
    create: {
      vehicleId: parsed.data.vehicleId,
      salespersonId: user.employee.id,
      customerId: customer.id,
      saleDate: new Date(),
      finalSalePrice: parsed.data.finalSalePrice,
      paymentMethod: parsed.data.paymentMethod as PaymentMethod,
      notes: parsed.data.notes || null
    }
  });

  await db.vehicle.update({
    where: { id: parsed.data.vehicleId },
    data: {
      status: VehicleStatus.SOLD,
      soldAt: new Date()
    }
  });

  await db.enquiry.updateMany({
    where: { vehicleId: parsed.data.vehicleId },
    data: { status: EnquiryStatus.CONVERTED }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/sales");
  revalidatePath(`/vehicles/${parsed.data.vehicleId}`);
}
