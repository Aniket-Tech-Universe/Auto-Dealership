import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auto Dealership Platform",
  description: "Internal platform for dealership inventory, leads, and sales operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
