"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInteractionAction } from "@/lib/actions";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

export function InteractionForm({
  enquiryId,
  vehicleId,
  customerId
}: {
  enquiryId?: string;
  vehicleId?: string;
  customerId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-border p-4"
      action={(formData) => {
        startTransition(async () => {
          await createInteractionAction({
            enquiryId,
            vehicleId,
            customerId,
            type: String(formData.get("type")),
            note: String(formData.get("note")),
            followUpAt: String(formData.get("followUpAt") || "")
          });
          router.refresh();
        });
      }}
    >
      <Field label="Interaction type">
        <Select name="type" defaultValue="CALL">
          {["CALL", "EMAIL", "SHOWROOM_VISIT", "TEST_DRIVE", "CHAT", "FOLLOW_UP_NOTE"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Note">
        <Textarea name="note" placeholder="What happened, what was agreed, and what comes next." />
      </Field>
      <Field label="Follow-up date">
        <Input type="datetime-local" name="followUpAt" />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Log interaction"}
      </Button>
    </form>
  );
}
