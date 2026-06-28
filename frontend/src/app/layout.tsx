import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewDibo",
  description: "Discover and share product reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
