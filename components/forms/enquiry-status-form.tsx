"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiryStatusAction } from "@/lib/actions";
import { Button, Field, Select, Textarea } from "@/components/ui";

export function EnquiryStatusForm({
  enquiryId,
  currentStatus
}: {
  enquiryId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-border p-4"
      action={(formData) => {
        startTransition(async () => {
          await updateEnquiryStatusAction({
            enquiryId,
            status: String(formData.get("status")),
            note: String(formData.get("note") || "")
          });
          router.refresh();
        });
      }}
    >
      <Field label="Status">
        <Select name="status" defaultValue={currentStatus}>
          {["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "CLOSED", "LOST"].map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Internal note">
        <Textarea name="note" placeholder="Add context for the next follow-up." />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Updating..." : "Update status"}
      </Button>
    </form>
  );
}
