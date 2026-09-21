"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import {
  AlertTriangle,
  Camera,
  Check,
  Clock3,
  Coffee,
  Flame,
  Headphones,
  PackageSearch,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
  WashingMachine,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatVnd,
  getLaundryOrders,
  getOrderComplaints,
  submitOrderComplaint,
  updateOrderStatus,
  canCustomerCancel,
  cancelOrder,
  DEFAULT_LAUNDRY_ORDERS,
  type LaundryOrder,
  type OrderComplaint,
  type LaundryStatus,
} from "@/lib/sachplus-data";
import { getCurrentUser } from "@/lib/sachplus-auth";

export interface CafeOrderRecord {
  id: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  mode: string;
  customerName: string;
  note: string;
  createdAt: string;
}

const stages = [
  "Đã đặt lịch",
  "Shipper đã nhận",
  "Đang phân loại",
  "Đang giặt",
  "Đang sấy tiệt trùng",
  "QC & Đóng gói",
  "Đang giao tận cửa",
];

interface StageVisual {
  step: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  animation: "spin" | "pulse" | "truck" | "glow";
  icon: any;
}

const STAGE_VISUALS: Record<number, StageVisual> = {
  0: {
    step: "Bước 1/7",
    badge: "ĐÃ ĐẶT LỊCH",
    title: "Hệ thống xác nhận lịch hẹn thu gom",
    description: "Đơn giặt đã được ghi nhận trên hệ thống Sạch+ Shophouse SH-08. Shipper nội khu chuẩn bị túi giặt chuyên dụng để tới lấy đồ.",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=700&auto=format&fit=crop&q=80",
    animation: "pulse",
    icon: Clock3,
  },
  1: {
    step: "Bước 2/7",
    badge: "ĐÃ NHẬN TẠI TIỆM / TẬN CỬA",
    title: "Shipper đã nhận đồ & quét mã QR",
    description: "Túi giặt đã niêm phong thẻ QR định danh chống thất lạc đồ. Đang trên xe điện VinFast di chuyển về phòng giặt trung tâm SH-08.",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=700&auto=format&fit=crop&q=80",
    animation: "truck",
    icon: QrCode,
  },
  2: {
    step: "Bước 3/7",
    badge: "ĐANG PHÂN LOẠI",
    title: "Phân loại chất liệu vải & màu sắc",
    description: "Kỹ thuật viên tách riêng đồ màu, đồ trắng cao cấp; kiểm tra khuy cúc, khóa kéo và xử lý điểm các vết ố cứng đầu.",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=700&auto=format&fit=crop&q=80",
    animation: "pulse",
    icon: Shirt,
  },
  3: {
    step: "Bước 4/7",
    badge: "ĐANG GIẶT CHU TRÌNH",
    title: "Lồng giặt Electrolux Professional đảo ly tâm",
    description: "Máy lồng ngang đang xoay đảo liên tục. Nước ấm 40°C kết hợp nước giặt enzyme sinh học khử khuẩn sâu từng sợi vải.",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=700&auto=format&fit=crop&q=80",
    animation: "spin",
    icon: WashingMachine,
  },
  4: {
    step: "Bước 5/7",
    badge: "ĐANG SẤY TIỆT TRÙNG",
    title: "Sấy đối lưu nhiệt độ kiểm soát & UV-C",
    description: "Luồng khí ấm 65°C với hệ thống lọc xơ vải HEPA và đèn UV-C diệt khuẩn 99.9%, giữ sợi vải mềm xốp thơm mát.",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&auto=format&fit=crop&q=80",
    animation: "glow",
    icon: Flame,
  },
  5: {
    step: "Bước 6/7",
    badge: "QC & ĐÓNG GÓI CHỐNG BỤI",
    title: "Kiểm tra chất lượng & Đóng gói thơm tho",
    description: "Kiểm định trực quan 100% từng nếp vải, là ủi phẳng, xịt hương hoa chuông thanh khiết và niêm phong trong bao bì sinh học.",
    image: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=700&auto=format&fit=crop&q=80",
    animation: "pulse",
    icon: Sparkles,
  },
  6: {
    step: "Bước 7/7",
    badge: "ĐANG GIAO / HOÀN TẤT",
    title: "Giao đồ tận tay cư dân tại sảnh / căn hộ",
    description: "Túi đồ sạch thơm đã sẵn sàng! Shipper nội khu giao tận cửa căn hộ hoặc bàn giao tại quầy Shophouse SH-08.",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=700&auto=format&fit=crop&q=80",
    animation: "truck",
    icon: Truck,
  },
};

