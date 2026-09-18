"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Coffee,
  LayoutDashboard,
  Lock,
  LogOut,
  Package,
  QrCode,
  Settings,
  Shield,
  ShieldAlert,
  Shirt,
  Users,
  WashingMachine,
  Gift,
  Bell,
  Clock,
  ExternalLink,
  ChevronRight,
  Radio,
  UserCheck,
  Menu,
  X,
} from "lucide-react";
import {
  getCurrentUser,
  logoutUser,
  loginUser,
  type UserProfile,
  ROLE_DETAILS,
} from "@/lib/sachplus-auth";
import { Logo } from "@/components/sachplus/logo";
import { getLaundryOrders } from "@/lib/sachplus-data";
import { toast } from "sonner";

function useCurrentPath() {
  const [path, setPath] = useState("/");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
}

const staffNav = [
  ["Quản lý đơn", "/quay/quan-ly-don", LayoutDashboard],
  ["Tiếp nhận tại quầy", "/quay/dat-don-tai-quay", QrCode],
  ["Dashboard", "/quay/dashboard", WashingMachine],
  ["POS Café Tầng trệt", "/cafe", Coffee],
] as const;

const ownerNav = [
  ["Tổng quan báo cáo", "/admin", LayoutDashboard],
  ["Đơn hàng nội khu", "/admin#orders", Shirt],
  ["Khách hàng & Hội viên", "/admin", Users],
  ["Cấu hình Shophouse", "/admin", Settings],
] as const;

const adminNavGroups = [
  {
    group: "TỔNG QUAN HỆ THỐNG",
    items: [
      { label: "Báo cáo & Analytics", href: "/admin", hash: "", icon: LayoutDashboard },
      { label: "Sổ cái Đơn hàng", href: "/admin#orders", hash: "orders", icon: Package },
    ],
  },
  {
    group: "QUẢN LÝ DANH MỤC",
    items: [
      { label: "Dịch vụ giặt ủi", href: "/admin#services", hash: "services", icon: Shirt },
      { label: "Menu Sạch+ Café", href: "/admin#cafe", hash: "cafe", icon: Coffee },
    ],
  },
  {
    group: "MARKETING & THIẾT BỊ",
    items: [
      { label: "Ưu đãi & Giờ Vàng", href: "/admin#vouchers", hash: "vouchers", icon: Gift },
      { label: "Máy giặt / sấy", href: "/admin#machines", hash: "machines", icon: WashingMachine },
    ],
  },
] as const;

const adminModulePills = [
  { label: "Tổng quan", hash: "", icon: LayoutDashboard },
  { label: "Sổ cái đơn", hash: "orders", icon: Package },
  { label: "Dịch vụ giặt", hash: "services", icon: Shirt },
  { label: "Sạch+ Café", hash: "cafe", icon: Coffee },
  { label: "Ưu đãi", hash: "vouchers", icon: Gift },
  { label: "Máy giặt/sấy", hash: "machines", icon: WashingMachine },
] as const;

const ROLE_LABELS = {
  staff: "NHÂN VIÊN VẬN HÀNH",
  owner: "CHỦ CỬA HÀNG",
  admin: "QUẢN TRỊ VIÊN",
} as const;

const ROLE_SUBTITLES = {
  staff: "Shophouse Sài Gòn Park",
  owner: "Shophouse Sài Gòn Park",
  admin: "Toàn quyền hệ thống",
} as const;

