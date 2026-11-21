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
  keywords: ["SaaS", "agency operations", "Next.js", "Supabase", "project management"],
  authors: [{ name: "PulseBoard" }],
  openGraph: {
    title: "PulseBoard — Agency Operations, in focus",
    description: "A focused multi-tenant operations workspace for small agencies.",
    type: "website",
    siteName: "PulseBoard",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseBoard — Agency Operations, in focus",
    description: "A focused multi-tenant operations workspace for small agencies.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
