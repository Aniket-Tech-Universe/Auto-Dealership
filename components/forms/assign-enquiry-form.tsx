"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignEnquiryAction } from "@/lib/actions";
import { Button, Field, Select } from "@/components/ui";

export function AssignEnquiryForm({
  enquiryId,
  assignedToId,
  employees
}: {
  enquiryId: string;
  assignedToId: string | null;
  employees: { id: string; fullName: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-xl border border-border p-4"
      action={(formData) => {
        startTransition(async () => {
          await assignEnquiryAction({
            enquiryId,
            assignedToId: String(formData.get("assignedToId") || "")
          });
          router.refresh();
        });
      }}
    >
      <Field label="Assigned to">
        <Select name="assignedToId" defaultValue={assignedToId ?? ""}>
          <option value="">Unassigned</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Saving..." : "Save assignment"}
      </Button>
    </form>
  );
}
