"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import {
  createLaundryOrder,
  formatVnd,
  getServiceCatalog,
  getCafeMenu,
  getVouchers,
  validateVoucher,
  getLaundryOrders,
  getMachines,
  type LaundryService,
  type VoucherItem,
  type CafeMenuItem,
} from "@/lib/sachplus-data";
import { getCurrentUser, type UserProfile } from "@/lib/sachplus-auth";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Gift,
  MapPin,
  PackageCheck,
  Phone,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Shirt,
  Sparkles,
  Tag,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";



export const EXPRESS_CONFIG: Record<
  LaundryService,
  { name: string; turnaround: string; fee: number; note: string }
> = {
  "Giặt & sấy": {
    name: "Gói Hỏa tốc lấy liền 2 giờ",
    turnaround: "2 giờ",
    fee: 30000,
    note: "Ưu tiên máy trống ngay, tiệt trùng nhiệt và giao trả trong 2 giờ (+30.000₫)",
  },
  "Chăn ga": {
    name: "Gói Hỏa tốc trong ngày 4 giờ",
    turnaround: "4 giờ",
    fee: 35000,
    note: "Khử khuẩn ozone công suất cao & sấy tiệt trùng nhận lại trong 4 giờ thay vì 24 giờ tiêu chuẩn (+35.000₫)",
  },
  "Giặt hấp": {
    name: "Gói Hỏa tốc lấy gấp 6 giờ",
    turnaround: "6 giờ",
    fee: 40000,
    note: "Hấp khô sinh học organic & là hơi chuyên sâu lấy trong ngày sau 6 giờ (+40.000₫)",
  },
  "Giày & túi": {
    name: "Gói Hỏa tốc spa 12 giờ",
    turnaround: "12 giờ",
    fee: 50000,
    note: "Làm sạch bọt khô thủ công, chiếu đèn UV-C diệt khuẩn lấy trong ngày sau 12 giờ (+50.000₫)",
  },
};

const TIME_SLOTS = [
  { value: '08:00 – 10:00', label: 'Sáng sớm' },
  { value: '11:00 – 13:00', label: 'Buổi trưa' },
  { value: '14:00 – 16:00', label: 'Buổi chiều' },
  { value: '17:00 – 19:00', label: 'Tan tầm' },
  { value: '19:30 – 21:30', label: 'Tối muộn' },
];

