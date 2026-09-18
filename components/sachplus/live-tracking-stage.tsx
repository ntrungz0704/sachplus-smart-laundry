"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Layers,
  MapPin,
  PackageCheck,
  Pause,
  Play,
  QrCode,
  RotateCw,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
  WashingMachine,
} from "lucide-react";

export interface TrackingStageInfo {
  id: string;
  name: string;
  badge: string;
  title: string;
  desc: string;
  metricLabel: string;
  metricVal: string;
  operator: string;
  timestamp: string;
}

const STAGES: TrackingStageInfo[] = [
  {
    id: "da-dat",
    name: "Đã đặt",
    badge: "BƯỚC 1/7 · TIẾP NHẬN ĐƠN",
    title: "Đơn #SP-240916 đã ghi nhận trên hệ thống",
    desc: "Tổng đài viên đã gán đơn cho Shipper nội khu tòa Landmark 81. Lịch hẹn lấy đồ đã được xác nhận vào lúc 08:30 sáng.",
    metricLabel: "Thời gian tiếp nhận",
    metricVal: "08:15 Sáng nay",
    operator: "Hệ thống tự động & Điều phối viên",
    timestamp: "08:15",
  },
  {
    id: "da-nhan",
    name: "Đã nhận",
    badge: "BƯỚC 2/7 · SHIPPER ĐÃ NHẬN ĐỒ",
    title: "Shipper Hoàng Nam đã nhận túi đồ tại sảnh",
    desc: "Nhân viên kiểm đếm sơ bộ số lượng, quét mã QR niêm phong giỏ đồ và đang di chuyển xe điện về Shophouse SH-08.",
    metricLabel: "Vị trí Shipper",
    metricVal: "Đang trên đường về SH-08 (cách 300m)",
    operator: "Shipper Hoàng Nam (0912.***.888)",
    timestamp: "08:32",
  },
  {
    id: "phan-loai",
    name: "Phân loại",
    badge: "BƯỚC 3/7 · PHÂN LOẠI & ĐỐI SOÁT",
    title: "Chuyên viên phân tách chất liệu vải & chụp ảnh",
    desc: "Phân chia riêng biệt đồ trắng, đồ màu, lụa cao cấp. Kiểm tra cúc áo, chụp ảnh lưu vết các vết ố trước khi vào lồng giặt.",
    metricLabel: "Khối lượng kiểm đếm",
    metricVal: "3.8 kg (14 món đồ)",
    operator: "KTV Thu Hà (Tổ Phân loại)",
    timestamp: "08:48",
  },
  {
    id: "dang-giat",
    name: "Đang giặt",
    badge: "BƯỚC 4/7 · GIẶT KHỬ KHUẨN ION 40°C",
    title: "Máy W-02 (18kg) đang vận hành chu trình sinh học",
    desc: "Cảm biến cân chỉnh lượng nước tự động, hòa tan nước giặt hữu cơ chiết xuất tự nhiên và tiệt trùng nước ở 40°C.",
    metricLabel: "Chu trình máy",
    metricVal: "Máy W-02 · 850 vòng/phút (Còn 24p)",
    operator: "Máy giặt công nghiệp LG Commercial",
    timestamp: "09:05",
  },
  {
    id: "dang-say",
    name: "Đang sấy",
    badge: "BƯỚC 5/7 · SẤY TIỆT TRÙNG NHIỆT 65°C",
    title: "Máy D-01 đang sấy đảo chiều chống nhăn",
    desc: "Luồng khí nóng 65°C đối lưu liên tục tiêu diệt 99.9% vi khuẩn, mạt bụi và làm tơi xốp từng thớ sợi bông mềm mại.",
    metricLabel: "Nhiệt độ buồng sấy",
    metricVal: "65°C tiêu chuẩn y tế (Còn 18p)",
    operator: "Máy sấy công nghiệp Speed Queen",
    timestamp: "09:40",
  },
  {
    id: "qc-dong-goi",
    name: "QC & Gói",
    badge: "BƯỚC 6/7 · KIỂM ĐỊNH QC & GẤP GỌN",
    title: "Kiểm tra 5 tiêu chí & đóng gói màng thở Eco",
    desc: "Chuyên viên QC soi đèn kiểm tra sạch vết ố, gấp phẳng phiu, ủ tinh dầu hoa oải hương Pháp và niêm phong tem QR chống mở.",
    metricLabel: "Tiêu chuẩn đóng gói",
    metricVal: "Đạt 100% chuẩn QC 5 Sao",
    operator: "Trưởng ca kiểm định Minh Thư",
    timestamp: "10:15",
  },
  {
    id: "giao-do",
    name: "Giao đồ",
    badge: "BƯỚC 7/7 · GIAO TẬN CĂN HỘ",
    title: "Shipper đang giao đồ sạch thơm tới cửa nhà bạn",
    desc: "Quần áo đã tinh tươm thơm ngát, shipper bấm chuông bàn giao tận tay và khách quét mã QR để xác nhận hoàn tất.",
    metricLabel: "Dự kiến bàn giao",
    metricVal: "Hôm nay lúc 11:00 (Đúng hẹn)",
    operator: "Shipper Thành Trung (0908.***.999)",
    timestamp: "10:45",
  },
];

