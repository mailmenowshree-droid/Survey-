import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospitality Operations — 2 Minute Survey",
  description: "A short study of the operational challenges facing hospitality businesses.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}