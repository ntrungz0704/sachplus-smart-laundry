"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Coffee, Home, PackageCheck, Shield, Sparkles, Wallet } from "lucide-react";
import { getCurrentUser, type UserProfile } from "@/lib/sachplus-auth";

export function MobileNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const handleAuth = (e: Event) => {
      const ce = e as CustomEvent<UserProfile | null>;
      setUser(ce.detail !== undefined ? ce.detail : getCurrentUser());
    };
    window.addEventListener("sachplus:auth-changed", handleAuth);
    return () => window.removeEventListener("sachplus:auth-changed", handleAuth);
  }, []);

  // Ẩn thanh bottom nav trên các cổng quản trị chuyên sâu staff, owner & admin
  if (pathname?.startsWith("/quay") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { href: "/", label: "Trang chủ", icon: Home },
    user?.role === "admin"
      ? { href: "/admin", label: "Quản trị", icon: Shield }
      : { href: "/dat-lich", label: "Đặt giặt", icon: Sparkles },
    { href: "/cafe", label: "Sạch+ Café", icon: Coffee },
    { href: "/don-cua-toi", label: "Đơn giặt", icon: PackageCheck },
    { href: "/vi-va-uu-dai", label: "Ví & Thẻ", icon: Wallet },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Thanh điều hướng di động">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
          >
            <div className={`nav-icon-wrap ${isActive ? "active" : ""}`}>
              <Icon size={20} />
            </div>
            <span>{item.label}</span>
            {isActive && <span className="active-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
