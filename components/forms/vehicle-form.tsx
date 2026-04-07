"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveVehicleAction, type ActionState } from "@/lib/actions";
import { vehicleFormSchema, type VehicleFormInput } from "@/lib/validation";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

const statusOptions = ["AVAILABLE", "RESERVED", "SOLD"] as const;
const conditionOptions = ["NEW", "USED", "CERTIFIED"] as const;

export function VehicleForm({
  vehicle
}: {
  vehicle?: Partial<VehicleFormInput> & { id?: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<VehicleFormInput>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vin: vehicle?.vin ?? "",
      make: vehicle?.make ?? "",
      model: vehicle?.model ?? "",
      trim: vehicle?.trim ?? "",
      year: vehicle?.year ?? new Date().getFullYear(),
      mileage: vehicle?.mileage ?? 0,
      price: vehicle?.price ?? 0,
      color: vehicle?.color ?? "",
      fuelType: vehicle?.fuelType ?? "",
      transmission: vehicle?.transmission ?? "",
      bodyType: vehicle?.bodyType ?? "",
      engine: vehicle?.engine ?? "",
      horsepower: vehicle?.horsepower ?? 0,
      drivetrain: vehicle?.drivetrain ?? "",
      condition: vehicle?.condition ?? "USED",
      status: vehicle?.status ?? "AVAILABLE",
      description: vehicle?.description ?? "",
      features: vehicle?.features ?? "",
      images: vehicle?.images ?? ""
    }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result: ActionState = await saveVehicleAction({
        id: vehicle?.id,
        ...values
      });

      if (result.success) {
        router.push("/admin/inventory");
        router.refresh();
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="VIN" error={errors.vin?.message}>
          <Input {...register("vin")} />
        </Field>
        <Field label="Make" error={errors.make?.message}>
          <Input {...register("make")} />
        </Field>
        <Field label="Model" error={errors.model?.message}>
          <Input {...register("model")} />
        </Field>
        <Field label="Trim" error={errors.trim?.message}>
          <Input {...register("trim")} />
        </Field>
        <Field label="Year" error={errors.year?.message}>
          <Input type="number" {...register("year", { valueAsNumber: true })} />
        </Field>
        <Field label="Mileage" error={errors.mileage?.message}>
          <Input type="number" {...register("mileage", { valueAsNumber: true })} />
        </Field>
        <Field label="Price" error={errors.price?.message}>
          <Input type="number" {...register("price", { valueAsNumber: true })} />
        </Field>
        <Field label="Color" error={errors.color?.message}>
          <Input {...register("color")} />
        </Field>
        <Field label="Fuel type" error={errors.fuelType?.message}>
          <Input {...register("fuelType")} />
        </Field>
        <Field label="Transmission" error={errors.transmission?.message}>
          <Input {...register("transmission")} />
        </Field>
        <Field label="Body type" error={errors.bodyType?.message}>
          <Input {...register("bodyType")} />
        </Field>
        <Field label="Engine" error={errors.engine?.message}>
          <Input {...register("engine")} />
        </Field>
        <Field label="Horsepower" error={errors.horsepower?.message}>
          <Input type="number" {...register("horsepower", { valueAsNumber: true })} />
        </Field>
        <Field label="Drivetrain" error={errors.drivetrain?.message}>
          <Input {...register("drivetrain")} />
        </Field>
        <Field label="Condition" error={errors.condition?.message}>
          <Select {...register("condition")}>
            {conditionOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            {statusOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Features" error={errors.features?.message}>
        <Input {...register("features")} placeholder="Comma separated, e.g. Leather seats, Adaptive cruise" />
      </Field>
      <Field label="Image URLs" error={errors.images?.message}>
        <Input {...register("images")} placeholder="Comma separated URLs" />
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <Textarea {...register("description")} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : vehicle?.id ? "Save changes" : "Add vehicle"}
        </Button>
      </div>
    </form>
  );
}