export function OpsShell({ role, children }: { role: "staff" | "owner" | "admin"; children: React.ReactNode }) {
  const pathname = useCurrentPath();
  const [currentHash, setCurrentHash] = useState("");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [checked, setChecked] = useState(false);
  const [nowTime, setNowTime] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash.replace("#", ""));
      const handleHash = () => setCurrentHash(window.location.hash.replace("#", ""));
      window.addEventListener("hashchange", handleHash);

      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "admin" || window.location.hash === "#demo-admin") {
        loginUser("admin@sachplus.vn", "123");
      } else if (params.get("demo") === "staff" || window.location.hash === "#demo-staff") {
        loginUser("nhanvien@sachplus.vn", "123");
      }
    }

    setUser(getCurrentUser());
    setChecked(true);

    const refreshPending = () => {
      try {
        const list = getLaundryOrders();
        const pending = list.filter((o) => o.status === "Đã đặt" || o.status === "Shipper đã lấy").length;
        setPendingCount(pending);
      } catch {}
    };
    refreshPending();

    const updateClock = () => {
      const d = new Date();
      setNowTime(
        d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);

    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfile | null>;
      setUser(customEvent.detail !== undefined ? customEvent.detail : getCurrentUser());
    };
    window.addEventListener("sachplus:auth-changed", handleAuth);
    window.addEventListener("sachplus:order-created", refreshPending);
    window.addEventListener("sachplus:order-updated", refreshPending);
    return () => {
      clearInterval(timer);
      window.removeEventListener("sachplus:auth-changed", handleAuth);
      window.removeEventListener("sachplus:order-created", refreshPending);
      window.removeEventListener("sachplus:order-updated", refreshPending);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.info("Đã đăng xuất tài khoản");
    window.location.href = "/dang-nhap";
  };

  const handleAdminNav = (targetHash: string) => {
    if (pathname === "/admin") {
      if (targetHash === "" || targetHash === "overview") {
        window.history.replaceState(null, "", "/admin");
        setCurrentHash("");
        window.dispatchEvent(
          new CustomEvent("sachplus:admin-tab-change", { detail: "overview" })
        );
      } else {
        window.location.hash = targetHash;
        setCurrentHash(targetHash);
        window.dispatchEvent(
          new CustomEvent("sachplus:admin-tab-change", { detail: targetHash })
        );
      }
    } else {
      window.location.href = targetHash ? `/admin#${targetHash}` : "/admin";
    }
    setMobileMenuOpen(false);
  };

  const isAuthorized = user
    ? role === "staff"
      ? user.role === "staff" || user.role === "admin"
      : user.role === "admin"
    : false;

  return (
    <div className="ops-shell flex flex-col lg:grid lg:grid-cols-[260px_minmax(0,1fr)] w-full min-w-0 bg-slate-900 lg:bg-[#1E293B]">
      {/* 1. MOBILE TOPBAR (Visible only on < 1024px) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            aria-label="Mở menu quản trị"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Logo size="sm" inverted={true} href="/" />
          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            {role === "admin" ? "ADMIN" : "STAFF"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </div>

          <div className="relative">
            <button
              type="button"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
              title={pendingCount > 0 ? `${pendingCount} đơn hàng chờ` : "Không có đơn hàng chờ"}
            >
              <Bell size={16} />
              {pendingCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {user && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-400"
            />
          )}
        </div>
      </div>

      {/* 2. MOBILE HORIZONTAL MODULE PILLS BAR (Visible only on < 1024px) */}
      <div className="lg:hidden sticky top-[49px] z-30 bg-[#1E293B] border-b border-slate-800 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
        {role === "admin" ? (
          adminModulePills.map((pill) => {
            const isActive =
              pill.hash === ""
                ? (currentHash === "" || currentHash === "overview") && pathname === "/admin"
                : currentHash === pill.hash;
            const Icon = pill.icon;
            return (
              <button
                key={pill.label}
                type="button"
                onClick={() => handleAdminNav(pill.hash)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#0284C7] text-white shadow-sm ring-1 ring-sky-300/40 font-extrabold"
                    : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                }`}
              >
                <Icon size={13} className={isActive ? "text-white" : "text-sky-400"} />
                <span>{pill.label}</span>
              </button>
            );
          })
        ) : (
          staffNav.map(([label, href, Icon]) => {
            const isActive = pathname === href;
            return (
              <a
                key={label}
                href={href}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-[#0284C7] text-white shadow-sm ring-1 ring-sky-300/40 font-extrabold"
                    : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                }`}
              >
                <Icon size={13} className={isActive ? "text-white" : "text-sky-400"} />
                <span>{label}</span>
              </a>
            );
          })
        )}
      </div>

      {/* 3. MOBILE SLIDE-OVER DRAWER (Visible when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] bg-[#0F172A] text-white h-full p-4 flex flex-col shadow-2xl border-r border-slate-800 z-10 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <Logo size="md" inverted={true} href="/" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile */}
            {user ? (
              <div className="mb-4 p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 block">Tài khoản</span>
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <span className="text-[10px] text-sky-400 font-bold block">{ROLE_LABELS[role]}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-400 p-1.5 hover:bg-slate-800 rounded transition"
                  title="Đăng xuất"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <a
                  href={`/dang-nhap?redirect=${encodeURIComponent(pathname)}&role=${role}`}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-bold transition text-center block shadow"
                >
                  Đăng nhập quản trị
                </a>
              </div>
            )}

            {/* Navigation in Drawer */}
            {role === "admin" ? (
              <div className="space-y-4 flex-1">
                {adminNavGroups.map((group) => (
                  <div key={group.group}>
                    <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      {group.group}
                    </span>
                    <nav className="space-y-1">
                      {group.items.map((item) => {
                        const isActive =
                          item.hash === ""
                            ? (currentHash === "" || currentHash === "overview") && pathname === "/admin"
                            : currentHash === item.hash;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleAdminNav(item.hash)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition cursor-pointer text-left ${
                              isActive
                                ? "bg-[#0284C7] text-white font-bold shadow"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <Icon size={16} className={isActive ? "text-white" : "text-sky-400"} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight size={14} className="text-white" />}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ))}
              </div>
            ) : (
              <nav className="flex-1 space-y-1">
                {staffNav.map(([label, href, Icon]) => {
                  const isActive = pathname === href;
                  return (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition ${
                        isActive
                          ? "bg-[#0284C7] text-white font-bold shadow"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-white" : "text-sky-400"} />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </nav>
            )}

            {/* Footer Drawer */}
            <div className="pt-4 mt-auto border-t border-slate-800 space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={14} className="text-sky-400" />
                  <span>Xem App Cư Dân</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Live</span>
              </a>

              <div className="px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime 0ms</span>
                </span>
                <span className="font-mono">{nowTime || "Online"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DESKTOP SIDEBAR (Visible only on >= 1024px) */}
      <aside className="ops-sidebar ops-sidebar-desktop hidden lg:flex flex-col sticky top-0 h-screen p-4 bg-[#1E293B] text-white border-r border-slate-800 shadow-xl overflow-y-auto w-[260px] shrink-0">
        {/* Brand Header */}
        <div className="px-2 py-3 border-b border-slate-700/80 mb-4 flex items-center justify-between">
          <Logo size="md" inverted={true} href="/" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            PRO ERP
          </span>
        </div>

        {/* User Profile Card */}
        {user ? (
          <div className="mb-5 p-3 bg-slate-900/95 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] text-slate-200 block font-medium">Xin chào,</span>
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] text-sky-300 font-bold block">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-200 hover:text-rose-400 p-1.5 hover:bg-slate-800 rounded transition cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <a
              href={`/dang-nhap?redirect=${encodeURIComponent(pathname)}&role=${role}`}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-bold transition text-center block shadow"
            >
              Đăng nhập quản trị
            </a>
          </div>
        )}

        {/* Navigation Section */}
        {role === "admin" ? (
          <div className="space-y-4 flex-1">
            {adminNavGroups.map((group) => (
              <div key={group.group}>
                <span className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-white block mb-1.5 drop-shadow-xs">
                  {group.group}
                </span>
                <nav className="space-y-1">
                  {group.items.map((item) => {
                    const isActive =
                      item.hash === ""
                        ? (currentHash === "" || currentHash === "overview") && pathname === "/admin"
                        : currentHash === item.hash;
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          if (pathname === "/admin") {
                            e.preventDefault();
                            handleAdminNav(item.hash);
                          }
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#0284C7] text-white shadow-md shadow-sky-950/30 font-bold"
                            : "text-white hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-white" : "text-sky-300"} />
                        <span className="text-white font-semibold">{item.label}</span>
                        {isActive && <ChevronRight size={14} className="ml-auto text-white" />}
                      </a>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        ) : (
          <nav className="flex-1 space-y-1">
            {(role === "staff" ? staffNav : ownerNav).map(([label, href, Icon], index) => {
              const isActive = index === 0 && (pathname === "/quay/quan-ly-don" || pathname === "/admin");
              return (
                <a
                  key={label}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0284C7] text-white shadow-md font-bold"
                      : "text-white hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-sky-300"} />
                  <span className="text-white font-semibold">{label}</span>
                </a>
              );
            })}
          </nav>
        )}

        {/* Sidebar Footer Controls */}
        <div className="pt-4 mt-auto border-t border-slate-700/80 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-sky-400" />
              <span>Xem App Cư Dân</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Live</span>
          </a>

          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-white">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">BroadcastChannel</span>
            </span>
            <span className="font-mono text-white font-bold">{nowTime || "Online"}</span>
          </div>
        </div>
      </aside>

      {/* 5. MAIN CONTAINER */}
      <main className="ops-main flex-1 w-full min-w-0 bg-[#F8FAFC] overflow-x-hidden">
        {/* Enterprise Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="font-bold text-[#0284C7] shrink-0">Sạch+</span>
              <span className="shrink-0">/</span>
              <span className="text-stone-800 font-bold capitalize truncate">
                {role === "admin" ? "Quản Trị Hệ Thống" : "Vận Hành Quầy & Xưởng"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đồng bộ Realtime 0ms</span>
            </div>

            {/* Shophouse Time */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-medium bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
              <Clock size={13} className="text-[#0284C7]" />
              <span>{nowTime} · Ca ngày</span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition cursor-pointer relative"
                title={pendingCount > 0 ? `${pendingCount} đơn hàng chờ xử lý` : "Không có đơn hàng chờ"}
              >
                <Bell size={18} />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Pill */}
            {user && (
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-stone-200">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-stone-300"
                />
                <span className="text-xs font-bold text-stone-800 hidden xl:inline-block">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area with Strict Permission Guard */}
        <div className="p-3 sm:p-6 lg:p-8 w-full min-w-0 max-w-full overflow-x-hidden">
        {/* Strict Permission Guard */}
        {checked && !isAuthorized ? (
          <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-md border border-stone-200 shadow-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center mx-auto">
                <Lock size={32} />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0369A1] block">
                  YÊU CẦU QUYỀN TRUY CẬP
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 mt-1">
                  Cổng {ROLE_LABELS[role]}
                </h2>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                {user ? (
                  <>
                    Tài khoản hiện tại của bạn là <b>{user.name}</b> (Vai trò:{" "}
                    <span className="font-bold text-[#0284C7]">{ROLE_DETAILS[user.role].label}</span>).
                    Bạn không có quyền truy cập vào phân hệ này.
                  </>
                ) : (
                  "Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản có thẩm quyền để tiếp tục."
                )}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const targetEmail = role === "admin" ? "admin@sachplus.vn" : "nhanvien@sachplus.vn";
                    const res = loginUser(targetEmail, "123");
                    if (res.success && res.user) {
                      setUser(res.user);
                      toast.success(`Đã đăng nhập nhanh tài khoản ${ROLE_LABELS[role]} (Demo)`);
                    }
                  }}
                  className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold rounded-md text-xs border border-sky-200 transition text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  ⚡ Đăng nhập 1-chạm: {ROLE_LABELS[role]} (Demo)
                </button>
                <a
                  href={`/login?redirect=${encodeURIComponent(pathname)}&role=${role}`}
                  className="w-full py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-xs transition shadow-sm block text-center"
                >
                  Đi tới trang Đăng nhập {ROLE_LABELS[role]} →
                </a>
                <a
                  href="/"
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-md text-xs transition block text-center"
                >
                  Quay lại trang chủ Khách hàng
                </a>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
        </div>
      </main>
    </div>
  );
}
