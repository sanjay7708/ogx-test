import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Name",
  description: "Creative development and design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
