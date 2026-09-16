"use client";

import Link from "next/link";
import { BarChart3, ChevronLeft, Coffee, LayoutDashboard, QrCode, Settings, Shirt, Users, WashingMachine } from "lucide-react";

const staffNav = [["Vận hành", "/staff", LayoutDashboard], ["Quét QR", "/staff#scan", QrCode], ["Máy giặt & sấy", "/staff#machines", WashingMachine], ["Café POS", "/cafe", Coffee]] as const;
const ownerNav = [["Tổng quan", "/owner", LayoutDashboard], ["Đơn hàng", "/owner#orders", Shirt], ["Khách hàng", "/owner#customers", Users], ["Báo cáo", "/owner#reports", BarChart3], ["Cài đặt", "/owner#settings", Settings]] as const;

export function OpsShell({ role, children }: { role: "staff" | "owner"; children: React.ReactNode }) {
  const nav = role === "staff" ? staffNav : ownerNav;
  return <div className="ops-shell"><aside className="ops-sidebar"><Link className="brand ops-brand" href="/"><span className="brand-mark">S+</span><span>Sạch<span>+</span></span></Link><div className="ops-role"><small>CỔNG {role === "staff" ? "NHÂN VIÊN" : "CHỦ CỬA HÀNG"}</small><strong>{role === "staff" ? "Ca sáng · 07:00–15:00" : "Sạch+ Sài Gòn Park"}</strong></div><nav>{nav.map(([label,href,Icon],index)=><Link key={label} href={href} className={index===0?"active":""}><Icon />{label}</Link>)}</nav><Link href="/" className="back-customer"><ChevronLeft /> Website khách hàng</Link></aside><main className="ops-main">{children}</main></div>;
}