function BookingContent() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<LaundryService>("Giặt & sấy");
  const [journey, setJourney] = useState("Lấy tại nhà → giao tận nhà");
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [time, setTime] = useState("17:00 – 19:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [express, setExpress] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  // Voucher states
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherItem | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherItem[]>([]);

  const [slotOrders, setSlotOrders] = useState<any[]>([]);
  const [totalWashers, setTotalWashers] = useState(4);

  useEffect(() => {
    const loadSlots = () => {
      const orders = getLaundryOrders();
      const machines = getMachines();
      setSlotOrders(orders.filter(o => o.status !== 'Hoàn tất' && o.status !== 'Hủy đơn'));
      setTotalWashers(machines.filter(m => m.type.includes('giặt')).length);
    };
    loadSlots();
    window.addEventListener('sachplus:order-created', loadSlots);
    window.addEventListener('sachplus:order-updated', loadSlots);
    window.addEventListener('sachplus:machines-updated', loadSlots);
    return () => {
      window.removeEventListener('sachplus:order-created', loadSlots);
      window.removeEventListener('sachplus:order-updated', loadSlots);
      window.removeEventListener('sachplus:machines-updated', loadSlots);
    };
  }, []);

  function getSlotCount(timeRange: string): number {
    const today = new Date().toLocaleDateString('vi-VN');
    const checkDate = date || today;
    return slotOrders.filter(o => {
      const orderDate = o.pickupDate;
      const matches = orderDate === checkDate && o.pickupTime === timeRange;
      return matches;
    }).length;
  }

  // Initialize service from URL query and pre-fill user info
  useEffect(() => {
    setAvailableVouchers(getVouchers().filter((v) => v.isActive));

    const handleVouchers = () => {
      setAvailableVouchers(getVouchers().filter((v) => v.isActive));
    };
    window.addEventListener("sachplus:vouchers-updated", handleVouchers);

    const params = new URLSearchParams(window.location.search);
    const sParam = params.get("service");
    if (sParam) {
      const decoded = decodeURIComponent(sParam);
      const catalog = getServiceCatalog();
      const match = catalog.find(
        (item) =>
          item.name.toLowerCase().includes(decoded.toLowerCase()) ||
          decoded.toLowerCase().includes(item.name.toLowerCase())
      );
      if (match) {
        setService(match.name as LaundryService);
      }
    }

    const vParam = params.get("voucher");
    if (vParam) {
      setVoucherInput(vParam.toUpperCase());
    }

    const u = getCurrentUser();
    if (u) {
      if (!name) setName(u.name);
      if (!phone) setPhone(u.phone);
      if (!address) setAddress(u.apartment || "");
    }

    const handleMenu = () => setCafeMenu(getCafeMenu());
    window.addEventListener("sachplus:menu-updated", handleMenu);

    return () => {
      window.removeEventListener("sachplus:vouchers-updated", handleVouchers);
      window.removeEventListener("sachplus:menu-updated", handleMenu);
    };
  }, []);

  const [cafeMenu, setCafeMenu] = useState<CafeMenuItem[]>(() => getCafeMenu());

  const availableCafeAddons = useMemo(() => {
    return cafeMenu
      .filter((c) => c.status !== "archived" && c.stock > 0)
      .slice(0, 6)
      .map((c) => ({
        id: c.id,
        name: c.name,
        price: c.price,
        note: c.note,
        stock: c.stock,
        unit: c.unit || "ly",
      }));
  }, [cafeMenu]);

  const fullCatalog = getServiceCatalog();
  const catalog = fullCatalog.filter((item) => item.status !== "archived");
  const basePrice = fullCatalog.find((item) => item.name === service)?.price ?? 69000;
  const currentExpress = EXPRESS_CONFIG[service] || EXPRESS_CONFIG["Giặt & sấy"];
  const expressFee = express ? currentExpress.fee : 0;
  const cafeTotal = availableCafeAddons
    .filter((item) => addons.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0);
  const cafeDiscount = addons.length > 0 ? Math.round(cafeTotal * 0.1) : 0;
  const subtotal = useMemo(
    () => basePrice + (cafeTotal - cafeDiscount) + expressFee,
    [basePrice, cafeTotal, cafeDiscount, expressFee]
  );
  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  const toggleAddon = (item: string) => {
    setAddons((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleApplyVoucher = (codeToApply?: string) => {
    const target = (codeToApply || voucherInput).trim().toUpperCase();
    if (!target) {
      toast.error("Vui lòng nhập mã ưu đãi.");
      return;
    }
    const result = validateVoucher(target, subtotal);
    if (result.valid && result.voucher) {
      setAppliedVoucher(result.voucher);
      setDiscountAmount(result.discountAmount);
      setVoucherInput(result.voucher.code);
      toast.success(result.message);
    } else {
      setAppliedVoucher(null);
      setDiscountAmount(0);
      toast.error(result.message);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherInput("");
    toast.info("Đã hủy áp dụng mã ưu đãi.");
  };

  const handleCreateOrder = () => {
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để nhân viên Sạch+ liên hệ xác nhận lấy đồ.");
      setStep(2);
      return;
    }

    const order = createLaundryOrder({
      service,
      pickupDate: date,
      pickupTime: time,
      journey,
      express,
      cafeTotal: cafeTotal - cafeDiscount,
      cafeItems: addons,
      voucherCode: appliedVoucher?.code,
      discountAmount,
      total,
      customerName: name || "Cư dân Vinhomes",
      customerPhone: phone,
      customerAddress: address,
    });

    setConfirmedId(order.id);
    toast.success(`Đã tạo đơn #${order.id} thành công!`);
  };

  if (confirmedId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-md border border-stone-200 shadow-xl p-8 md:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-4">
            <Check size={36} />
          </div>
          <p className="text-xs font-extrabold tracking-wider uppercase text-[#0284C7] mb-1">
            ĐẶT LỊCH THÀNH CÔNG
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Đơn #{confirmedId} đã được tiếp nhận
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto mt-2">
            Nhân viên Sạch+ Shophouse SH-08 sẽ liên hệ trong 5 phút để xác nhận khung giờ lấy đồ tại căn hộ của bạn.
          </p>

          <div className="bg-stone-50 rounded-md p-6 my-6 text-left grid grid-cols-1 md:grid-cols-3 gap-4 border border-stone-200">
            <div>
              <small className="text-xs text-stone-400 block font-semibold">Dịch vụ</small>
              <strong className="text-sm font-bold text-stone-900 block mt-0.5">
                {service}
              </strong>
              {express && (
                <span className="text-xs text-[#0284C7] font-bold block mt-0.5">
                  ⚡ {currentExpress.name} ({currentExpress.turnaround})
                </span>
              )}
            </div>
            <div>
              <small className="text-xs text-stone-400 block font-semibold">Khung giờ hẹn</small>
              <strong className="text-sm font-bold text-stone-900 block mt-0.5">
                {date.split("-").reverse().join("/")} · {time}
              </strong>
            </div>
            <div>
              <small className="text-xs text-stone-400 block font-semibold">Tổng thanh toán</small>
              <strong className="text-lg font-bold text-[#0284C7] block mt-0.5">
                {formatVnd(total)}
              </strong>
            </div>
          </div>

          <div className="p-4 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md text-xs text-[#0369A1] flex items-center justify-center gap-2 mb-6">
            <QrCode size={20} className="text-[#0369A1] shrink-0" />
            <span>
              Mã tem QR định danh: <b>{confirmedId}-SGPARK</b> (In tem dán túi đồ lúc shipper nhận đồ)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/don-cua-toi?orderId=${confirmedId}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-sm transition shadow-md inline-flex items-center justify-center gap-2"
            >
              Theo dõi tiến độ đơn hàng thời gian thực →
            </Link>
            <button
              type="button"
              onClick={() => {
                setConfirmedId(null);
                setStep(1);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-md text-sm transition"
            >
              Đặt thêm đơn khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Head */}
      <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-[#0284C7]">
            SẠCH+ LAUNDRY BOOKING
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mt-1">
            Đặt Lịch Lấy Đồ Tận Nơi
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Quy trình 3 bước tiện lợi cho cư dân Vinhomes Sài Gòn Park.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 self-center md:self-auto bg-white px-4 py-2 rounded-md border border-stone-200 shadow-xs">
          {[
            { num: 1, label: "Dịch vụ" },
            { num: 2, label: "Giao nhận" },
            { num: 3, label: "Xác nhận" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === s.num
                    ? "bg-[#0284C7] text-white"
                    : step > s.num
                    ? "bg-[#E0F2FE] text-[#0284C7]"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {step > s.num ? <Check size={14} /> : s.num}
              </span>
              <span className={`text-xs font-semibold ${step === s.num ? "text-stone-900" : "text-stone-400"}`}>
                {s.label}
              </span>
              {s.num < 3 && <span className="text-stone-300">/</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Step Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: CHỌN DỊCH VỤ */}
          {step === 1 && (
            <div className="bg-white rounded-md border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Shirt className="text-[#0284C7]" size={20} /> 1. Chọn dịch vụ giặt ủi
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Bảng giá công khai chuẩn niêm yết Shophouse Sạch+
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catalog.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setService(item.name as LaundryService)}
                    className={`p-4 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
                      service === item.name
                        ? "border-[#0284C7] bg-[#E0F2FE]/50 ring-2 ring-[#0284C7]/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                          {item.highlight}
                        </span>
                        <span className="text-xs font-bold text-stone-400">{item.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 mt-2">{item.name}</h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center">
                      <strong className="text-sm font-bold text-[#0369A1]">
                        {formatVnd(item.price)}
                      </strong>
                      <span className="text-[11px] text-stone-400">/ {item.unit}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Express toggle */}
              <div className="p-4 bg-[#F0F9FF]/60 border border-[#0284C7]/20 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-md bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center shrink-0">
                    <Zap size={18} />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5">
                      ⚡ {currentExpress.name}
                      <span className="bg-[#0284C7] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                        +{formatVnd(currentExpress.fee)}
                      </span>
                    </h5>
                    <p className="text-[11px] text-stone-600 mt-0.5">{currentExpress.note}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={express}
                  onChange={(e) => setExpress(e.target.checked)}
                  className="w-5 h-5 accent-[#0284C7] rounded cursor-pointer"
                />
              </div>

              {/* Action */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  Tiếp tục: Thông tin giao nhận <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: THÔNG TIN GIAO NHẬN */}
          {step === 2 && (
            <div className="bg-white rounded-md border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="text-[#0284C7]" size={20} /> 2. Hình thức & Khung giờ lấy đồ
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Shipper nội khu Vinhomes Sài Gòn Park nhận đồ tận sảnh hoặc cửa căn hộ
                </p>
              </div>

              {/* Journey selection */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">Hình thức giao nhận</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: "Lấy tại nhà → giao tận nhà", title: "Giao nhận tận nhà", desc: "Shipper lên tận cửa căn hộ nhận & trả đồ" },
                    { id: "Khách mang đến → giao tận nhà", title: "Tự mang đến SH-08", desc: "Bạn mang đến tiệm, Sạch+ giao trả tận nhà" },
                    { id: "Khách tự mang & tự lấy", title: "Tự mang & Tự lấy (Walk-in)", desc: "Trực tiếp ghé SH-08, uống café chờ lấy đồ" },
                  ].map((j) => (
                    <button
                      type="button"
                      key={j.id}
                      onClick={() => setJourney(j.id)}
                      className={`p-3 rounded-md border text-left transition cursor-pointer ${
                        journey === j.id
                          ? "bg-[#E0F2FE] border-[#0284C7] text-[#0369A1] font-bold"
                          : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-xs font-bold block">{j.title}</span>
                      <span className="text-[11px] text-stone-500 font-normal block mt-0.5">{j.desc}</span>
                    </button>
                  ))}
                </div>

                {journey === "Khách tự mang & tự lấy" && (
                  <div className="mt-3 p-3 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md text-xs text-[#0369A1] flex items-start gap-2.5">
                    <span className="text-base">💡</span>
                    <div>
                      <strong>Bạn cũng có thể ghé trực tiếp không cần đặt hẹn trước!</strong>
                      <p className="mt-0.5 text-[11px] text-[#0369A1] leading-relaxed">
                        Shophouse SH-08 (Tầng trệt) mở cửa 07:00 – 22:00 mỗi ngày. Bạn chỉ cần mang giỏ đồ đến quầy, nhân viên sẽ cân ký, in tem QR tức thì và mời bạn lên Lầu 1 thưởng thức cà phê giảm 10% trong lúc chờ giặt sấy lấy liền.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Ngày hẹn lấy đồ</label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Khung giờ hẹn</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
                  >
                    {TIME_SLOTS.map(slot => {
                      const used = getSlotCount(slot.value);
                      const remaining = totalWashers - used;
                      const isFull = remaining <= 0;
                      return (
                        <option key={slot.value} value={slot.value} disabled={isFull}>
                          {slot.value} ({slot.label}) · {isFull ? 'Hết slot' : `Còn ${remaining}/${totalWashers}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Thông tin liên hệ nhận đồ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">Họ tên người gửi</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Nguyễn Thành Trung"
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600 block mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="090..."
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">
                    Căn hộ / Tòa nhà tại Vinhomes
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: Landmark 81 · P.2805 hoặc Shophouse SH-08"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-md text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!phone.trim()) {
                      toast.error("Vui lòng nhập số điện thoại.");
                      return;
                    }
                    setStep(3);
                  }}
                  className="px-6 py-3 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-sm transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  Tiếp tục: Thêm đồ uống & Xác nhận <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: THÊM CAFÉ & XÁC NHẬN */}
          {step === 3 && (
            <div className="bg-white rounded-md border border-stone-200 p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Coffee className="text-[#0369A1]" size={20} /> 3. Đồ uống kèm theo (Giảm 10%)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Đặc quyền khách đặt dịch vụ giặt sấy: Giảm ngay 10% đồ uống tại quầy café lầu 1
                </p>
              </div>

              {/* Cafe Addons list — Dynamically loaded from Cafe Menu & Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableCafeAddons.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 col-span-3 text-center">
                    Hiện chưa có món đồ uống sẵn sàng phục vụ.
                  </p>
                ) : (
                  availableCafeAddons.map((c) => {
                    const selected = addons.includes(c.name);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleAddon(c.name)}
                        className={`p-3.5 rounded-md border text-left transition cursor-pointer flex flex-col justify-between ${
                          selected
                            ? "bg-[#F0F9FF] border-[#0284C7]/40 ring-2 ring-[#0284C7]/20"
                            : "bg-white border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-stone-900">{c.name}</span>
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                selected ? "bg-[#0284C7] text-white border-[#0284C7]" : "border-stone-300"
                              }`}
                            >
                              {selected && "✓"}
                            </span>
                          </div>
                          <small className="text-[11px] text-stone-500 block leading-tight">{c.note}</small>
                          <div className="mt-1">
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              Còn {c.stock} {c.unit}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-stone-100 flex items-baseline justify-between">
                          <strong className="text-xs text-[#0369A1] font-bold">{formatVnd(c.price)}</strong>
                          <span className="text-[10px] text-[#0284C7] font-semibold">-10%</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Mã ưu đãi & Voucher */}
              <div className="p-4 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5">
                    <Gift size={16} /> Mã ưu đãi / Voucher cư dân
                  </span>
                  {appliedVoucher && (
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-[11px] text-[#DC2626] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <X size={12} /> Hủy mã
                    </button>
                  )}
                </div>

                {appliedVoucher ? (
                  <div className="p-3 bg-white rounded border border-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 font-mono flex items-center gap-1">
                        <Check size={14} className="text-emerald-600" /> {appliedVoucher.code} · {appliedVoucher.title}
                      </span>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">
                        Đã giảm {formatVnd(discountAmount)} vào tổng hóa đơn
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      -{formatVnd(discountAmount)}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Nhập mã ưu đãi (VD: SACHPLUS30)..."
                        className="flex-1 px-3 py-2 text-xs uppercase font-mono bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyVoucher()}
                        className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded-md shadow-xs transition cursor-pointer"
                      >
                        Áp dụng
                      </button>
                    </div>

                    {/* Gợi ý voucher khả dụng */}
                    {availableVouchers.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-[#0284C7]/15">
                        <span className="text-[11px] text-stone-500 block mb-1.5 font-medium">Gợi ý mã đang có hiệu lực:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableVouchers.slice(0, 4).map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handleApplyVoucher(v.code)}
                              className="text-[11px] font-mono px-2 py-0.5 bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30 rounded font-bold transition cursor-pointer flex items-center gap-1"
                            >
                              <Tag size={10} /> {v.code}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Recap */}
              <div className="bg-stone-50 rounded-md p-5 border border-stone-200 space-y-3">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Tóm tắt lịch hẹn lấy đồ
                </h4>
                <div className="text-xs space-y-1.5 text-stone-600">
                  <div className="flex justify-between">
                    <span>Dịch vụ:</span>
                    <strong className="text-stone-900">{service}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lộ trình:</span>
                    <span className="text-stone-900">{journey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khung giờ:</span>
                    <span className="text-stone-900">{date.split("-").reverse().join("/")} · {time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Người gửi:</span>
                    <span className="text-stone-900">{name || "Cư dân"} · {phone}</span>
                  </div>
                  {address && (
                    <div className="flex justify-between">
                      <span>Căn hộ:</span>
                      <span className="text-stone-900">{address}</span>
                    </div>
                  )}
                  {express && (
                    <div className="flex justify-between text-[#0369A1] font-semibold">
                      <span>Phí {currentExpress.name}:</span>
                      <span>+{formatVnd(currentExpress.fee)}</span>
                    </div>
                  )}
                  {addons.length > 0 && (
                    <div className="flex justify-between text-[#0284C7] font-semibold">
                      <span>Ưu đãi đồ uống (-10%):</span>
                      <span>-{formatVnd(cafeDiscount)}</span>
                    </div>
                  )}
                  {appliedVoucher && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Ưu đãi Voucher [{appliedVoucher.code}]:</span>
                      <span>-{formatVnd(discountAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-md text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  className="px-8 py-3.5 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-sm transition flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  <PackageCheck size={18} /> Xác nhận đặt lịch ({formatVnd(total)})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Bill Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-md border border-stone-200 p-6 shadow-sm sticky top-24 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Chi phí tạm tính
            </h3>

            <div className="space-y-2.5 text-xs text-stone-600 border-b border-stone-100 pb-4">
              <div className="flex justify-between">
                <span>{service}</span>
                <strong className="text-stone-900">{formatVnd(basePrice)}</strong>
              </div>
              {express && (
                <div className="flex justify-between text-[#0369A1] font-semibold">
                  <span>⚡ {currentExpress.name}</span>
                  <span>+{formatVnd(currentExpress.fee)}</span>
                </div>
              )}
              {addons.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Café & Bánh ({addons.length} món)</span>
                    <span>{formatVnd(cafeTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#0284C7] font-bold">
                    <span>Ưu đãi khách giặt (-10%)</span>
                    <span>-{formatVnd(cafeDiscount)}</span>
                  </div>
                </>
              )}
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-stone-100">
                  <span>🎁 Voucher [{appliedVoucher.code}]</span>
                  <span>-{formatVnd(discountAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-bold text-stone-700">Tổng thanh toán:</span>
              <strong className="text-2xl font-bold text-[#0369A1]">
                {formatVnd(total)}
              </strong>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              * Thanh toán khi nhận đồ hoặc trừ tự động qua Ví Sạch+ Pay. Đơn hàng được cân kiểm định và chụp ảnh QC trước khi giặt.
            </p>

            <div className="p-3 bg-[#E0F2FE]/70 border border-[#E2E8F0] rounded-md text-[11px] text-[#0284C7] space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#0284C7]" /> Cam kết chất lượng:
              </span>
              <p>Bồi thường 100% giá trị nếu thất lạc hoặc hư hại đồ vải.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <SiteHeader />

      <div className="flex-1">
        <Suspense fallback={<div className="text-center py-20 text-stone-400">Đang tải trang đặt lịch...</div>}>
          <BookingContent />
        </Suspense>
      </div>

      <SiteFooter />
    </main>
  );
}
