import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ReviewDibo",
  description: "Discover and share product reviews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
              ReviewDibo
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 font-medium hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
