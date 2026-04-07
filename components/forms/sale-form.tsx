"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSaleAction } from "@/lib/actions";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

export function SaleForm({
  vehicleId,
  askingPrice
}: {
  vehicleId: string;
  askingPrice: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-border p-4"
      action={(formData) => {
        startTransition(async () => {
          await createSaleAction({
            vehicleId,
            customerName: String(formData.get("customerName")),
            customerEmail: String(formData.get("customerEmail")),
            customerPhone: String(formData.get("customerPhone")),
            finalSalePrice: Number(formData.get("finalSalePrice")),
            paymentMethod: String(formData.get("paymentMethod")),
            notes: String(formData.get("notes") || "")
          });
          router.refresh();
        });
      }}
    >
      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
        Asking price: ${askingPrice.toLocaleString()}
      </div>
      <Field label="Customer name">
        <Input name="customerName" />
      </Field>
      <Field label="Customer email">
        <Input name="customerEmail" type="email" />
      </Field>
      <Field label="Customer phone">
        <Input name="customerPhone" />
      </Field>
      <Field label="Final sale price">
        <Input name="finalSalePrice" type="number" defaultValue={askingPrice} />
      </Field>
      <Field label="Payment method">
        <Select name="paymentMethod" defaultValue="FINANCE">
          {["CASH", "FINANCE", "LEASE", "BANK_TRANSFER", "CARD"].map((method) => (
            <option value={method} key={method}>
              {method}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Notes">
        <Textarea name="notes" />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Recording..." : "Log sale"}
      </Button>
    </form>
  );
}
