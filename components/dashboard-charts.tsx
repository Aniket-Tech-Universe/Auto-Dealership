"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { currency } from "@/lib/utils";

const pieColors = ["#0f172a", "#475569", "#94a3b8", "#cbd5e1"];

export function RevenueTrendChart({
  title,
  data
}: {
  title: string;
  data: { name: string; revenue: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value: number) => currency(value)} />
            <Line type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function InventoryStatusChart({
  data
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={2}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                {item.name}
              </div>
              <span className="font-medium text-slate-950">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MakeMixChart({
  data
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by make</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
