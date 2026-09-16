import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { WebMCPTools } from "@/components/sachplus/webmcp";

export const metadata: Metadata = {
  title: "Sạch+ | Laundry & Café",
  description: "Đặt lịch giặt ủi, giao nhận nội khu và gọi món Sạch+ Café trong một trải nghiệm liền mạch.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}<WebMCPTools /><Toaster position="top-right" richColors /></body></html>;
}
