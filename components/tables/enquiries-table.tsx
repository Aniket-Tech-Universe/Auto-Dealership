"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Card, CardContent, Input, Select } from "@/components/ui";
import { date, titleCase } from "@/lib/utils";

type Row = {
  id: string;
  customerName: string;
  message: string;
  vehicleLabel: string;
  assignedTo: string;
  status: string;
  createdAt: string;
};

const column = createColumnHelper<Row>();

export function EnquiriesTable({ data }: { data: Row[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(
    () => (statusFilter === "ALL" ? data : data.filter((item) => item.status === statusFilter)),
    [data, statusFilter]
  );

  const columns = [
    column.accessor("customerName", {
      header: "Lead",
      cell: (info) => (
        <div>
          <Link href={`/enquiries/${info.row.original.id}`} className="font-medium text-slate-950 underline">
            {info.getValue()}
          </Link>
          <div className="max-w-[420px] truncate text-slate-500">{info.row.original.message}</div>
        </div>
      )
    }),
    column.accessor("vehicleLabel", {
      header: "Vehicle"
    }),
    column.accessor("status", {
      header: "Status",
      cell: (info) => titleCase(info.getValue())
    }),
    column.accessor("assignedTo", {
      header: "Assigned to"
    }),
    column.accessor("createdAt", {
      header: "Created",
      cell: (info) => date(info.getValue())
    })
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, value) => {
      const term = String(value).toLowerCase();
      return `${row.original.customerName} ${row.original.vehicleLabel} ${row.original.message}`.toLowerCase().includes(term);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search customer, vehicle, or message"
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="md:w-[200px]">
            <option value="ALL">All statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="FOLLOW_UP">Follow up</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
            <option value="LOST">Lost</option>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-slate-50">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium text-slate-500">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
