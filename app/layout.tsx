import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PulseBoard — Agency Operations, in focus",
    template: "%s | PulseBoard",
  },
  description:
    "A focused operations workspace for small agencies to manage clients, projects, tasks, and team performance.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