export function LiveTrackingStage() {
  const [activeStep, setActiveStep] = useState(3); // Mặc định hiển thị Đang giặt
  const [isPlaying, setIsPlaying] = useState(true);

  // Tự động chuyển đổi bước chuyển động vô hạn nếu bật isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = STAGES[activeStep];

  return (
    <div className="w-full bg-white rounded-md border border-[#E2E8F0] shadow-xl shadow-[#0284C7]/5 p-6 md:p-8 overflow-hidden max-w-full">
      {/* 1. Header widget */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold uppercase rounded-full border border-[#E2E8F0]/80">
              <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" />
              THEO DÕI THỜI GIAN THỰC (LIVE)
            </span>
            <span className="text-xs font-bold text-stone-400">· Đơn mẫu cư dân</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight mt-1.5">
            Đơn #SP-240916 · Giặt sấy & Gấp gọn
          </h2>
        </div>

        {/* Trạng thái tự động cập nhật thời gian thực */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tự động cập nhật thời gian thực
          </span>
        </div>
      </div>

      {/* 2. Interactive Timeline 7 Bước */}
      <div className="py-6 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]">
        <div className="flex items-start sm:items-center justify-between w-full relative min-w-full sm:min-w-[620px] px-4 sm:px-10">
          {/* Đường ray tiến độ */}
          <div className="absolute left-[34px] right-[34px] sm:left-[58px] sm:right-[58px] top-[18px] h-1 bg-stone-100 -z-0" />
          <div
            className="absolute left-[34px] sm:left-[58px] top-[18px] h-1 bg-[#0284C7] transition-all duration-500 -z-0 max-w-[calc(100%-68px)] sm:max-w-[calc(100%-116px)]"
            style={{ width: `${(activeStep / (STAGES.length - 1)) * 100}%` }}
          />

          {STAGES.map((s, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                }}
                className={`relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none transition-transform w-9 sm:w-auto ${
                  isCurrent ? "scale-110" : "hover:scale-105"
                }`}
              >
                <div
                  className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-extrabold transition shadow-sm ${
                    isCurrent
                      ? "bg-[#0284C7] text-white ring-4 ring-[#E0F2FE] ring-offset-2 scale-110"
                      : isDone
                      ? "bg-[#0284C7] text-white"
                      : "bg-white border-2 border-stone-200 text-stone-400 group-hover:border-[#0284C7]"
                  }`}
                >
                  {isDone ? <Check size={16} /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold mt-2 whitespace-nowrap transition hidden sm:block ${
                    isCurrent
                      ? "text-[#0284C7] font-extrabold"
                      : isDone
                      ? "text-stone-700 font-semibold"
                      : "text-stone-400"
                  }`}
                >
                  {s.name}
                </span>
                <small className="text-[10px] text-stone-400 hidden sm:block">{s.timestamp}</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Split Layout: Thông Tin Bên Trái & KHUNG HÌNH CHUYỂN ĐỘNG VÔ HẠN Bên Phải */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-center">
        {/* Cột trái: Chi tiết bước hiện tại */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-block px-3 py-1 bg-[#E0F2FE]/70 text-[#0284C7] text-[11px] font-extrabold rounded-lg tracking-wider">
            {current.badge}
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 leading-snug">
            {current.title}
          </h3>

          <p className="text-stone-600 text-sm leading-relaxed">
            {current.desc}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-stone-50 border border-stone-100 rounded-md">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                {current.metricLabel}
              </span>
              <strong className="text-sm font-extrabold text-stone-900 block mt-1">
                {current.metricVal}
              </strong>
            </div>

            <div className="p-3.5 bg-stone-50 border border-stone-100 rounded-md">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Người phụ trách
              </span>
              <strong className="text-sm font-extrabold text-stone-900 block mt-1 truncate">
                {current.operator}
              </strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#0284C7]" /> Cập nhật lần cuối: {current.timestamp} hôm nay
            </span>
            <Link
              href="/don-cua-toi"
              className="text-[#0284C7] hover:text-[#0284C7] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Xem trang đơn của tôi →
            </Link>
          </div>
        </div>

        {/* Cột phải: KHUNG HÌNH CHUYỂN ĐỘNG VÔ HẠN (INFINITE MOTION VISUAL) */}
        <div className="lg:col-span-6">
          <div className="w-full h-72 md:h-80 rounded-md bg-gradient-to-br from-[#E0F2FE] via-stone-50 to-[#E0F2FE]/50 border border-[#E2E8F0] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* STAGE 0: ĐÃ ĐẶT (Order Placed - Phone & Bell Waves) */}
            {activeStep === 0 && (
              <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-90 duration-300">
                <div className="relative mb-4">
                  {/* Glowing halo pulse */}
                  <div className="absolute inset-0 rounded-full bg-[#0284C7]/25 blur-xl animate-ping" />
                  <div className="w-24 h-24 rounded-md bg-gradient-to-tr from-[#0284C7] to-[#0284C7] text-white flex items-center justify-center shadow-xl shadow-[#0284C7]/25 relative z-10">
                    <QrCode size={46} className="animate-pulse" />
                  </div>
                  {/* Ringing Bell Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-md animate-bounce z-20">
                    <Bell size={16} />
                  </div>
                </div>
                <strong className="text-base font-extrabold text-stone-800">
                  Mã đơn #SP-240916 đã tạo
                </strong>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Hệ thống phân bổ tự động đến shipper nội khu gần sảnh nhất
                </p>
                <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-[#E2E8F0] text-xs font-bold text-[#0284C7]">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping" /> Đã kết nối tổng đài
                </div>
              </div>
            )}

            {/* STAGE 1: ĐÃ NHẬN (Shipper on Bike Infinite Road Motion) */}
            {activeStep === 1 && (
              <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-300">
                <div className="relative w-48 h-32 flex items-center justify-center mb-2">
                  {/* Road ground line with infinite moving stripes */}
                  <div className="absolute bottom-4 left-0 right-0 h-1 bg-stone-300 overflow-hidden">
                    <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#0284C7_0px,#0284C7_20px,transparent_20px,transparent_40px)] animate-[road-scroll_0.8s_linear_infinite]" />
                  </div>

                  {/* Scooter with bouncing motion */}
                  <div className="relative z-10 animate-[bounce_1.2s_infinite]">
                    <div className="w-24 h-20 rounded-md bg-gradient-to-tr from-[#0284C7] to-[#0284C7] text-white flex items-center justify-center shadow-lg shadow-[#0284C7]/30 relative">
                      <Truck size={42} className="text-white" />
                      {/* Laundry basket on back */}
                      <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-[#0284C7] text-stone-900 rounded text-[10px] font-black uppercase">
                        Giỏ đồ
                      </span>
                    </div>
                  </div>

                  {/* GPS Waves */}
                  <div className="absolute top-2 right-4 flex items-center gap-1">
                    <MapPin size={18} className="text-[#DC2626] animate-bounce" />
                    <span className="w-3 h-3 rounded-full bg-[#DC2626]/40 animate-ping" />
                  </div>
                </div>

                <strong className="text-base font-extrabold text-stone-800">
                  Shipper đang di chuyển về tiệm
                </strong>
                <p className="text-xs text-stone-500 mt-1">
                  Đã niêm phong túi giặt mã QR lúc 08:32 tại sảnh Landmark
                </p>
              </div>
            )}

            {/* STAGE 2: PHÂN LOẠI (Sorting Fabrics & Camera Flash) */}
            {activeStep === 2 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-4">
                  {/* Bin 1: White */}
                  <div className="w-16 h-20 rounded-md bg-white border-2 border-stone-200 shadow-sm flex flex-col items-center justify-center p-2 animate-[pulse_2s_infinite]">
                    <Shirt size={22} className="text-stone-400" />
                    <span className="text-[10px] font-black text-stone-600 mt-1">Đồ trắng</span>
                  </div>
                  {/* Bin 2: Colors (Active highlighted) */}
                  <div className="w-20 h-24 rounded-md bg-gradient-to-b from-[#0284C7] to-[#0369A1] text-white shadow-xl shadow-[#0284C7]/25 flex flex-col items-center justify-center p-2 transform scale-105 animate-bounce">
                    <Shirt size={28} className="text-white" />
                    <span className="text-[11px] font-black mt-1">Đồ màu</span>
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full mt-0.5">3.8 kg</span>
                  </div>
                  {/* Bin 3: Delicate Silk */}
                  <div className="w-16 h-20 rounded-md bg-[#F0F9FF] border-2 border-[#0284C7]/20 shadow-sm flex flex-col items-center justify-center p-2 animate-[pulse_2s_infinite]">
                    <Layers size={22} className="text-[#0284C7]" />
                    <span className="text-[10px] font-black text-[#0369A1] mt-1">Lụa cao cấp</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Camera size={15} className="text-[#0284C7] animate-pulse" />
                  <span className="text-xs font-bold text-stone-700">Chụp 4 góc ảnh đối soát trước giặt</span>
                </div>
              </div>
            )}

            {/* STAGE 3: ĐANG GIẶT (Infinite 3D Spinning Washing Drum with Bubbles) */}
            {activeStep === 3 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                {/* 3D Circular Washing Drum with infinite rotation */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-stone-800 to-stone-950 p-2.5 shadow-2xl shadow-[#0284C7]/30 flex items-center justify-center mb-3">
                  {/* Glowing circular rim */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#0284C7]/40 animate-ping opacity-30" />
                  
                  {/* Rotating drum window */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0284C7]/80 via-[#0284C7] to-[#0369A1] relative overflow-hidden flex items-center justify-center">
                    {/* Water waves swirling inside */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-[spin_3s_linear_infinite]" />
                    
                    {/* Drum holes rotating */}
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/40 animate-[spin_2s_linear_infinite] flex items-center justify-center">
                      {/* Clothes tumbling inside */}
                      <Shirt size={30} className="text-white animate-[spin_1.5s_linear_infinite]" />
                    </div>

                    {/* Water bubbles floating */}
                    <div className="absolute w-3 h-3 rounded-full bg-white/70 top-4 left-6 animate-[ping_1.5s_infinite]" />
                    <div className="absolute w-2 h-2 rounded-full bg-white/80 bottom-5 right-7 animate-[ping_1s_infinite]" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-ping" />
                  <strong className="text-sm font-extrabold text-stone-800">
                    Máy W-02 · Vòng quay 850 RPM
                  </strong>
                </div>
                <p className="text-[11px] text-[#0284C7] font-bold mt-0.5">
                  Nước giặt sinh học ion · Diệt 99% vi khuẩn tại 40°C
                </p>
              </div>
            )}

            {/* STAGE 4: ĐANG SẤY (Infinite Hot Dryer Tumble with Heat Waves) */}
            {activeStep === 4 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                {/* Hot Dryer Drum */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-[#0369A1] to-stone-900 p-2.5 shadow-2xl shadow-[#0284C7]/900/30 flex items-center justify-center mb-3">
                  {/* Heat waves rising */}
                  <div className="absolute -top-3 flex items-center gap-1 text-[#F59E0B] animate-bounce">
                    <Flame size={16} />
                    <span className="text-[10px] font-black uppercase">65°C HOT</span>
                  </div>

                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0284C7] via-orange-500 to-[#0284C7] relative overflow-hidden flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/50 animate-[spin_3s_linear_infinite] flex items-center justify-center">
                      <Shirt size={32} className="text-white animate-[spin_2s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                <strong className="text-sm font-extrabold text-stone-800">
                  Sấy tiệt trùng nhiệt độ cao 65°C
                </strong>
                <p className="text-[11px] text-[#0369A1] font-bold mt-0.5">
                  Đảo chiều liên tục · Làm tơi xốp và chống nhăn vải
                </p>
              </div>
            )}

            {/* STAGE 5: QC & GÓI (Laser Scanning & Folding Package) */}
            {activeStep === 5 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                <div className="relative w-40 h-32 rounded-md bg-white border-2 border-[#E2E8F0] shadow-xl flex flex-col items-center justify-center p-3 mb-3 overflow-hidden">
                  {/* Laser Scanning Bar moving vertically back and forth */}
                  <div className="absolute left-0 right-0 h-1 bg-[#0284C7] shadow-[0_0_12px_#0284C7] animate-[laser-scan_2s_ease-in-out_infinite] rounded-full" />
                  
                  {/* Folded shirts stack */}
                  <div className="space-y-1 w-full px-2">
                    <div className="h-4 bg-[#E0F2FE] rounded-md w-full" />
                    <div className="h-4 bg-[#F0F9FF] rounded-md w-4/5 mx-auto" />
                    <div className="h-4 bg-[#E0F2FE] rounded-md w-full" />
                  </div>

                  {/* QC Verified Stamp */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#0284C7] text-white text-[9px] font-black rounded-md flex items-center gap-1 shadow">
                    <Check size={10} /> QC PASSED
                  </div>
                </div>

                <strong className="text-sm font-extrabold text-stone-800">
                  Ủ hương Lavender & Niêm phong Eco
                </strong>
                <p className="text-[11px] text-[#0284C7] font-bold mt-0.5">
                  Kiểm tra sạch 100% · Dán tem niêm phong mã QR
                </p>
              </div>
            )}

            {/* STAGE 6: GIAO ĐỒ (Doorstep Delivery Handover) */}
            {activeStep === 6 && (
              <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-md bg-gradient-to-tr from-[#0284C7] to-[#0284C7] text-white flex items-center justify-center shadow-xl shadow-[#0284C7]/25 relative animate-bounce">
                    <PackageCheck size={48} className="text-white" />
                  </div>
                  {/* Sparkles */}
                  <Sparkles size={20} className="absolute -top-2 -right-2 text-[#0284C7] animate-spin" />
                  <Sparkles size={16} className="absolute -bottom-1 -left-2 text-[#0284C7] animate-pulse" />
                </div>

                <strong className="text-sm font-extrabold text-stone-800">
                  Bàn giao tận cửa căn hộ Landmark 81
                </strong>
                <p className="text-[11px] text-[#0284C7] font-bold mt-0.5">
                  Đồ sạch thơm phẳng phiu · Đánh giá 5.0 ★★★★★
                </p>
              </div>
            )}

            {/* Micro bottom controls */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveStep((prev) => (prev === 0 ? STAGES.length - 1 : prev - 1));
                  setIsPlaying(false);
                }}
                className="w-7 h-7 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 cursor-pointer shadow-xs"
                title="Bước trước"
              >
                <ChevronLeft size={15} />
              </button>
              
              <span className="text-[10px] font-bold text-stone-400">
                Bấm vào các nấc để đổi bước chuyển động
              </span>

              <button
                type="button"
                onClick={() => {
                  setActiveStep((prev) => (prev + 1) % STAGES.length);
                  setIsPlaying(false);
                }}
                className="w-7 h-7 rounded-full bg-white/80 border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 cursor-pointer shadow-xs"
                title="Bước kế tiếp"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}