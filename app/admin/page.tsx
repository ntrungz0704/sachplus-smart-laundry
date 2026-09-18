"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  Archive,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  WashingMachine,
  Coffee,
  Users,
  Gift,
  Shirt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  X,
  Save,
  Check,
  Tag,
  PackageCheck,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { OpsShell } from "@/components/sachplus/ops-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getServiceCatalog,
  saveServiceCatalog,
  toggleServiceStatus,
  getCafeMenu,
  saveCafeMenu,
  toggleCafeMenuStatus,
  getLaundryOrders,
  updateOrderStatus,
  advanceOrderStatus,
  cancelOrder,
  getNextStatus,
  getForwardStatuses,
  ORDER_FLOW_STEPS,
  getMachines,
  saveMachines,
  getVouchers,
  saveVouchers,
  formatVnd,
  getCafeOrders,
  type ServiceItem,
  type CafeMenuItem,
  type LaundryOrder,
  type MachineItem,
  type LaundryStatus,
  type VoucherItem,
  type CafeOrder,
} from "@/lib/sachplus-data";
import { getAllUsers, type UserProfile } from "@/lib/sachplus-auth";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setMounted(true);
    const syncTab = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        const cleanHash = window.location.hash.replace("#", "");
        if (tabParam) {
          setActiveTab(tabParam);
        } else if (cleanHash) {
          setActiveTab(cleanHash);
        } else {
          setActiveTab("overview");
        }
      }
    };
    syncTab();
    window.addEventListener("hashchange", syncTab);
    const handleAdminTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("sachplus:admin-tab-change", handleAdminTab);
    return () => {
      window.removeEventListener("hashchange", syncTab);
      window.removeEventListener("sachplus:admin-tab-change", handleAdminTab);
    };
  }, []);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (typeof window !== "undefined") {
      if (val === "overview") {
        window.history.replaceState(null, "", "/admin");
      } else {
        window.history.replaceState(null, "", `/admin#${val}`);
      }
    }
  };

  return (
    <OpsShell role="admin">
      {/* Top Header Information Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
              Hệ Thống Shophouse SH-08
            </span>
            <span className="text-xs text-stone-600">· Vinhomes Sài Gòn Park</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900">
            Bảng Điều Khiển Quản Trị Doanh Nghiệp
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Giám sát vận hành 2 tầng: Tầng trệt Sạch+ Café & Lầu 1 Giặt ủi tiệt trùng thông minh
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("sachplus:order-updated"));
              toast.success("Đã đồng bộ lại dữ liệu thời gian thực!");
            }}
            className="px-3 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw size={13} className="text-[#0284C7]" />
            Làm mới
          </button>
          <button
            type="button"
            onClick={() => toast.info("Đã xuất báo cáo ca trực định dạng Excel (.xlsx)")}
            className="px-3 py-2 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Main Tabs Container (Sidebar Driven - No Redundant Top Horizontal Bar) */}
      {mounted ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">

          {/* TAB 1: BÁO CÁO & TỔNG QUAN (OVERVIEW - GENTELELLA STYLE) */}
          <TabsContent value="overview">
            <OverviewTab onNavigateTab={handleTabChange} />
          </TabsContent>

          {/* TAB 2: DỊCH VỤ GIẶT ỦI (SOFT-DELETE / ZERO HARD DELETE) */}
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          {/* TAB 3: MENU SẠCH+ CAFÉ (SOFT-DELETE) */}
          <TabsContent value="cafe">
            <CafeTab />
          </TabsContent>

          {/* TAB 4: SỔ CÁI ĐƠN HÀNG (IMMUTABLE ORDER LEDGER) */}
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          {/* TAB 5: ƯU ĐÃI & VOUCHER GIỜ VÀNG */}
          <TabsContent value="vouchers">
            <VouchersTab />
          </TabsContent>

          {/* TAB 6: MÁY GIẶT / SẤY */}
          <TabsContent value="machines">
            <MachinesTab />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center py-24 text-stone-400">
          Đang tải giao diện Quản trị Enterprise...
        </div>
      )}
    </OpsShell>
  );
}

