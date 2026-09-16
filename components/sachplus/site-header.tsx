"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BookingDialog } from "@/components/sachplus/order-dialog";

const nav = [
  ["Dịch vụ giặt", "/#services"],
  ["Sạch+ Café", "/cafe"],
  ["Đơn của tôi", "/orders"],
  ["Ví & thành viên", "/wallet"],
  ["Cẩm nang", "/#guide"],
];

export function SiteHeader({ active }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="Sạch+ trang chủ"><span className="brand-mark">S+</span><span>Sạch<span>+</span></span></Link>
    <nav aria-label="Điều hướng chính">{nav.map(([label, href]) => <Link className={active === label ? "active" : ""} key={label} href={href}>{label}</Link>)}</nav>
    <BookingDialog><button className="header-cta">Đặt lịch lấy đồ</button></BookingDialog>
    <button className="mobile-toggle" aria-label={menuOpen ? "Đóng menu" : "Mở menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    {menuOpen && <div className="mobile-menu">{nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link href="/staff">Cổng nhân viên</Link><Link href="/owner">Cổng chủ cửa hàng</Link></div>}
  </header>;
}
