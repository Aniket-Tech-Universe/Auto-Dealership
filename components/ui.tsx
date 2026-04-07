import Link from "next/link";
import type React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary px-4 py-2 text-white hover:opacity-90",
        outline: "border border-border bg-white px-4 py-2 text-slate-700 hover:bg-slate-50",
        ghost: "px-3 py-2 text-slate-700 hover:bg-slate-100",
        danger: "bg-danger px-4 py-2 text-white hover:opacity-90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function LinkButton({
  href,
  children,
  className,
  variant = "default"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "danger";
}) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant }), className)}>
      {children}
    </Link>
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-white shadow-soft", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-border px-5 py-4", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold tracking-tight text-slate-950", className)} {...props} />;
}

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 py-5">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
        {hint ? <div className="text-sm text-slate-500">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="text-lg font-semibold text-slate-950">{title}</div>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export function SectionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function Badge({
  tone = "default",
  children
}: {
  tone?: "default" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700"
  } as const;

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles[tone])}>
      {children}
    </span>
  );
}

export function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-ring",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-slate-900 focus-visible:ring-2 focus-visible:ring-ring",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[110px] w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-ring",
        props.className
      )}
    />
  );
}

export function InfoList({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-border p-3">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-1 font-medium text-slate-950">{value}</div>
        </div>
      ))}
    </div>
  );
}
