import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { WebMCPTools } from "@/components/sachplus/webmcp";
import { MobileNav } from "@/components/sachplus/mobile-nav";

export const metadata: Metadata = {
  title: "Sạch+ | Laundry & Coffee · Vinhomes Sài Gòn Park",
  description: "Mô hình Smart Laundry & Coffee 2 tầng chuẩn sống hiện đại tại Vinhomes Sài Gòn Park. Giặt ủi tự động, vật tư điện nước tiện ích và café tầng 1.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){window.process=window.process||{env:{NODE_ENV:"development"}};};`,
          }}
        />
      </head>
      <body>
        {children}
        <MobileNav />
        <WebMCPTools />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