// ============================================================================
// 1. OVERVIEW TAB (GENTELELLA ENTERPRISE DASHBOARD: DYNAMIC & RESPONSIVE)
// ============================================================================
function OverviewTab({ onNavigateTab }: { onNavigateTab: (tab: string) => void }) {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [cafeOrders, setCafeOrders] = useState<CafeOrder[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const refresh = () => {
      setOrders(getLaundryOrders());
      setCafeOrders(getCafeOrders());
      setMachines(getMachines());
      setVouchers(getVouchers());
      setUsers(getAllUsers());
    };
    refresh();

    const handleComplaint = () => {
      toast.info('📩 Khiếu nại mới từ khách hàng!');
      refresh();
    };

    window.addEventListener("sachplus:order-created", refresh);
    window.addEventListener("sachplus:order-updated", refresh);
    window.addEventListener("sachplus:cafe-order-created", refresh);
    window.addEventListener("sachplus:machines-updated", refresh);
    window.addEventListener("sachplus:vouchers-updated", refresh);
    window.addEventListener("sachplus:auth-changed", refresh);
    window.addEventListener("sachplus:complaint-submitted", handleComplaint);
    return () => {
      window.removeEventListener("sachplus:order-created", refresh);
      window.removeEventListener("sachplus:order-updated", refresh);
      window.removeEventListener("sachplus:cafe-order-created", refresh);
      window.removeEventListener("sachplus:machines-updated", refresh);
      window.removeEventListener("sachplus:vouchers-updated", refresh);
      window.removeEventListener("sachplus:auth-changed", refresh);
      window.removeEventListener("sachplus:complaint-submitted", handleComplaint);
    };
  }, []);

  // REAL DATA COMPUTATIONS - ZERO HARDCODED NUMBERS
  const laundryRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Hủy đơn")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const cafeRevenue = useMemo(() => {
    return cafeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [cafeOrders]);

  const totalRevenue = useMemo(() => {
    return laundryRevenue + cafeRevenue;
  }, [laundryRevenue, cafeRevenue]);

  const totalOrdersCount = useMemo(() => {
    return orders.length;
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "Hoàn tất").length;
  }, [orders]);

  const activeMachines = useMemo(() => {
    return machines.filter((m) => m.status === "Đang giặt" || m.status === "Đang sấy").length;
  }, [machines]);

  const machineRate = useMemo(() => {
    if (machines.length === 0) return 0;
    return Math.round((activeMachines / machines.length) * 100);
  }, [machines, activeMachines]);

  const uniqueResidentsCount = useMemo(() => {
    const phones = new Set<string>();
    orders.forEach((o) => {
      if (o.customerPhone) phones.add(o.customerPhone.trim());
    });
    users
      .filter((u) => u.role === "customer")
      .forEach((u) => {
        if (u.phone) phones.add(u.phone.trim());
      });
    return Math.max(phones.size, 1);
  }, [orders, users]);

  const activeVouchersCount = useMemo(() => {
    return vouchers.filter((v) => v.isActive).length;
  }, [vouchers]);

  const totalVoucherUsed = useMemo(() => {
    return vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0);
  }, [vouchers]);

  // Dynamic Service Distribution from Real Orders
  const serviceStats = useMemo(() => {
    const counts: Record<string, number> = {
      "Giặt & sấy": 0,
      "Giặt hấp": 0,
      "Chăn ga": 0,
      "Giày & túi": 0,
    };
    orders.forEach((o) => {
      if (counts[o.service] !== undefined) {
        counts[o.service]++;
      } else {
        counts[o.service] = 1;
      }
    });

    const meta: Record<string, { label: string; color: string; textColor: string }> = {
      "Giặt & sấy": { label: "Giặt & sấy tiêu chuẩn", color: "bg-[#0284C7]", textColor: "text-[#0284C7]" },
      "Giặt hấp": { label: "Giặt hấp Vest & Lụa", color: "bg-emerald-500", textColor: "text-emerald-600" },
      "Chăn ga": { label: "Khử khuẩn Chăn ga Ozone", color: "bg-amber-500", textColor: "text-amber-600" },
      "Giày & túi": { label: "Spa Giày & Túi Da", color: "bg-indigo-500", textColor: "text-indigo-600" },
    };

    return Object.entries(counts)
      .map(([serviceName, count]) => {
        const itemMeta = meta[serviceName] || {
          label: serviceName,
          color: "bg-sky-500",
          textColor: "text-sky-600",
        };
        const percentage = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
        return {
          serviceName,
          label: itemMeta.label,
          count,
          percentage,
          color: itemMeta.color,
          textColor: itemMeta.textColor,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [orders]);

  // Top Cafe item from real orders
  const topCafeItem = useMemo(() => {
    const itemMap: Record<string, number> = {};
    cafeOrders.forEach((co) => {
      co.items?.forEach((item) => {
        itemMap[item.name] = (itemMap[item.name] || 0) + (item.quantity || 1);
      });
    });
    const sorted = Object.entries(itemMap).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      return { name: sorted[0][0], count: sorted[0][1] };
    }
    return { name: "Bạc Xỉu Sạch+", count: 0 };
  }, [cafeOrders]);

  // Dynamic 7-Day Chart Data from real orders
  const chartDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      const formattedDate = `${String(dayNum).padStart(2, "0")}/${String(monthNum).padStart(2, "0")}`;
      const isToday = i === 0;
      const label = isToday ? `Hôm nay (${formattedDate})` : `${dayNames[d.getDay()]} (${formattedDate})`;

      const dayOrders = orders.filter((o) => {
        if (o.pickupDate?.includes(formattedDate)) return true;
        if (o.createdAt) {
          const od = new Date(o.createdAt);
          return od.getDate() === dayNum && od.getMonth() + 1 === monthNum;
        }
        return false;
      });

      const dayCafe = cafeOrders.filter((co) => {
        if (co.createdAt) {
          const cd = new Date(co.createdAt);
          return cd.getDate() === dayNum && cd.getMonth() + 1 === monthNum;
        }
        return false;
      });

      const lRev = dayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
      const cRev = dayCafe.reduce((acc, co) => acc + (co.total || 0), 0);

      days.push({
        label,
        formattedDate,
        isToday,
        laundryOrdersCount: dayOrders.length,
        laundryRev: lRev,
        cafeOrdersCount: dayCafe.length,
        cafeRev: cRev,
      });
    }
    return days;
  }, [orders, cafeOrders]);

  // Scaled coordinates for SVG Wave chart
  const xs = [20, 130, 240, 350, 460, 570, 680];
  const maxVal = Math.max(
    ...chartDays.map((d) => Math.max(d.laundryRev, d.cafeRev)),
    100000
  );

  const getLaundryY = (rev: number) => {
    if (rev <= 0) return 195;
    return Math.max(30, 195 - Math.round((rev / maxVal) * 155));
  };

  const getCafeY = (rev: number) => {
    if (rev <= 0) return 200;
    return Math.max(45, 200 - Math.round((rev / maxVal) * 145));
  };

  const laundryPoints = chartDays.map((d, i) => ({ x: xs[i], y: getLaundryY(d.laundryRev), day: d }));
  const cafePoints = chartDays.map((d, i) => ({ x: xs[i], y: getCafeY(d.cafeRev), day: d }));

  const laundryPathD = `M ${laundryPoints[0].x} ${laundryPoints[0].y} ` +
    laundryPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  const laundryAreaD = `${laundryPathD} L ${laundryPoints[laundryPoints.length - 1].x} 210 L ${laundryPoints[0].x} 210 Z`;

  const cafePathD = `M ${cafePoints[0].x} ${cafePoints[0].y} ` +
    cafePoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
  const cafeAreaD = `${cafePathD} L ${cafePoints[cafePoints.length - 1].x} 210 L ${cafePoints[0].x} 210 Z`;

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* 6 TOP KPI METRIC CARDS — Responsive 2-cols / 3-cols / 6-cols, ZERO overflow */}
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4 w-full min-w-0">
        {/* Metric 1 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Doanh thu hệ thống
              </span>
              <DollarSign size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate" title={formatVnd(totalRevenue)}>
              {formatVnd(totalRevenue)}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 truncate">
            <TrendingUp size={12} className="shrink-0" />
            <span className="truncate">{totalOrdersCount} đơn giặt + {cafeOrders.length} café</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Đơn giặt tiếp nhận
              </span>
              <Package size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate">
              {totalOrdersCount} đơn
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-sky-600 truncate">
            <CheckCircle2 size={12} className="shrink-0" />
            <span className="truncate">{completedOrdersCount} đơn đã hoàn tất</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Tải máy giặt/sấy
              </span>
              <WashingMachine size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate">
              {machineRate}%
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-sky-600 truncate">
            <span>{activeMachines} / {machines.length} máy đang chạy</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Café Tầng trệt
              </span>
              <Coffee size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate" title={formatVnd(cafeRevenue)}>
              {formatVnd(cafeRevenue)}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 truncate">
            <TrendingUp size={12} className="shrink-0" />
            <span className="truncate">{cafeOrders.length} hóa đơn đã tạo</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Cư dân phục vụ
              </span>
              <Users size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate">
              {uniqueResidentsCount} cư dân
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-stone-500 truncate">
            <span>{users.filter((u) => u.role === "customer").length} hội viên cư dân</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1.5 gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 truncate">
                Chiến dịch Voucher
              </span>
              <Gift size={14} className="text-[#0284C7] shrink-0" />
            </div>
            <p className="text-base sm:text-lg xl:text-xl font-extrabold text-stone-900 tracking-tight truncate">
              {activeVouchersCount} đang chạy
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 truncate">
            <span>{totalVoucherUsed} lượt đã áp dụng</span>
          </div>
        </div>
      </div>

      {/* ANALYTICS SECTION: DUAL-LAYERED AREA WAVE CHART + TOP PERFORMANCE BARS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-w-0">
        {/* Left 2 Cols: Network Activities Chart (Dynamic 7-day points) */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                <h2 className="text-base font-bold text-stone-900">
                  Hoạt Động Doanh Thu & Tiếp Nhận (Network Activities)
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Biểu đồ đối chiếu 7 ngày: Dịch vụ Giặt ủi Lầu 1 vs Thực đơn Sạch+ Café Tầng trệt
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="w-3 h-3 rounded bg-sky-500 inline-block" />
                <span>Giặt ủi</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span>Sạch+ Café</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Dual Wave Chart */}
          <div className="w-full h-64 relative min-w-0">
            <svg
              viewBox="0 0 700 240"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="195" x2="700" y2="195" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Emerald Area (Café) */}
              <path d={cafeAreaD} fill="url(#emeraldGrad)" />
              <path d={cafePathD} fill="none" stroke="#10B981" strokeWidth="2.5" />

              {/* Sky Area (Laundry) */}
              <path d={laundryAreaD} fill="url(#skyGrad)" />
              <path d={laundryPathD} fill="none" stroke="#0284C7" strokeWidth="3" />

              {/* Dynamic Markers & Dots */}
              {laundryPoints.map((pt, i) => (
                <g key={`l-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                  />
                  <title>{`${pt.day.label}: Giặt ủi ${formatVnd(pt.day.laundryRev)} (${pt.day.laundryOrdersCount} đơn)`}</title>
                </g>
              ))}

              {cafePoints.map((pt, i) => (
                <g key={`c-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <title>{`${pt.day.label}: Café ${formatVnd(pt.day.cafeRev)} (${pt.day.cafeOrdersCount} ly)`}</title>
                </g>
              ))}
            </svg>

            {/* X-Axis Labels dynamically computed from today */}
            <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-stone-600 pt-3">
              {chartDays.map((d, i) => (
                <span
                  key={i}
                  className={d.isToday ? "text-[#0284C7] font-bold" : ""}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Top Performance Progress Bars (Dynamic from orders) */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs min-w-0 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Top Dịch Vụ Tiếp Nhận</h3>
                <p className="text-[11px] text-stone-500">Tỷ lệ theo số đơn thực tế</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                {totalOrdersCount} đơn tổng
              </span>
            </div>

            <div className="space-y-4">
              {serviceStats.map((item) => (
                <div key={item.serviceName}>
                  <div className="flex justify-between text-xs font-bold text-stone-800 mb-1">
                    <span className="truncate mr-2">{item.label}</span>
                    <span className={`${item.textColor} shrink-0`}>
                      {item.percentage}% ({item.count} đơn)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-stone-100 bg-sky-50/60 p-3 rounded-lg flex items-center justify-between gap-2">
            <div className="text-xs min-w-0">
              <strong className="text-[#0284C7] block font-bold truncate">Món Café Được Đặt Nhiều:</strong>
              <span className="text-stone-600 truncate block">
                {topCafeItem.name} {topCafeItem.count > 0 ? `· ${topCafeItem.count} ly đã bán` : "· Sẵn sàng phục vụ"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("cafe")}
              className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer shrink-0"
            >
              Xem menu →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. SERVICES TAB (PROFESSIONAL SOFT-DELETE: THÊM — SỬA — TẠM ẨN / KÍCH HOẠT LẠI)
// ============================================================================
function ServicesTab() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setServices(getServiceCatalog());
    const handleUpdate = () => setServices(getServiceCatalog());
    window.addEventListener("sachplus:service-updated", handleUpdate);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("open") === "add") {
        handleOpenAdd();
      }
    }
    return () => window.removeEventListener("sachplus:service-updated", handleUpdate);
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? s.status !== "archived"
          : s.status === "archived";
      const matchSearch =
        searchQuery.trim() === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.detail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [services, statusFilter, searchQuery]);

  const activeCount = services.filter((s) => s.status !== "archived").length;
  const archivedCount = services.filter((s) => s.status === "archived").length;

  const handleToggleStatus = (service: ServiceItem) => {
    const isCurrentlyArchived = service.status === "archived";
    const updated = toggleServiceStatus(service.id);
    setServices(updated);

    if (isCurrentlyArchived) {
      toast.success(`Đã kích hoạt mở bán lại gói: "${service.name}" trên app cư dân!`);
    } else {
      toast.info(
        `Đã tạm ẩn gói: "${service.name}". Gói này sẽ không nhận đặt mới, nhưng toàn bộ đơn hàng cũ trong quá khứ vẫn được bảo toàn nguyên vẹn!`
      );
    }
  };

  const handleOpenAdd = () => {
    setEditingItem({
      id: `svc-${Date.now()}`,
      name: "Giặt & sấy",
      price: 79000,
      unit: "3kg",
      duration: "Chu trình 2h · Giao chuẩn 24h",
      detail: "Mô tả quy trình giặt tiệt trùng công nghệ cao mới.",
      highlight: "Mới ra mắt",
      status: "active",
      category: "Dịch vụ mới",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (s: ServiceItem) => {
    setEditingItem({ ...s });
    setIsDialogOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const exists = services.some((s) => s.id === editingItem.id);
    let updated: ServiceItem[];
    if (exists) {
      updated = services.map((s) => (s.id === editingItem.id ? editingItem : s));
      toast.success(`Đã cập nhật dịch vụ: "${editingItem.name}"`);
    } else {
      updated = [...services, editingItem];
      toast.success(`Đã thêm dịch vụ mới: "${editingItem.name}"`);
    }
    setServices(updated);
    saveServiceCatalog(updated);
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-2xs space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">Quản Lý Danh Mục Dịch Vụ Giặt Ủi</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
              Triết lý Soft-Delete Bất Biến
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Không xóa cứng dữ liệu: Chỉ Thêm, Sửa hoặc Tạm Ẩn khi ngừng kinh doanh để luôn bảo đảm quyền lợi đối soát và bảo hành cho khách hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus size={15} /> Thêm dịch vụ mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-[#0284C7] shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Tất cả ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "active"
                ? "bg-white text-emerald-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đang kinh doanh ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("archived")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "archived"
                ? "bg-white text-stone-800 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Archive size={12} />
            Đã tạm ẩn ({archivedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
          />
        </div>
      </div>

      {/* Services Table — Zero Horizontal Scrollbar */}
      <div className="w-full border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Dịch Vụ & Mô Tả Quy Trình</th>
              <th className="py-3.5 px-3">Đơn Giá & Định Lượng</th>
              <th className="py-3.5 px-3">Thời Gian & Nhãn Nổi Bật</th>
              <th className="py-3.5 px-3">Trạng Thái</th>
              <th className="py-3.5 px-4 text-right">Thao Tác Quản Trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-stone-400">
                  Không tìm thấy dịch vụ phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredServices.map((svc) => {
                const isArchived = svc.status === "archived";
                return (
                  <tr
                    key={svc.id}
                    className={`hover:bg-sky-50/40 transition ${
                      isArchived ? "bg-stone-50/40 opacity-75" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900 text-sm">{svc.name}</div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 max-w-sm">
                        {svc.detail}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-[#0284C7] text-sm block">
                        {formatVnd(svc.price)}
                      </span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">
                        Định lượng: <b>{svc.unit}</b>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-stone-700 font-medium text-xs">{svc.duration}</div>
                      <div className="mt-1">
                        {svc.highlight ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {svc.highlight}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">Tiêu chuẩn</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {!isArchived ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Đang kinh doanh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                          <Archive size={11} />
                          Tạm ẩn / Đã lưu kho
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(svc)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded flex items-center gap-1 transition cursor-pointer"
                          title="Chỉnh sửa dịch vụ"
                        >
                          <Pencil size={12} className="text-[#0284C7]" />
                          <span>Sửa</span>
                        </button>

                        {/* Soft Delete / Toggle Status Button (NEVER HARD DELETE) */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(svc)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition cursor-pointer ${
                            !isArchived
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                          title={isArchived ? "Mở bán lại gói này" : "Tạm ẩn gói khỏi app cư dân"}
                        >
                          {!isArchived ? (
                            <>
                              <EyeOff size={12} />
                              <span>Tạm ẩn</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw size={12} />
                              <span>Kích hoạt lại</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Service Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem && services.some((s) => s.id === editingItem.id)
                ? `Chỉnh Sửa Dịch Vụ: ${editingItem.name}`
                : "Thêm Dịch Vụ Giặt Ủi Mới"}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Cập nhật đơn giá, thời gian xử lý và trạng thái kinh doanh của gói dịch vụ.
            </DialogDescription>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Tên Dịch Vụ</label>
                  <select
                    value={
                      [
                        "Giặt & sấy",
                        "Giặt hấp",
                        "Chăn ga",
                        "Giày & túi",
                        "Ủi hơi chuyên sâu",
                        "Tẩy ố sinh học",
                      ].includes(editingItem.name)
                        ? editingItem.name
                        : "custom"
                    }
                    onChange={(e) => {
                      if (e.target.value !== "custom") {
                        setEditingItem({ ...editingItem, name: e.target.value as any });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                  >
                    <option value="Giặt & sấy">Giặt & sấy (Tiêu chuẩn)</option>
                    <option value="Giặt hấp">Giặt hấp (Chăm sóc cao cấp)</option>
                    <option value="Chăn ga">Chăn ga (Khử khuẩn Ozone)</option>
                    <option value="Giày & túi">Giày & túi (Spa da thủ công)</option>
                    <option value="Ủi hơi chuyên sâu">Ủi hơi chuyên sâu</option>
                    <option value="Tẩy ố sinh học">Tẩy ố sinh học</option>
                    <option value="custom">Tên tùy chỉnh khác...</option>
                  </select>
                  {![
                    "Giặt & sấy",
                    "Giặt hấp",
                    "Chăn ga",
                    "Giày & túi",
                    "Ủi hơi chuyên sâu",
                    "Tẩy ố sinh học",
                  ].includes(editingItem.name) && (
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value as any })}
                      placeholder="Nhập tên dịch vụ"
                      required
                      className="mt-1.5 w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Đơn Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    required
                    min={1000}
                    step={1000}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none font-bold text-[#0284C7]"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[69000, 89000, 129000, 149000].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, price: p })}
                        className="text-[10px] px-1.5 py-0.5 bg-stone-100 hover:bg-sky-50 hover:text-[#0284C7] rounded border border-stone-200 transition cursor-pointer"
                      >
                        {formatVnd(p)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Định Lượng (Đơn vị)</label>
                  <select
                    value={editingItem.unit}
                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                  >
                    <option value="3kg">3kg (Túi tiêu chuẩn)</option>
                    <option value="5kg">5kg (Túi gia đình)</option>
                    <option value="8kg">8kg (Túi lớn)</option>
                    <option value="món">món (Áo vest, đầm lụa, áo dài)</option>
                    <option value="bộ">bộ (Bộ chăn ga drap King/Queen)</option>
                    <option value="đôi">đôi (Giày sneaker, giày da cao cấp)</option>
                    <option value="chiếc">chiếc (Túi xách, vali, gối ôm)</option>
                    <option value="kg">kg (Tính theo kg thực tế)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Nhãn Nổi Bật (Badge)</label>
                  <select
                    value={editingItem.highlight || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, highlight: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                  >
                    <option value="Bán chạy nhất">⭐ Bán chạy nhất</option>
                    <option value="Chăm sóc nâng niu">✨ Chăm sóc nâng niu</option>
                    <option value="Khử khuẩn 99.9%">🛡️ Khử khuẩn 99.9%</option>
                    <option value="Chuyên sâu thủ công">👞 Chuyên sâu thủ công</option>
                    <option value="Mới ra mắt">🔥 Mới ra mắt</option>
                    <option value="Ưu đãi hot">🎁 Ưu đãi hot</option>
                    <option value="Tiết kiệm nhất">💰 Tiết kiệm nhất</option>
                    <option value="Khuyên dùng">👍 Khuyên dùng</option>
                    <option value="">(Không gắn nhãn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Thời Gian Chu Trình & Giao Hàng</label>
                <select
                  value={editingItem.duration}
                  onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                >
                  <option value="Chu trình 2h · Giao chuẩn 24h">⚡ Chu trình 2h · Giao chuẩn 24h (Giặt sấy thông thường)</option>
                  <option value="Xử lý 4-6h · Giao chuẩn 24h">🧥 Xử lý 4-6h · Giao chuẩn 24h (Giặt hấp sinh học)</option>
                  <option value="Khử khuẩn 3-4h · Giao chuẩn 24h">🛏️ Khử khuẩn 3-4h · Giao chuẩn 24h (Chăn ga Ozone)</option>
                  <option value="Spa sâu 12-24h · Giao chuẩn 48h">👟 Spa sâu 12-24h · Giao chuẩn 48h (Giày túi thủ công)</option>
                  <option value="Hỏa tốc 1h · Giao ngay trong ngày">🚀 Hỏa tốc 1h · Giao ngay trong ngày (Cấp tốc)</option>
                  <option value="Chu trình 24h · Giao chuẩn 48h">📦 Chu trình 24h · Giao chuẩn 48h (Rèm & Thảm)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Mô Tả Quy Trình Xử Lý</label>
                <textarea
                  value={editingItem.detail}
                  onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })}
                  rows={3}
                  required
                  placeholder="Mô tả quy trình xử lý, máy móc tiệt trùng và công nghệ ứng dụng..."
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.status !== "archived"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.checked ? "active" : "archived",
                      })
                    }
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                  <span>Đang mở bán trên App Cư Dân</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-md flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Save size={14} /> Lưu dịch vụ
                  </button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// 3. CAFE TAB (SOFT-DELETE: THÊM — SỬA — TẠM NGƯNG / BÁN LẠI)
// ============================================================================
function CafeTab() {
  const [menu, setMenu] = useState<CafeMenuItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<CafeMenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setMenu(getCafeMenu());
    const handleUpdate = () => setMenu(getCafeMenu());
    window.addEventListener("sachplus:menu-updated", handleUpdate);
    return () => window.removeEventListener("sachplus:menu-updated", handleUpdate);
  }, []);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? item.status !== "archived"
          : item.status === "archived";
      const matchSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [menu, statusFilter, searchQuery]);

  const activeCount = menu.filter((c) => c.status !== "archived").length;
  const archivedCount = menu.filter((c) => c.status === "archived").length;

  const handleToggleStatus = (item: CafeMenuItem) => {
    const isCurrentlyArchived = item.status === "archived";
    const updated = toggleCafeMenuStatus(item.id);
    setMenu(updated);

    if (isCurrentlyArchived) {
      toast.success(`Đã mở bán lại món: "${item.name}" tại Sạch+ Café!`);
    } else {
      toast.info(`Đã tạm ẩn món: "${item.name}" khỏi thực đơn hôm nay.`);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem({
      id: `cafe-${Date.now()}`,
      category: "Cà phê",
      name: "Cold Brew Cam Vàng",
      note: "Ủ lạnh 16h · Hương vị trái cây thanh mát",
      price: 45000,
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&q=80",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: CafeMenuItem) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const exists = menu.some((c) => c.id === editingItem.id);
    let updated: CafeMenuItem[];
    if (exists) {
      updated = menu.map((c) => (c.id === editingItem.id ? editingItem : c));
      toast.success(`Đã cập nhật món: "${editingItem.name}"`);
    } else {
      updated = [...menu, editingItem];
      toast.success(`Đã thêm món mới: "${editingItem.name}"`);
    }
    setMenu(updated);
    saveCafeMenu(updated);
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-2xs space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">Quản Lý Menu Sạch+ Café Tầng Trệt</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              F&B Management
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Quản lý thức uống, bánh ngọt phục vụ cư dân thưởng thức trong lúc chờ đồ giặt sấy.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus size={15} /> Thêm món mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-[#0284C7] shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Tất cả ({menu.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "active"
                ? "bg-white text-emerald-700 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Đang phục vụ ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("archived")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "archived"
                ? "bg-white text-stone-800 shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Archive size={12} />
            Tạm ngưng ({archivedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món theo tên hoặc loại..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
          />
        </div>
      </div>

      {/* Menu Table — Zero Horizontal Scrollbar */}
      <div className="w-full border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Món Ăn & Thức Uống</th>
              <th className="py-3.5 px-3">Danh Mục</th>
              <th className="py-3.5 px-3">Đơn Giá</th>
              <th className="py-3.5 px-3">Ghi Chú Hương Vị</th>
              <th className="py-3.5 px-4 text-right">Trạng Thái & Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredMenu.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-stone-400">
                  Không tìm thấy món ăn phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredMenu.map((item) => {
                const isArchived = item.status === "archived";
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-sky-50/40 transition ${
                      isArchived ? "bg-stone-50/40 opacity-75" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{item.name}</div>
                          <div className="text-[10px] text-stone-400 font-mono">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-[#0284C7] text-sm">
                        {formatVnd(item.price)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-stone-600 text-xs line-clamp-1 max-w-xs">{item.note}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isArchived ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Đang phục vụ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                            <Archive size={11} />
                            Tạm ngưng
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded flex items-center gap-1 transition cursor-pointer"
                        >
                          <Pencil size={12} className="text-[#0284C7]" />
                          <span>Sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition cursor-pointer ${
                            !isArchived
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          {!isArchived ? (
                            <>
                              <EyeOff size={12} />
                              <span>Tạm ngưng</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw size={12} />
                              <span>Bán lại</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Cafe Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingItem && menu.some((c) => c.id === editingItem.id)
                ? `Sửa Món: ${editingItem.name}`
                : "Thêm Món Café Mới"}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleSaveItem} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Tên Món</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                  placeholder="Nhập tên món hoặc thức uống"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Danh Mục</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                  >
                    <option value="Cà phê">☕ Cà phê</option>
                    <option value="Trà">🍵 Trà thanh nhiệt</option>
                    <option value="Trái cây">🍊 Trái cây tươi</option>
                    <option value="Bánh">🥐 Bánh ngọt / Mặn</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Đơn Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    required
                    min={5000}
                    step={1000}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none font-bold text-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Ghi Chú Thành Phần / Hương Vị</label>
                <select
                  value={
                    [
                      "Đậm vừa · Hạt Arabica Cầu Đất",
                      "Cà phê sữa dịu · Thơm ngậy",
                      "Êm mượt · Sữa tươi thanh trùng",
                      "Bột trà Uji Kyoto · Ít ngọt",
                      "Thanh mát · Đào giòn sần sật",
                      "Hạt sen bùi · Lớp foam mặn dịu",
                      "Cam sành nguyên chất 100%",
                      "Bơ tươi Đắk Lắk · Sánh béo",
                      "Vỏ ngàn lớp giòn rụm thơm bơ",
                      "Nóng giòn · Đủ dinh dưỡng bữa sáng",
                    ].includes(editingItem.note)
                      ? editingItem.note
                      : "custom"
                  }
                  onChange={(e) => {
                    if (e.target.value !== "custom") {
                      setEditingItem({ ...editingItem, note: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                >
                  <option value="Đậm vừa · Hạt Arabica Cầu Đất">☕ Đậm vừa · Hạt Arabica Cầu Đất</option>
                  <option value="Cà phê sữa dịu · Thơm ngậy">🥛 Cà phê sữa dịu · Thơm ngậy</option>
                  <option value="Êm mượt · Sữa tươi thanh trùng">🥛 Êm mượt · Sữa tươi thanh trùng</option>
                  <option value="Bột trà Uji Kyoto · Ít ngọt">🍵 Bột trà Uji Kyoto · Ít ngọt</option>
                  <option value="Thanh mát · Đào giòn sần sật">🍑 Thanh mát · Đào giòn sần sật</option>
                  <option value="Hạt sen bùi · Lớp foam mặn dịu">🪷 Hạt sen bùi · Lớp foam mặn dịu</option>
                  <option value="Cam sành nguyên chất 100%">🍊 Cam sành nguyên chất 100%</option>
                  <option value="Bơ tươi Đắk Lắk · Sánh béo">🥑 Bơ tươi Đắk Lắk · Sánh béo</option>
                  <option value="Vỏ ngàn lớp giòn rụm thơm bơ">🥐 Vỏ ngàn lớp giòn rụm thơm bơ</option>
                  <option value="Nóng giòn · Đủ dinh dưỡng bữa sáng">🥪 Nóng giòn · Đủ dinh dưỡng bữa sáng</option>
                  <option value="custom">Ghi chú hương vị khác...</option>
                </select>
                {![
                  "Đậm vừa · Hạt Arabica Cầu Đất",
                  "Cà phê sữa dịu · Thơm ngậy",
                  "Êm mượt · Sữa tươi thanh trùng",
                  "Bột trà Uji Kyoto · Ít ngọt",
                  "Thanh mát · Đào giòn sần sật",
                  "Hạt sen bùi · Lớp foam mặn dịu",
                  "Cam sành nguyên chất 100%",
                  "Bơ tươi Đắk Lắk · Sánh béo",
                  "Vỏ ngàn lớp giòn rụm thơm bơ",
                  "Nóng giòn · Đủ dinh dưỡng bữa sáng",
                ].includes(editingItem.note) && (
                  <input
                    type="text"
                    value={editingItem.note}
                    onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                    placeholder="VD: Hạt Arabica Cầu Đất · Êm mượt thơm ngậy"
                    required
                    className="mt-1.5 w-full px-3 py-1.5 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Link Hình Ảnh (URL)</label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.status !== "archived"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.checked ? "active" : "archived",
                      })
                    }
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                  <span>Đang phục vụ hôm nay</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-md flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Save size={14} /> Lưu món
                  </button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// 4. ORDERS TAB (SỔ CÁI ĐƠN HÀNG BẤT BIẾN — TIẾN TRÌNH 1 CHIỀU: CHỈ TIẾN KHÔNG LÙI)
// ============================================================================
function OrdersTab() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState<LaundryOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("Khách hàng đổi ý / không có nhà");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    setOrders(getLaundryOrders());
    const handleUpdate = () => setOrders(getLaundryOrders());
    window.addEventListener("sachplus:order-created", handleUpdate);
    window.addEventListener("sachplus:order-updated", handleUpdate);
    return () => {
      window.removeEventListener("sachplus:order-created", handleUpdate);
      window.removeEventListener("sachplus:order-updated", handleUpdate);
    };
  }, []);

  const handleAdvance = (orderId: string, nextStatus: LaundryStatus) => {
    const res = advanceOrderStatus(orderId, nextStatus);
    if (res.success) {
      setOrders(getLaundryOrders());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleConfirmCancel = () => {
    if (!cancellingOrder) return;
    const res = cancelOrder(cancellingOrder.id, cancelReason, "admin");
    if (res.success) {
      setOrders(getLaundryOrders());
      toast.warning(res.message);
      setIsCancelDialogOpen(false);
      setCancellingOrder(null);
    } else {
      toast.error(res.message);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" ? true : o.status === statusFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerPhone && o.customerPhone.includes(searchQuery)) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-2xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">Sổ Cái Đơn Hàng Cư Dân & Đối Soát</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Quy trình giặt sấy vận hành một chiều (Forward-Only). Đơn đã tiếp nhận chỉ có tiến trình xử lý, không có lùi.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Mã đơn (SP-...), SĐT..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
          />
        </div>
      </div>

      {/* Orders Table — Zero Horizontal Scrollbar */}
      <div className="w-full border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Mã Đơn & Hẹn Lấy</th>
              <th className="py-3.5 px-3">Khách Hàng & Căn Hộ</th>
              <th className="py-3.5 px-3">Dịch Vụ & Khối Lượng</th>
              <th className="py-3.5 px-3">Ưu Đãi & Tổng Tiền</th>
              <th className="py-3.5 px-3">Trạng Thái</th>
              <th className="py-3.5 px-4 text-right">Điều Phối Tiến Độ (Chỉ Tiến Không Lùi)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400">
                  Chưa có đơn hàng nào trong sổ cái.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const nextStep = getNextStatus(o.status);
                const forwardStatuses = getForwardStatuses(o.status);

                return (
                  <tr key={o.id} className="hover:bg-sky-50/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#0284C7]">{o.id}</span>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {o.pickupDate} · {o.pickupTime}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{o.customerName}</div>
                      <div className="text-[11px] text-stone-500">{o.customerPhone} · {o.customerAddress}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-stone-800">{o.service}</span>
                      <div className="text-[11px] text-stone-500">{o.weight || "3.5kg"}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-stone-900 text-sm block">
                        {formatVnd(o.total)}
                      </span>
                      {o.voucherCode ? (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          {o.voucherCode} (-{formatVnd(o.discountAmount || 0)})
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400 block mt-0.5">Giá chuẩn</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          o.status === "Hoàn tất"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : o.status === "Hủy đơn"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-sky-50 text-sky-800 border-sky-200"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {o.status === "Hoàn tất" ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Đã hoàn tất</span>
                        </div>
                      ) : o.status === "Hủy đơn" ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-200">
                          <X size={13} className="text-rose-600" />
                          <span>Đã hủy đơn (Bảo lưu)</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {/* Nút 1-chạm tiến bước tiếp theo */}
                          {nextStep && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(o.id, nextStep)}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded shadow-2xs transition flex items-center gap-1 cursor-pointer"
                              title={`Tiến trình một chiều: Chuyển sang "${nextStep}"`}
                            >
                              <span>Tiến: {nextStep}</span>
                              <ChevronRight size={13} />
                            </button>
                          )}

                          {/* Dropdown chỉ chứa trạng thái hiện tại và các bước TIẾN VỀ PHÍA TRƯỚC */}
                          <select
                            value={o.status}
                            onChange={(e) => {
                              if (e.target.value !== o.status) {
                                handleAdvance(o.id, e.target.value as LaundryStatus);
                              }
                            }}
                            className="text-xs border border-stone-200 rounded px-2 py-1 bg-white font-medium focus:ring-2 focus:ring-[#0284C7] focus:outline-none cursor-pointer"
                            title="Điều phối một chiều: Chỉ tiến không lùi"
                          >
                            <option value={o.status}>{o.status} (Hiện tại)</option>
                            {forwardStatuses.length > 0 && (
                              <optgroup label="── BƯỚC TIẾP THEO (KHÔNG LÙI) ──">
                                {forwardStatuses.map((step) => (
                                  <option key={step} value={step}>
                                    → {step}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setCancellingOrder(o);
                              setCancelReason("Khách hàng đổi ý / không có nhà");
                              setIsCancelDialogOpen(true);
                            }}
                            className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition cursor-pointer"
                            title="Hủy đơn hàng này (Bảo lưu sổ cái)"
                          >
                            Hủy đơn
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận Hủy đơn bảo lưu lịch sử sổ cái */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-stone-200 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle size={18} />
              Xác Nhận Hủy Đơn Hàng #{cancellingOrder?.id}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Đơn hàng sẽ được chuyển sang trạng thái "Hủy đơn" và bảo lưu toàn bộ dữ liệu trên sổ cái kế toán (Immutable Ledger).
            </DialogDescription>
          </DialogHeader>

          {cancellingOrder && (
            <div className="space-y-4 my-2">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-500">Khách hàng:</span>
                  <span className="text-stone-900">{cancellingOrder.customerName} ({cancellingOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-500">Dịch vụ & Số tiền:</span>
                  <span className="text-stone-900">{cancellingOrder.service} · {formatVnd(cancellingOrder.total)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-500">Trạng thái hiện tại:</span>
                  <span className="text-[#0284C7] font-bold">{cancellingOrder.status}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Lý do hủy đơn (Lưu vết kiểm toán)
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] focus:outline-none bg-white font-medium"
                >
                  <option value="Khách hàng đổi ý / không có nhà">Khách hàng đổi ý / không có nhà</option>
                  <option value="Sai thông tin căn hộ / số điện thoại">Sai thông tin căn hộ / số điện thoại</option>
                  <option value="Trùng lặp đơn hàng">Trùng lặp đơn hàng</option>
                  <option value="Đồ có vết rách / hỏng hóc từ trước">Đồ có vết rách / hỏng hóc từ trước khi nhận</option>
                  <option value="Lý do vận hành khác">Lý do vận hành khác...</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCancelDialogOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  Xác nhận hủy đơn
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// 5. VOUCHERS TAB (GIỜ VÀNG & NGÀY ÁP DỤNG — KHÔNG CÓ NÚT XÓA THÙNG RÁC)
// ============================================================================
function VouchersTab() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setVouchers(getVouchers());
    const load = () => setVouchers(getVouchers());
    window.addEventListener("sachplus:vouchers-updated", load);
    return () => window.removeEventListener("sachplus:vouchers-updated", load);
  }, []);

  const handleToggle = (id: string) => {
    const updated = vouchers.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v));
    setVouchers(updated);
    saveVouchers(updated);
    toast.success("Đã cập nhật trạng thái hoạt động của ưu đãi");
  };

  const handleOpenAdd = () => {
    setEditingVoucher({
      id: `vch-${Date.now()}`,
      code: "HAPPYHOUR20",
      title: "GIỜ VÀNG SÁNG SỚM -20K",
      description: "Giảm ngay 20.000₫ cho đơn giặt sấy gửi trước 11h trưa",
      discountType: "fixed",
      discountValue: 20000,
      minOrderValue: 69000,
      startDate: "2026-09-01",
      endDate: "2026-10-31",
      activeDays: "weekdays",
      timeSlot: "morning",
      usageLimit: 300,
      usedCount: 0,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (v: VoucherItem) => {
    setEditingVoucher({ ...v });
    setIsDialogOpen(true);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVoucher) return;

    const exists = vouchers.some((v) => v.id === editingVoucher.id);
    let updated: VoucherItem[];
    if (exists) {
      updated = vouchers.map((v) => (v.id === editingVoucher.id ? editingVoucher : v));
      toast.success(`Đã cập nhật mã ưu đãi: ${editingVoucher.code}`);
    } else {
      updated = [...vouchers, editingVoucher];
      toast.success(`Đã phát hành mã ưu đãi mới: ${editingVoucher.code}`);
    }
    setVouchers(updated);
    saveVouchers(updated);
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-2xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900">Chiến Dịch Ưu Đãi & Khung Giờ Vàng</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Dynamic Promotion Engine
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Điều phối kích cầu cư dân gửi đồ sớm (khung giờ vàng) hoặc ngày cuối tuần, tự động đồng bộ sang ví cư dân.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus size={15} /> Tạo mã ưu đãi mới
        </button>
      </div>

      {/* Vouchers Table — Zero Horizontal Scrollbar */}
      <div className="w-full border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs table-auto">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Mã & Chương Trình Ưu Đãi</th>
              <th className="py-3.5 px-3">Mức Giảm & Điều Kiện</th>
              <th className="py-3.5 px-3">Khung Giờ & Thời Hạn</th>
              <th className="py-3.5 px-3">Tiến Độ Dùng</th>
              <th className="py-3.5 px-4 text-right">Trạng Thái & Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {vouchers.map((v) => {
              const discountText =
                v.discountType === "percent"
                  ? `Giảm ${v.discountValue}%`
                  : `Giảm ${formatVnd(v.discountValue)}`;
              const timeSlotText =
                v.timeSlot === "morning"
                  ? "Sáng (07h–11h)"
                  : v.timeSlot === "evening"
                  ? "Tối (18h–22h)"
                  : "Cả ngày";
              const daysText =
                v.activeDays === "weekdays"
                  ? "T2 – T6"
                  : v.activeDays === "weekend" || v.activeDays === "weekends"
                  ? "Cuối tuần"
                  : "Tất cả";

              return (
                <tr key={v.id} className="hover:bg-sky-50/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-sky-50 text-[#0284C7] font-mono font-extrabold rounded border border-sky-200 text-xs tracking-wider">
                        {v.code}
                      </span>
                    </div>
                    <div className="font-bold text-stone-900 text-sm">{v.title}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 max-w-sm">
                      {v.description}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-sm font-extrabold text-[#0284C7] block">
                      {discountText}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Đơn tối thiểu: <b>{formatVnd(v.minOrderValue)}</b>
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {timeSlotText}
                      </span>
                      <span className="text-[10px] text-stone-600 font-medium">
                        ({daysText})
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      {v.startDate} → {v.endDate}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-stone-800 text-xs">
                      {v.usedCount} <span className="text-stone-400 font-normal">/ {v.usageLimit}</span>
                    </div>
                    <div className="w-20 bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-[#0284C7] h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (v.usedCount / v.usageLimit) * 100)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(v.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                          v.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                        }`}
                      >
                        {v.isActive ? "● Đang chạy" : "⏸ Đã tạm tắt"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(v)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded flex items-center gap-1 transition cursor-pointer"
                      >
                        <Pencil size={12} className="text-[#0284C7]" />
                        <span>Sửa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Voucher Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editingVoucher && vouchers.some((v) => v.id === editingVoucher.id)
                ? `Cập Nhật Ưu Đãi: ${editingVoucher.code}`
                : "Phát Hành Mã Ưu Đãi Giờ Vàng Mới"}
            </DialogTitle>
          </DialogHeader>

          {editingVoucher && (
            <form onSubmit={handleSaveVoucher} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mã Voucher (Code)</label>
                  <input
                    type="text"
                    value={editingVoucher.code}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Tiêu Đề Chiến Dịch</label>
                  <input
                    type="text"
                    value={editingVoucher.title}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mức Giảm (VNĐ hoặc %)</label>
                  <input
                    type="number"
                    value={editingVoucher.discountValue}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, discountValue: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7] font-bold text-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Đơn Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={editingVoucher.minOrderValue}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, minOrderValue: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Khung Giờ Vàng</label>
                  <select
                    value={editingVoucher.timeSlot}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, timeSlot: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md bg-white"
                  >
                    <option value="all_day">Cả ngày (07:00 – 22:00)</option>
                    <option value="morning">Giờ vàng sáng (07:00 – 11:00)</option>
                    <option value="afternoon">Giờ vàng chiều (13:00 – 17:00)</option>
                    <option value="evening">Giờ vàng tối (18:00 – 22:00)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Ngày Trong Tuần</label>
                  <select
                    value={editingVoucher.activeDays}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, activeDays: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-md bg-white"
                  >
                    <option value="all">Tất cả các ngày</option>
                    <option value="weekdays">Chỉ ngày trong tuần (T2 – T6)</option>
                    <option value="weekend">Chỉ cuối tuần (T7 & CN)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVoucher.isActive}
                    onChange={(e) => setEditingVoucher({ ...editingVoucher, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                  <span>Đang kích hoạt chiến dịch</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-md flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Save size={14} /> Lưu ưu đãi
                  </button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// 6. MACHINES TAB (QUẢN LÝ THIẾT BỊ MÁY MÓC SHOPHOUSE)
// ============================================================================
function MachinesTab() {
  const [machines, setMachines] = useState<MachineItem[]>([]);

  useEffect(() => {
    setMachines(getMachines());
    const handleUpdate = () => setMachines(getMachines());
    window.addEventListener("sachplus:machines-updated", handleUpdate);
    return () => window.removeEventListener("sachplus:machines-updated", handleUpdate);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = machines.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    setMachines(updated);
    saveMachines(updated);
    toast.success(`Đã đổi trạng thái máy ${id} sang: "${newStatus}"`);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 p-6 shadow-2xs space-y-6">
      <div className="pb-4 border-b border-stone-100">
        <h2 className="text-xl font-bold text-stone-900">Giám Sát Đội Ngũ Máy Giặt & Sấy Công Nghiệp</h2>
        <p className="text-xs text-stone-500 mt-1">
          Hệ thống máy giặt sấy lầu 1 Shophouse SH-08 kết nối cảm biến tải trọng và chu trình khử khuẩn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-[#0284C7]/40 transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-sky-100 text-[#0284C7] font-extrabold flex items-center justify-center text-sm">
                  {m.id}
                </span>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{m.type}</h4>
                  <span className="text-[10px] text-stone-500 font-mono">Shophouse Lầu 1</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  m.status === "Trống"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : m.status === "Đang giặt" || m.status === "Đang sấy"
                    ? "bg-sky-50 text-sky-800 border-sky-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {m.status}
              </span>
            </div>

            <p className="text-xs text-stone-600 bg-white p-2 rounded border border-stone-100">
              {m.note || "Sẵn sàng nhận chu trình giặt mới"}
            </p>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Chuyển trạng thái:</span>
              <select
                value={m.status}
                onChange={(e) => handleStatusChange(m.id, e.target.value)}
                className="text-xs border border-stone-200 rounded px-2 py-1 bg-white font-semibold focus:ring-2 focus:ring-[#0284C7]"
              >
                <option value="Trống">Trống (Sẵn sàng)</option>
                <option value="Đang giặt">Đang giặt</option>
                <option value="Đang sấy">Đang sấy</option>
                <option value="Bảo trì">Bảo trì vệ sinh</option>
                <option value="Tạm ngưng">Tạm ngưng</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
