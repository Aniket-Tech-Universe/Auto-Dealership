"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { deleteVehicleAction, markVehicleAvailableAction } from "@/lib/actions";
import { Button, Card, CardContent, Input, Select } from "@/components/ui";
import { currency, titleCase } from "@/lib/utils";

type Row = {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
};

const column = createColumnHelper<Row>();

export function InventoryTable({
  data,
  canManage
}: {
  data: Row[];
  canManage?: boolean;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => (statusFilter === "ALL" ? data : data.filter((item) => item.status === statusFilter)),
    [data, statusFilter]
  );

  const columns = [
    column.accessor("make", {
      header: "Vehicle",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <div className="font-medium text-slate-950">
              {row.year} {row.make} {row.model}
            </div>
            <div className="text-slate-500">{row.trim}</div>
          </div>
        );
      }
    }),
    column.accessor("price", {
      header: "Price",
      cell: (info) => currency(info.getValue())
    }),
    column.accessor("mileage", {
      header: "Mileage",
      cell: (info) => `${info.getValue().toLocaleString()} mi`
    }),
    column.accessor("status", {
      header: "Status",
      cell: (info) => titleCase(info.getValue())
    }),
    column.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/vehicles/${row.original.id}`} className="text-sm font-medium underline">
            Open
          </Link>
          {canManage ? (
            <>
              <Link href={`/admin/inventory/${row.original.id}/edit`} className="text-sm font-medium underline">
                Edit
              </Link>
              {row.original.status === "SOLD" ? (
                <button
                  className="text-sm font-medium underline"
                  onClick={() =>
                    startTransition(async () => {
                      await markVehicleAvailableAction(row.original.id);
                      location.reload();
                    })
                  }
                  disabled={pending}
                >
                  Reopen
                </button>
              ) : null}
              <button
                className="text-sm font-medium text-rose-600 underline"
                onClick={() => {
                  const confirmed = window.confirm("Remove this vehicle from inventory?");
                  if (!confirmed) return;
                  startTransition(async () => {
                    await deleteVehicleAction(row.original.id);
                    location.reload();
                  });
                }}
                disabled={pending}
              >
                Remove
              </button>
            </>
          ) : null}
        </div>
      )
    })
  ];

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, value) => {
      const term = String(value).toLowerCase();
      const vehicle = `${row.original.year} ${row.original.make} ${row.original.model} ${row.original.trim}`.toLowerCase();
      return vehicle.includes(term);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search make, model, trim"
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="md:w-[180px]">
            <option value="ALL">All statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </Select>
          {canManage ? (
            <Link href="/admin/inventory/new" className="md:ml-auto">
              <Button>Add vehicle</Button>
            </Link>
          ) : null}
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
