"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/sachplus/logo";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
  X,
  Building,
  Package,
  CreditCard,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  getCurrentUser,
  logoutUser,
  type UserProfile,
  ROLE_DETAILS,
} from "@/lib/sachplus-auth";
import { toast } from "sonner";

const nav = [
  ["Dịch vụ", "/dich-vu"],
  ["Mô hình 2 tầng", "/mo-hinh-2-tang"],
  ["Sạch+ Café", "/cafe"],
  ["Đặt lịch", "/dat-lich"],
  ["Cẩm nang", "/cam-nang"],
];

export function SiteHeader({ active }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPath, setCurrentPath] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathnameHook = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
    setCurrentPath(window.location.pathname);

    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile | null>;
      setUser(customEvent.detail !== undefined ? customEvent.detail : getCurrentUser());
    };

    window.addEventListener("sachplus:auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("sachplus:auth-changed", handleAuthChange);
    };
  }, []);

  const isNavActive = (href: string, label: string) => {
    if (active && active === label) return true;
    const path = pathnameHook || currentPath;
    if (!path) return false;
    if (href === "/" && path === "/") return true;
    if (href !== "/" && (path === href || path.startsWith(href + "/") || (href === "/dat-lich" && (path === "/book" || path.startsWith("/book/"))))) {
      return true;
    }
    return false;
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUserMenuOpen(false);
    toast.info("Đã đăng xuất tài khoản");
    window.location.href = "/dang-nhap";
  };

  return (
    <header className="site-header">
      <Logo size="md" href="/" />

      <nav aria-label="Điều hướng chính">
        {nav.map(([label, href]) => {
          const isActive = isNavActive(href, label);
          return (
            <Link
              key={label}
              href={href}
              className={`relative py-1.5 font-semibold text-sm transition-all ${
                isActive ? "active text-[#0284C7] font-bold" : "text-stone-600 hover:text-[#0284C7]"
              }`}
            >
              {label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#0284C7] rounded-full shadow-xs" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="header-portal-group">
        {/* Role-specific portal shortcut */}
        {user?.role === "staff" && (
          <a
            href="/quay/quan-ly-don"
            className="header-portal-link hidden lg:inline-flex bg-[#E0F2FE] border-[#E2E8F0] text-[#0284C7] font-bold"
            title="Vào ca trực vận hành"
          >
            <ShieldCheck size={14} className="text-[#0284C7]" /> Cổng Nhân Viên
          </a>
        )}

        {user?.role === "admin" && (
          <div className="hidden lg:inline-flex items-center gap-1.5">
            <a
              href="/admin"
              className="header-portal-link bg-[#F0F9FF] border-[#0284C7]/30 text-[#0369A1] font-bold"
              title="Quản trị hệ thống Sạch+"
            >
              <Shield size={14} className="text-[#0369A1]" /> Quản trị Admin
            </a>
            <a
              href="/admin"
              className="header-portal-link text-stone-700"
              title="Xem báo cáo doanh thu & công suất"
            >
              Doanh thu
            </a>
          </div>
        )}

        {/* User Account / Auth Section */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-stone-200 bg-white hover:bg-stone-50 transition cursor-pointer shadow-xs"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-stone-200"
              />
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1">
                  {user.name.split(" ")[0]}
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md border ${
                      ROLE_DETAILS[user.role].badgeClass
                    }`}
                  >
                    {ROLE_DETAILS[user.role].label}
                  </span>
                </p>
              </div>
              <ChevronDown size={14} className="text-stone-400" />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-stone-50 rounded-md mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{user.name}</h4>
                      <p className="text-[11px] text-stone-500 truncate">{user.email || user.phone}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                          ROLE_DETAILS[user.role].badgeClass
                        }`}
                      >
                        {ROLE_DETAILS[user.role].label}
                      </span>
                    </div>
                  </div>
                  {user.apartment && (
                    <p className="text-[11px] text-stone-600 mt-2 pt-2 border-t border-stone-200/60 flex items-center gap-1">
                      <Building size={12} className="text-stone-400 shrink-0" />
                      <span className="truncate">{user.apartment}</span>
                    </p>
                  )}
                </div>

                {/* Role Workspace Link */}
                <div className="border-t border-stone-100 pt-1 space-y-0.5">
                  {user.role === "staff" && (
                    <a
                      href="/quay/quan-ly-don"
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] rounded-md transition"
                    >
                      <ShieldCheck size={15} className="text-[#0284C7]" /> Cổng Vận Hành (/staff)
                    </a>
                  )}
                  {user.role === "admin" && (
                    <>
                      <a
                        href="/admin"
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-[#0369A1] hover:bg-[#F0F9FF] rounded-md transition"
                      >
                        <Shield size={15} className="text-[#0284C7]" /> Bảng Điều Khiển Admin (/admin)
                      </a>
                      <a
                        href="/admin"
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 rounded-md transition"
                      >
                        <Building size={15} className="text-stone-500" /> Báo Cáo Doanh Thu (/owner)
                      </a>
                    </>
                  )}
                  <a
                    href="/don-cua-toi"
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition"
                  >
                    <Package size={15} className="text-stone-400" /> Đơn hàng của tôi (/orders)
                  </a>
                  <a
                    href="/vi-va-uu-dai"
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition"
                  >
                    <CreditCard size={15} className="text-stone-400" /> Ví & Thẻ cư dân Sạch+ (/wallet)
                  </a>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#DC2626] hover:bg-red-50 rounded-md transition font-semibold cursor-pointer"
                  >
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a
              href="/dang-nhap"
              className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-[#0284C7] transition cursor-pointer"
            >
              Đăng nhập
            </a>
          </div>
        )}




        {/* Direct Link to /book Page - NO BOX/MODAL */}
        <a href="/dat-lich" className="header-cta cursor-pointer">
          Đặt lịch lấy đồ
        </a>

        <button
          className="mobile-toggle"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="mobile-menu">
          {/* User Profile in mobile menu */}
          {user ? (
            <div className="p-3 bg-stone-50 rounded-md mb-3 border border-stone-200">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                  <span
                    className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded border mt-0.5 ${
                      ROLE_DETAILS[user.role].badgeClass
                    }`}
                  >
                    {ROLE_DETAILS[user.role].label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-stone-400 hover:text-[#DC2626] rounded-lg"
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-stone-50 rounded-md mb-3 border border-stone-200 flex gap-2">
              <a
                href="/dang-nhap"
                className="flex-1 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0284C7] rounded-md text-center transition"
              >
                Đăng nhập
              </a>
              <a
                href="/dang-ky"
                className="flex-1 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-md text-center"
              >
                Đăng ký
              </a>
            </div>
          )}

          {nav.map(([label, href]) => {
            const isActive = isNavActive(href, label);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between py-2.5 px-3 rounded-md transition ${
                  isActive
                    ? "bg-[#E0F2FE] text-[#0284C7] font-bold border border-[#0284C7]/30"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                <span>{label}</span>
                <ChevronRight size={16} className={isActive ? "text-[#0284C7]" : "text-stone-400"} />
              </Link>
            );
          })}

          {/* Role-based portal links in mobile menu */}
          <div className="pt-2 mt-2 border-t border-stone-200 grid gap-2">
            {(user?.role === "staff" || user?.role === "admin") && (
              <a
                href="/quay/quan-ly-don"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-2 text-[#0284C7] font-bold text-sm"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} /> Cổng Ca Trực Nhân Viên
                </span>
                <ChevronRight size={16} />
              </a>
            )}

            {user?.role === "admin" && (
              <>
                <a
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-[#0369A1] font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Shield size={16} /> Bảng Điều Khiển Admin
                  </span>
                  <ChevronRight size={16} />
                </a>
                <a
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-stone-700 font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Building size={16} /> Báo Cáo Doanh Thu
                  </span>
                  <ChevronRight size={16} />
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
