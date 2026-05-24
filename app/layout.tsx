import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Spend Audit — Stop Overpaying for AI Tools",
  description: "Get an instant free audit of your AI subscriptions. See exactly where you're overspending and how much you could save.",
  openGraph: {
    title: "AI Spend Audit — Stop Overpaying for AI Tools",
    description: "Get an instant free audit of your AI subscriptions. See exactly where you're overspending and how much you could save.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "AI Spend Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit — Stop Overpaying for AI Tools",
    description: "Free tool to audit your AI subscriptions and find savings.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