export default function OrdersPage() {
  const [activeCategory, setActiveCategory] = useState<"laundry" | "cafe">("laundry");
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [orders, setOrders] = useState<LaundryOrder[]>(DEFAULT_LAUNDRY_ORDERS);
  const [cafeOrders, setCafeOrders] = useState<CafeOrderRecord[]>([]);
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LaundryOrder | null>(DEFAULT_LAUNDRY_ORDERS[0]);

  // Modals
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintType, setComplaintType] = useState<OrderComplaint["type"]>("Đồ chưa sạch");
  const [complaintText, setComplaintText] = useState("");
  const [complaintList, setComplaintList] = useState<OrderComplaint[]>([]);

  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Modal hủy đơn cho khách hàng
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Đổi lịch bận đột xuất");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCustomerCancel = () => {
    if (!selected) return;
    const user = getCurrentUser();
    if (user && user.role === 'customer' && selected.customerPhone !== user.phone) {
      toast.error('Bạn không có quyền hủy đơn hàng này.');
      return;
    }
    if (!canCustomerCancel(selected.status)) {
      toast.error("Đơn hàng đã được tiệm tiếp nhận và xử lý trong chu trình một chiều. Không thể tự hủy đơn.");
      return;
    }
    const finalReason =
      cancelReason === "Khác" && customCancelReason.trim()
        ? customCancelReason.trim()
        : cancelReason;

    setIsCancelling(true);
    const res = cancelOrder(selected.id, finalReason, "customer");
    setIsCancelling(false);
    if (res.success) {
      toast.success(res.message);
      setCancelDialogOpen(false);
      setCustomCancelReason("");
      const refreshed = getLaundryOrders();
      const user = getCurrentUser();
      const filtered = user && user.role === 'customer'
        ? refreshed.filter(o => o.customerPhone === user.phone)
        : refreshed;
      setOrders(filtered);
      const current = refreshed.find((o) => o.id === selected.id);
      if (current) setSelected(current);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    const load = () => {
      const data = getLaundryOrders();
      const user = getCurrentUser();
      const userOrders = user && user.role === 'customer'
        ? data.filter(o => o.customerPhone === user.phone || o.customerName?.includes(user.name?.split(' ').pop() || ''))
        : user ? data : []; // Admin/Staff see all, guest sees nothing
      setOrders(userOrders);
      setComplaintList(getOrderComplaints());

      try {
        const cafeRaw = localStorage.getItem("sachplus_cafe_orders");
        if (cafeRaw) {
          setCafeOrders(JSON.parse(cafeRaw));
        }
      } catch {}

      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const targetId = params?.get("orderId");

      setSelected((prev) => {
        if (targetId) {
          const match = data.find((o) => o.id === targetId);
          if (match) return match;
        }
        if (!prev) return data[0] || null;
        return data.find((o) => o.id === prev.id) || data[0] || null;
      });
    };
    load();
    window.addEventListener("sachplus:order-created", load);
    window.addEventListener("sachplus:order-updated", load);
    window.addEventListener("sachplus:cafe-order-created", load);
    return () => {
      window.removeEventListener("sachplus:order-created", load);
      window.removeEventListener("sachplus:order-updated", load);
      window.removeEventListener("sachplus:cafe-order-created", load);
    };
  }, []);

  const visible = useMemo(
    () =>
      orders.filter((order) => {
        if (filter === "Đang xử lý") {
          if (order.status === "Hoàn tất" || order.status === "Hủy đơn") return false;
        } else if (filter === "Hoàn tất") {
          if (order.status !== "Hoàn tất") return false;
        } else if (filter === "Đã hủy") {
          if (order.status !== "Hủy đơn") return false;
        }
        return `${order.id} ${order.service} ${order.customerName || ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
      }),
    [orders, filter, query]
  );

  const stageIndex = useMemo(() => {
    if (!selected) return 0;
    const s = selected.status as string;
    if (s === "Hoàn tất" || s === "Đã giao tận cửa" || s === "Đã giao") return 6;
    if (s === "Đang giao" || s === "Đang giao hàng") return 6;
    if (s === "QC & đóng gói" || s === "QC & Đóng gói") return 5;
    if (s === "Đang sấy" || s === "Đang sấy tiệt trùng") return 4;
    if (s === "Đang giặt") return 3;
    if (s === "Đang phân loại") return 2;
    if (s === "Shipper đã lấy" || s === "Shipper đã nhận" || s === "Đã nhận tại tiệm" || s === "Đã nhận đồ") return 1;
    return 0; // "Đã đặt", "Đã đặt lịch"
  }, [selected]);

  const handleSendComplaint = () => {
    if (!selected) return;
    const user = getCurrentUser();
    if (user && user.role === 'customer' && selected.customerPhone !== user.phone) {
      toast.error('Bạn không có quyền khiếu nại đơn hàng này.');
      return;
    }
    if (!complaintText.trim()) {
      toast.error("Vui lòng ghi rõ chi tiết vấn đề bạn gặp phải.");
      return;
    }
    const ticket = submitOrderComplaint(selected.id, complaintType, complaintText);
    setComplaintList(getOrderComplaints());
    setComplaintOpen(false);
    setComplaintText("");
    toast.success(`Đã gửi yêu cầu hỗ trợ #${ticket.id}. Bộ phận CS Sạch+ sẽ phản hồi trong 15 phút.`);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      <SiteHeader active="Đơn của tôi" />

      <section className="subpage-head max-w-7xl mx-auto px-4 pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="kicker text-[#0284C7] font-bold text-xs tracking-wider uppercase">SẠCH+ REALTIME TRACKING</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quản lý & Theo dõi đơn hàng
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Minh bạch từng công đoạn giặt sấy, ảnh đối soát trước & sau và tiến độ pha chế cà phê.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cafe"
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-md text-xs border border-slate-200 transition shadow-sm inline-flex items-center gap-1.5"
          >
            <Coffee size={15} className="text-[#0284C7]" /> Menu Sạch+ Café
          </Link>
          <Link
            href="/dat-lich"
            className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-xs transition shadow-sm inline-flex items-center gap-1.5"
          >
            <Plus size={16} /> Đặt đơn giặt mới
          </Link>
        </div>
      </section>

      {/* Main Tabs: Giặt ủi vs Café */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="inline-flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
          <button
            type="button"
            onClick={() => setActiveCategory("laundry")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
              activeCategory === "laundry"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <WashingMachine size={15} />
            Đơn Giặt Ủi ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("cafe")}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
              activeCategory === "cafe"
                ? "bg-[#0284C7] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Coffee size={15} />
            Đơn Sạch+ Café ({cafeOrders.length})
          </button>
        </div>
      </div>

      {activeCategory === "laundry" ? (
        <section className="orders-layout max-w-7xl mx-auto px-4 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
          {/* Mobile View Toggle (< 1024px) */}
          <div className="lg:hidden col-span-1 flex items-center p-1 bg-slate-100 rounded-lg w-full mb-1">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileView === "list"
                  ? "bg-white text-[#0284C7] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shirt size={14} /> Danh sách đơn ({visible.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileView("detail")}
              disabled={!selected}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5 ${
                mobileView === "detail"
                  ? "bg-white text-[#0284C7] shadow-xs"
                  : selected
                  ? "text-slate-600 hover:text-slate-900 cursor-pointer"
                  : "text-slate-400 opacity-50 cursor-not-allowed"
              }`}
            >
              <PackageSearch size={14} /> Chi tiết {selected ? `#${selected.id}` : ""}
            </button>
          </div>

          {/* Danh sách đơn hàng bên trái */}
          <div className={`orders-main lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm p-4 w-full min-w-0 overflow-hidden ${mobileView === "detail" ? "hidden lg:block" : "block"}`}>
            <div className="orders-tools flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 border-b border-slate-200">
              <label className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm theo mã đơn (SP-...) hoặc dịch vụ..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                />
              </label>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="bg-slate-100 p-1 rounded-md">
                  {["Tất cả", "Đang xử lý", "Hoàn tất", "Đã hủy"].map((item) => (
                    <TabsTrigger
                      key={item}
                      value={item}
                      className="text-xs px-3 py-1 font-semibold data-[state=active]:bg-white data-[state=active]:text-[#0284C7] data-[state=active]:shadow-sm rounded"
                    >
                      {item}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Mobile Order Cards List (< 640px) */}
            <div className="block sm:hidden space-y-3 mt-3">
              {visible.length === 0 ? (
                <div className="text-center py-12 px-4 text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center">
                  <PackageSearch size={36} className="text-slate-300 mb-2" />
                  <p className="font-bold text-slate-800 text-sm">Chưa có đơn hàng nào</p>
                  <p className="text-[11px] text-slate-500 mt-1 mb-3">Bạn chưa đặt đơn giặt sấy nào hoặc không tìm thấy theo bộ lọc.</p>
                  <Link href="/dat-lich" className="px-3.5 py-1.5 bg-[#0284C7] text-white text-xs font-bold rounded-md inline-flex items-center gap-1 shadow-2xs">
                    <Plus size={13} /> Đặt đơn giặt mới
                  </Link>
                </div>
              ) : (
                visible.map((order) => {
                  const isSelected = selected?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelected(order);
                        setMobileView("detail");
                      }}
                      className={`p-3.5 rounded-lg border transition cursor-pointer ${
                        isSelected
                          ? "bg-sky-50/80 border-[#0284C7] shadow-xs"
                          : "bg-white border-slate-200 hover:border-sky-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-[#0284C7]">#{order.id}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                            {order.qrCode || `${order.id}-SG`}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === "Hủy đơn"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : order.status === "Hoàn tất"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-sky-50 text-[#0284C7] border border-sky-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.status === "Hủy đơn"
                                ? "bg-rose-500"
                                : order.status === "Hoàn tất"
                                ? "bg-emerald-500"
                                : "bg-[#0284C7] animate-pulse"
                            }`}
                          />
                          {order.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800 mb-1">{order.service}</p>
                      <div className="text-[11px] text-slate-500 space-y-0.5 mb-2.5">
                        <p className="truncate">{order.journey} · {order.weight || "Chờ cân"}</p>
                        <p className="text-slate-400">{order.pickupDate} ({order.pickupTime})</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-extrabold text-[#0284C7]">{formatVnd(order.total)}</span>
                        <span className="font-bold text-[#0284C7] flex items-center gap-1 text-[11px]">
                          Xem tiến độ chi tiết →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop / Tablet Table (>= 640px) */}
            <div className="hidden sm:block order-table-card mt-3 overflow-x-auto w-full min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <TableHead className="font-bold text-xs">Mã đơn & QR</TableHead>
                    <TableHead className="font-bold text-xs">Dịch vụ & Khối lượng</TableHead>
                    <TableHead className="font-bold text-xs">Khung giờ</TableHead>
                    <TableHead className="font-bold text-xs">Trạng thái</TableHead>
                    <TableHead className="text-right font-bold text-xs">Tổng tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-14 text-slate-500 text-xs">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <PackageSearch size={36} className="text-slate-300 mb-2" />
                          <p className="font-bold text-slate-800 text-sm">Chưa có đơn hàng giặt sấy nào</p>
                          <p className="text-xs text-slate-400 mt-1 mb-4">Sẵn sàng nhận đồ giặt tận cửa hoặc gửi tại quầy Shophouse SH-08.</p>
                          <Link href="/dat-lich" className="px-4 py-2 bg-[#0284C7] text-white text-xs font-bold rounded-md inline-flex items-center gap-1.5 shadow-sm">
                            <Plus size={14} /> Đặt lịch giặt sấy mới
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((order) => (
                      <TableRow
                        key={order.id}
                        onClick={() => setSelected(order)}
                        data-state={selected?.id === order.id ? "selected" : undefined}
                        className={`cursor-pointer transition-colors border-b border-slate-100 ${
                          selected?.id === order.id
                            ? "bg-[#E0F2FE]/50 font-medium"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <TableCell>
                          <strong className="text-[#0284C7] flex items-center gap-1 text-xs">
                            {order.id}
                          </strong>
                          <small className="text-slate-400 font-mono text-[11px] block">
                            QR: {order.id}-SG
                          </small>
                        </TableCell>
                        <TableCell>
                          <strong className="text-xs text-slate-800 block">{order.service}</strong>
                          <small className="text-slate-500 text-[11px]">
                            {order.journey} · {order.weight || "Chờ cân"}
                          </small>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-slate-700 block">{order.pickupDate}</span>
                          <small className="text-slate-500 text-[11px]">{order.pickupTime}</small>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                              order.status === "Hủy đơn"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : order.status === "Hoàn tất"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-sky-50 text-[#0284C7] border border-sky-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                order.status === "Hủy đơn"
                                  ? "bg-rose-500"
                                  : order.status === "Hoàn tất"
                                  ? "bg-emerald-500"
                                  : "bg-[#0284C7] animate-pulse"
                              }`}
                            />
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <strong className="text-[#0284C7] text-xs">{formatVnd(order.total)}</strong>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Chi tiết đơn được chọn bên phải */}
          {!selected ? (
            <aside className={`order-detail lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-sm p-6 text-center w-full min-w-0 overflow-hidden ${mobileView === "list" ? "hidden lg:block" : "block"}`}>
              <PackageSearch size={48} className="text-slate-300 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-700">Chưa chọn đơn hàng nào</h2>
              <p className="text-xs text-slate-500 mt-1">Bấm vào một đơn hàng để theo dõi tiến độ chi tiết.</p>
            </aside>
          ) : (
            <aside className={`order-detail lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-5 w-full min-w-0 overflow-hidden ${mobileView === "list" ? "hidden lg:block" : "block"}`}>
              {/* Nút quay lại danh sách trên Mobile */}
              <div className="lg:hidden mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMobileView("list")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                >
                  ← Quay lại danh sách đơn
                </button>
                <span className="text-[11px] text-slate-400 font-medium">#{selected.id}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-[#0284C7] tracking-wider uppercase">TIẾN ĐỘ THỜI GIAN THỰC</p>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">#{selected.id}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 transition"
                    title="Xem mã QR túi đồ"
                  >
                    <QrCode size={18} />
                  </button>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      selected.status === "Hủy đơn"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : selected.status === "Hoàn tất"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-sky-50 text-[#0284C7] border border-sky-200"
                    }`}
                  >
                    {selected.status === "Hủy đơn" ? "✕ Đã hủy đơn" : selected.status}
                  </span>
                </div>
              </div>

              {/* Thông tin túi đồ */}
              <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-sky-100 text-[#0284C7] rounded-md">
                    <PackageSearch size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{selected.service}</span>
                    <span className="text-[11px] text-slate-500">
                      Khối lượng: <b>{selected.weight || "Chưa cân tại quầy"}</b>
                      {selected.machineId && (
                        <span className="text-[#0369A1] font-semibold ml-2">· Máy: {selected.machineId}</span>
                      )}
                    </span>
                  </div>
                </div>
                <b className="text-sm font-extrabold text-[#0284C7]">{formatVnd(selected.total)}</b>
              </div>

              {selected.status === "Hủy đơn" ? (
                <div className="my-4 p-4 bg-rose-50/80 border border-rose-200 rounded-lg text-rose-900">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                    Đơn hàng đã được hủy & bảo lưu lịch sử
                  </div>
                  <p className="text-xs text-rose-700 mt-2 leading-relaxed">
                    Đơn hàng <b>#{selected.id}</b> đã được hủy theo yêu cầu. Dữ liệu đơn và mã định danh QR <b>{selected.qrCode || `${selected.id}-SGPARK`}</b> vẫn được lưu vết đối soát trên sổ cái Sạch+. Quý khách cần hỗ trợ hoàn tiền hoặc đặt lại vui lòng liên hệ Hotline <b>1900 6868</b>.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-rose-200 flex items-center justify-between text-xs">
                    <span className="text-rose-600 font-medium">Hỗ trợ đối soát đơn:</span>
                    <a href="tel:19006868" className="font-bold text-rose-800 hover:underline">1900 6868 (Hotline 24/7)</a>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tiến trình thanh phần trăm */}
                  <div className="my-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="font-semibold">Tiến trình giặt sấy</span>
                      <span className="font-bold text-[#0284C7]">
                        {selected.status === "Hoàn tất" ? 100 : Math.round(((stageIndex + 1) / 7) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={selected.status === "Hoàn tất" ? 100 : ((stageIndex + 1) / 7) * 100}
                      className="h-2 bg-slate-200"
                    />
                  </div>

                  {/* ============================================================ */}
                  {/* KHỐI HÌNH ẢNH MÔ PHỎNG CÔNG ĐOẠN TRỰC QUAN & CHUYỂN ĐỘNG VÔ HẠN */}
                  {/* ============================================================ */}
                  {(() => {
                    const visual = STAGE_VISUALS[stageIndex] || STAGE_VISUALS[0];
                    const VisualIcon = visual.icon;
                    return (
                      <div className="my-3 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                          <img
                            src={visual.image}
                            alt={visual.title}
                            className="w-full h-full object-cover transition-all duration-700 ease-out brightness-[0.80]"
                          />
                          {/* Glassmorphism Header Tag */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded flex items-center gap-1.5 border border-white/20">
                              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                              {visual.step} · {visual.badge}
                            </span>
                            <span className="px-2 py-0.5 bg-[#0284C7] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                              Real-time
                            </span>
                          </div>

                          {/* INFINITE ANIMATIONS OVERLAY */}
                          {visual.animation === "spin" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-950/40 backdrop-blur-[1px]">
                              <div className="relative flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full border-4 border-white/30 border-t-[#38BDF8] animate-spin" />
                                <WashingMachine size={24} className="text-white absolute animate-pulse" />
                              </div>
                              <span className="mt-2 text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                Lồng giặt xoay ly tâm 1200 RPM
                              </span>
                            </div>
                          )}

                          {visual.animation === "truck" && (
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-white text-xs font-semibold">
                              <div className="flex items-center gap-2">
                                <Truck size={16} className="text-sky-400 animate-bounce" />
                                <span>Shipper xe điện VinFast đang di chuyển</span>
                              </div>
                              <span className="text-[10px] font-mono text-sky-300">GPS LIVE</span>
                            </div>
                          )}

                          {visual.animation === "glow" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/30">
                              <Flame size={30} className="text-amber-400 animate-pulse" />
                              <span className="mt-1 text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                                Sấy đối lưu 65°C · Đèn UV-C tiệt trùng
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-200">
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-[#E0F2FE] text-[#0284C7] rounded mt-0.5 shrink-0">
                              <VisualIcon size={16} />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 leading-tight">{visual.title}</h4>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{visual.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Timeline 7 bước */}
                  <div className="vertical-timeline my-3 space-y-2 border-t border-slate-200 pt-3">
                    {stages.map((stage, index) => (
                      <div
                        key={stage}
                        className={`flex items-start gap-2.5 text-xs p-1.5 rounded transition ${
                          index <= stageIndex ? "bg-sky-50/70 text-slate-900" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            index < stageIndex
                              ? "bg-emerald-500 text-white"
                              : index === stageIndex
                              ? "bg-[#0284C7] text-white animate-pulse"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {index < stageIndex ? <Check size={12} /> : index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <strong className={`block text-xs ${index <= stageIndex ? "text-slate-900" : "text-slate-400"}`}>
                            {stage}
                          </strong>
                          <span className="text-[11px] text-slate-500 leading-tight block">
                            {index === stageIndex
                              ? selected.machineTimer
                                ? `Đang vận hành · ${selected.machineTimer}`
                                : "Đang xử lý tại Shophouse Vinhomes SG Park"
                              : index < stageIndex
                              ? "Đã hoàn thành chuẩn kiểm định"
                              : "Chờ công đoạn tiếp theo"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Dự kiến giao */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-2.5 my-3 text-xs">
                <Truck size={18} className="text-[#0284C7] shrink-0" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Dự kiến giao lại tận căn hộ:</span>
                  <strong className="text-slate-800">{selected.pickupDate} lúc 17:30 · {selected.customerAddress || 'Shophouse SH-08'}</strong>
                </div>
              </div>

              {/* Ảnh đối soát Trước / Sau */}
              <div className="border border-slate-200 rounded-md p-3 my-3">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-xs text-slate-800 flex items-center gap-1.5">
                    <Camera size={14} className="text-[#0284C7]" /> Ảnh chụp đối soát QC Trước & Sau
                  </strong>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    Đã duyệt QC
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative h-24 rounded overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={selected.beforePhoto || "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=80"}
                      alt="Ảnh đồ lúc nhận"
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Lúc nhận đồ
                    </span>
                  </div>
                  <div className="relative h-24 rounded overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={selected.afterPhoto || "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&q=80"}
                      alt="Ảnh đồ sau khi giặt xong"
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute bottom-1 left-1 bg-emerald-700/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Sau giặt xong
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  * Ảnh lưu trữ trên hệ thống đối chiếu chống thất lạc hoặc hư hại đồ vải.
                </p>
              </div>

              {/* VÙNG HÀNH ĐỘNG CỦA KHÁCH HÀNG: HỦY ĐƠN & KHIẾU NẠI */}
              {selected.status === "Đã đặt" ? (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2.5">
                  <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-md text-[11px] text-sky-800 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#0284C7] shrink-0" />
                    <span>Đơn hàng vừa đặt, chưa bàn giao cho tiệm. Quý khách có thể hủy miễn phí.</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCancelDialogOpen(true)}
                      className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <X size={15} /> Hủy đơn hàng này
                    </button>
                    <button
                      type="button"
                      className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      onClick={() => setComplaintOpen(true)}
                    >
                      <Headphones size={15} /> Khiếu nại / CSKH
                    </button>
                  </div>
                </div>
              ) : selected.status === "Hủy đơn" ? (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-md text-center text-xs font-semibold text-slate-500">
                    ✕ Đơn hàng đã hủy · Đã bảo lưu lịch sử trên hệ thống
                  </div>
                </div>
              ) : selected.status === "Hoàn tất" ? (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-800 flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Đơn hàng đã hoàn tất & giao nhận thành công. Cảm ơn quý khách!</span>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    onClick={() => setComplaintOpen(true)}
                  >
                    <Headphones size={15} /> Báo sự cố sau nhận đồ (nếu có)
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck size={15} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Quy trình một chiều: Đơn đang xử lý</span>
                      <span className="text-amber-800 leading-relaxed block mt-0.5">
                        Đơn hàng đang ở bước <b>{selected.status}</b> và đã được niêm phong thẻ QR mã hóa. Hệ thống khóa tự hủy đơn để bảo vệ an toàn đồ vải. Quý khách cần hỗ trợ gấp vui lòng gọi Hotline <a href="tel:19006868" className="font-bold underline">1900 6868</a>.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    onClick={() => setComplaintOpen(true)}
                  >
                    <Headphones size={15} /> Báo sự cố hoặc khiếu nại đơn này
                  </button>
                </div>
              )}
            </aside>
          )}
        </section>
      ) : (
        /* DANH SÁCH ĐƠN CAFÉ */
        <section className="max-w-7xl mx-auto px-4 pb-32 w-full min-w-0">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 sm:p-5 w-full min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Coffee size={20} className="text-[#0284C7]" /> Lịch sử Đơn hàng Sạch+ Café (Lầu 1)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đồ uống và bánh ngọt được pha chế nóng sốt trực tiếp tại quầy bar Shophouse SH-08.
                </p>
              </div>
              <Link
                href="/cafe"
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-xs transition shadow-sm inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus size={15} /> Gọi thêm món mới
              </Link>
            </div>

            {cafeOrders.length === 0 ? (
              <div className="py-16 text-center">
                <Coffee size={48} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">Chưa có đơn hàng Café nào</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Bạn có thể ghé quầy Bar Lầu 1 hoặc đặt món online để thưởng thức cà phê trong lúc chờ đồ giặt.
                </p>
                <Link
                  href="/cafe"
                  className="mt-4 px-4 py-2 bg-[#0284C7] text-white rounded-md text-xs font-bold inline-flex items-center gap-1.5"
                >
                  Xem Menu Sạch+ Café
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Café Order Cards (< 640px) */}
                <div className="block sm:hidden space-y-3 mt-4">
                  {cafeOrders.map((co) => (
                    <div key={co.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-[#0284C7] text-xs font-mono">#{co.id}</strong>
                          <span className="text-[11px] text-slate-500 block">{co.customerName}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Đang chuẩn bị (8p)
                        </span>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-slate-200/60">
                        {co.items.map((it, i) => (
                          <div key={i} className="text-xs text-slate-800 flex items-center justify-between">
                            <span>• {it.name} <b className="text-slate-500">x{it.quantity}</b></span>
                            <span className="font-semibold text-slate-700">{formatVnd(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {co.note && <p className="text-[11px] text-slate-400 italic">Ghi chú: {co.note}</p>}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <div className="text-[11px] text-slate-400">
                          {co.mode} · {new Date(co.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="text-right">
                          <strong className="text-xs text-[#0284C7]">{formatVnd(co.total)}</strong>
                          {co.discount > 0 && (
                            <span className="text-[10px] text-emerald-600 block">Giảm {formatVnd(co.discount)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop / Tablet Café Table (>= 640px) */}
                <div className="hidden sm:block overflow-x-auto mt-4 w-full min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <TableHead className="font-bold text-xs">Mã đơn Café</TableHead>
                        <TableHead className="font-bold text-xs">Các món đã gọi</TableHead>
                        <TableHead className="font-bold text-xs">Hình thức</TableHead>
                        <TableHead className="font-bold text-xs">Thời gian đặt</TableHead>
                        <TableHead className="font-bold text-xs">Trạng thái pha chế</TableHead>
                        <TableHead className="text-right font-bold text-xs">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cafeOrders.map((co) => (
                        <TableRow key={co.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <TableCell>
                            <strong className="text-[#0284C7] text-xs font-mono">{co.id}</strong>
                            <span className="text-[11px] text-slate-500 block">{co.customerName}</span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              {co.items.map((it, i) => (
                                <span key={i} className="text-xs text-slate-800 block">
                                  • {it.name} <b className="text-slate-500">x{it.quantity}</b> ({formatVnd(it.price)})
                                </span>
                              ))}
                            </div>
                            {co.note && <span className="text-[11px] text-slate-400 italic block mt-0.5">Ghi chú: {co.note}</span>}
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {co.mode}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {new Date(co.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            <span className="text-[11px] text-slate-400 block">
                              {new Date(co.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Đang chuẩn bị (8p)
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <strong className="text-xs text-[#0284C7]">{formatVnd(co.total)}</strong>
                            {co.discount > 0 && (
                              <span className="text-[10px] text-emerald-600 block">Giảm {formatVnd(co.discount)}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* DIALOG KHIẾU NẠI / BÁO SỰ CỐ */}
      {selected && (
        <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
          <DialogContent className="sm:max-w-[480px] p-6 bg-white rounded-md">
            <DialogHeader>
              <p className="kicker text-[#DC2626] font-bold text-xs uppercase">CHĂM SÓC KHÁCH HÀNG</p>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Báo sự cố đơn #{selected.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Sạch+ cam kết bồi hoàn 100% giá trị dịch vụ nếu có sự cố về chất lượng giặt hoặc thất lạc.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vấn đề gặp phải</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800"
                >
                  <option value="Đồ chưa sạch">Đồ giặt xong chưa sạch hoặc còn vết bẩn</option>
                  <option value="Hư hỏng đồ vải">Đồ vải bị xước, phai màu hoặc hư hỏng</option>
                  <option value="Thất lạc đồ">Nghi ngờ thất lạc đồ</option>
                  <option value="Giao trễ hẹn">Shipper giao trễ so với khung giờ hẹn</option>
                  <option value="Khác">Vấn đề khác</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chi tiết mô tả sự cố</label>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  rows={4}
                  placeholder="Vui lòng mô tả cụ thể tình trạng đồ hoặc thời gian phát sinh vấn đề để Sạch+ hỗ trợ xử lý nhanh nhất..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold"
                onClick={() => setComplaintOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold shadow-sm"
                onClick={handleSendComplaint}
              >
                Gửi yêu cầu tiếp nhận
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG XEM QR CODE TÚI ĐỒ */}
      {selected && (
        <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
          <DialogContent className="sm:max-w-[360px] p-6 bg-white rounded-md text-center">
            <DialogHeader>
              <p className="kicker text-[#0284C7] font-bold text-xs uppercase">TEM ĐỊNH DANH TÚI ĐỒ</p>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Mã QR Đơn #{selected.id}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center my-2">
              <div className="w-44 h-44 bg-white p-2 border-2 border-dashed border-[#0284C7] rounded-md flex items-center justify-center shadow-inner">
                <QrCode size={130} className="text-[#0369A1]" />
              </div>
              <strong className="mt-3 font-mono text-sm tracking-wider text-[#0369A1]">
                {selected.qrCode || `${selected.id}-SGPARK`}
              </strong>
              <small className="text-xs text-slate-500 mt-1">
                Dành cho nhân viên và shipper quét cập nhật tiến trình
              </small>
            </div>
            <button
              type="button"
              className="w-full py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-xs transition mt-2 shadow-sm"
              onClick={() => setQrModalOpen(false)}
            >
              Đóng lại
            </button>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG XÁC NHẬN HỦY ĐƠN HÀNG DÀNH CHO KHÁCH */}
      {selected && (
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="sm:max-w-[460px] p-6 bg-white rounded-md">
            <DialogHeader>
              <p className="kicker text-rose-600 font-bold text-xs uppercase tracking-wider">HỦY ĐƠN TRỰC TUYẾN</p>
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                Xác nhận hủy đơn #{selected.id}?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Bạn chỉ có thể hủy đơn khi nhân viên hoặc shipper chưa tiếp nhận đồ. Toàn bộ tiền cọc (nếu có) sẽ được bảo lưu hoặc hoàn trả.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lý do hủy đơn</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                >
                  <option value="Đổi lịch bận đột xuất">Đổi lịch bận đột xuất / Không có người ở nhà</option>
                  <option value="Đặt nhầm dịch vụ hoặc khung giờ">Đặt nhầm loại dịch vụ hoặc khung giờ</option>
                  <option value="Tự mang đồ ra giặt tại tiệm">Tự mang đồ ra quầy Shophouse SH-08</option>
                  <option value="Không còn nhu cầu giặt sấy">Không còn nhu cầu giặt sấy lúc này</option>
                  <option value="Khác">Lý do khác...</option>
                </select>
              </div>

              {cancelReason === "Khác" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chi tiết lý do</label>
                  <textarea
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    rows={3}
                    placeholder="Vui lòng ghi thêm lý do hủy để Sạch+ cải thiện chất lượng phục vụ..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Sau khi bấm xác nhận, đơn hàng sẽ chuyển sang trạng thái <b>Hủy đơn</b> và được bảo lưu sổ cái đối soát. Thao tác không thể đảo ngược.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-bold transition"
                onClick={() => setCancelDialogOpen(false)}
              >
                Giữ lại đơn
              </button>
              <button
                type="button"
                disabled={isCancelling}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                onClick={handleCustomerCancel}
              >
                {isCancelling ? "Đang hủy..." : "Xác nhận hủy đơn"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <SiteFooter />
    </main>
  );
}
