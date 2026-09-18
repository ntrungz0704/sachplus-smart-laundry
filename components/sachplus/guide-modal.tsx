"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Flame,
  Layers,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface GuideArticle {
  id: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  author: string;
  serviceTarget: string;
  steps: {
    title: string;
    detail: string;
  }[];
  expertTip: string;
}

export const GUIDE_ARTICLES: Record<string, GuideArticle> = {
  "01": {
    id: "checklist-rem-chan-ga",
    number: "01",
    category: "CHĂM SÓC NHÀ CỬA",
    title: "Checklist bảo quản rèm & chăn ga mùa mưa",
    summary: "Bí quyết sấy tiệt trùng chống ẩm mốc và tích tụ vi khuẩn cho đồ vải kích thước lớn trong các căn hộ chung cư cao tầng.",
    readTime: "3 phút đọc",
    author: "Chuyên viên Nguyễn Minh (Tổ giặt ủi Sạch+ SH-08)",
    serviceTarget: "Chăn mền ga gối",
    steps: [
      {
        title: "Bước 1: Hút bụi sơ bộ & kiểm tra vết ố vàng",
        detail: "Trước khi giặt, cần kiểm tra các góc mép rèm cửa và mặt dưới ga giường. Các vết ố vàng do mồ hôi hoặc ẩm mốc được bôi dung dịch sinh học chuyên dụng để làm mềm vết bẩn.",
      },
      {
        title: "Bước 2: Giặt nước nóng 60°C trong lồng giặt 25kg",
        detail: "Chăn bông và rèm vải dày cần lồng giặt công nghiệp dung tích lớn để có đủ khoảng không đập xả. Nước nóng 60°C giúp loại bỏ 100% mạt bụi bám sâu trong sợi bông.",
      },
      {
        title: "Bước 3: Sấy đối lưu nhiệt độ cao 65°C",
        detail: "Mùa mưa độ ẩm không khí lên tới 85%, phơi thông thường sẽ làm đồ bị hôi chua và nấm mốc phát triển. Máy sấy đảo chiều Speed Queen sấy khô triệt để và làm tơi xốp lông vũ.",
      },
      {
        title: "Bước 4: Đóng gói hút chân không kèm túi hút ẩm",
        detail: "Sau khi nguội, chăn ga được ép màng bảo quản kín khí kèm gói tinh dầu lavender chống mối mọt, dễ dàng cất trữ trong tủ đến 6 tháng mà không lo ẩm mốc.",
      },
    ],
    expertTip: "Tuyệt đối không nhồi nhét chăn ga quá nặng vào máy giặt gia đình 7-9kg vì máy không thể đảo và dễ làm gãy trục máy hoặc rách ruột bông.",
  },
  "02": {
    id: "cach-giat-so-mi-lua",
    number: "02",
    category: "THỜI TRANG CAO CẤP",
    title: "Cách giặt áo sơ mi & đầm lụa cao cấp",
    summary: "Tại sao công nghệ giặt hấp sinh học giúp giữ form áo và màu vải bền gấp 3 lần so với giặt nước thông thường.",
    readTime: "4 phút đọc",
    author: "KTV Lê Thu Trang (Chuyên gia Phân loại Sạch+)",
    serviceTarget: "Giặt hấp Eco",
    steps: [
      {
        title: "Bước 1: Phân loại theo cấu trúc sợi vải và màu sắc",
        detail: "Lụa tơ tằm, chiffon, len cashmere và áo vest dạ tuyệt đối không được giặt chung với quần áo cotton thường để tránh ma sát gây xù lông hoặc lem màu.",
      },
      {
        title: "Bước 2: Xử lý điểm cục bộ cổ áo và cổ tay",
        detail: "Kỹ thuật viên dùng cọ lông mềm kết hợp dung dịch hữu cơ chiết xuất cam chanh để hòa tan vết dầu nhờn ở cổ áo sơ mi mà không làm xơ rách viền vải.",
      },
      {
        title: "Bước 3: Giặt hấp công nghệ dung môi sinh học Eco",
        detail: "Dung môi sinh học không chứa hóa chất PERC độc hại, len lỏi qua từng sợi vải để làm sạch mà không làm nở sợi, giữ nguyên độ rũ và bóng mượt của tơ tằm.",
      },
      {
        title: "Bước 4: Thổi form 3D bằng hơi nước áp suất cao",
        detail: "Áo được đưa lên mannequin bơm hơi nóng để vuốt phẳng nếp nhăn tự nhiên, cúc áo được bọc màng bảo vệ không bị trầy xước.",
      },
    ],
    expertTip: "Nên giặt hấp định kỳ 2-3 tuần/lần cho các trang phục công sở đắt tiền để kéo dài tuổi thọ trang phục thay vì giặt nước làm phai màu và mất dáng áo.",
  },
  "03": {
    id: "ve-sinh-giay-the-thao",
    number: "03",
    category: "CHĂM SÓC GIÀY SNEAKER",
    title: "Vệ sinh giày thể thao không bong keo",
    summary: "Quy trình làm sạch bọt khô và chiếu đèn UV diệt khuẩn chuyên sâu dành cho giày sneaker đắt tiền của cư dân năng động.",
    readTime: "3 phút đọc",
    author: "KTV Vũ Tuấn (Tổ Chăm sóc Giày & Túi Sạch+)",
    serviceTarget: "Giày & túi",
    steps: [
      {
        title: "Bước 1: Tháo rời dây và lót giày ngâm bọt diệt khuẩn",
        detail: "Lót giày là nơi tích tụ nhiều mồ hôi và vi khuẩn gây mùi nhất, được xử lý riêng bằng dung dịch kháng khuẩn ion bạc để khử mùi tận gốc.",
      },
      {
        title: "Bước 2: Chà bọt khô hữu cơ chiết xuất dầu dừa",
        detail: "Dùng bàn chải lông ngựa mềm chà bọt khô trên upper (thân giày). Phương pháp bọt khô giảm thiểu tối đa việc ngâm nước, bảo vệ lớp keo đế giày tuyệt đối.",
      },
      {
        title: "Bước 3: Chiếu đèn cực tím UV-C diệt khuẩn 15 phút",
        detail: "Giày được đặt vào buồng khử khuẩn tia UV-C bước sóng 254nm, tiêu diệt 99.9% vi nấm gây bệnh da chân và mùi hôi mà mắt thường không thấy.",
      },
      {
        title: "Bước 4: Sấy gió đối lưu nhiệt độ phòng 35°C",
        detail: "Nhiệt độ sấy được kiểm soát chặt chẽ ở 35°C để không làm giòn cao su đế giày hay co rút form vải flyknit/da lộn.",
      },
    ],
    expertTip: "Tuyệt đối không bỏ giày vào máy sấy nhiệt độ cao hoặc phơi nắng gắt buổi trưa vì nhiệt độ trên 50°C sẽ làm chảy keo dán đế và ố vàng phần mút xốp eva.",
  },
};

export function GuideModal({
  articleNumber,
  open,
  onOpenChange,
}: {
  articleNumber: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!articleNumber || !GUIDE_ARTICLES[articleNumber]) return null;
  const art = GUIDE_ARTICLES[articleNumber];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white rounded-md border border-stone-200 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header có dải màu tươi sáng */}
        <div className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white p-6 md:p-8 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold tracking-wider uppercase">
              {art.category}
            </span>
            <span className="text-white/80 text-xs flex items-center gap-1">
              <Clock size={13} /> {art.readTime}
            </span>
          </div>

          <DialogTitle className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
            {art.title}
          </DialogTitle>

          <p className="text-[#E0F2FE] text-xs md:text-sm mt-2 leading-relaxed">
            {art.summary}
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 text-xs text-[#E0F2FE]">
            <User size={14} />
            <span>Biên soạn bởi: <strong>{art.author}</strong></span>
          </div>
        </div>

        {/* Nội dung các bước cuộn được */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-[#0284C7]" /> QUY TRÌNH TIÊU CHUẨN TẠI SẠCH+
            </h4>

            {art.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-md bg-stone-50 border border-stone-100 hover:border-[#E2E8F0] transition">
                <div className="w-7 h-7 rounded-md bg-[#0284C7] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <strong className="text-sm font-extrabold text-stone-900 block mb-1">
                    {step.title}
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lời khuyên chuyên gia */}
          <div className="p-4 rounded-md bg-[#F0F9FF]/80 border border-[#0284C7]/20/80 text-[#0369A1] flex items-start gap-3">
            <Sparkles size={20} className="text-[#0284C7] shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="font-extrabold block text-[#0369A1] mb-0.5">Lời khuyên từ chuyên gia Sạch+:</strong>
              <p className="text-[#0369A1] leading-relaxed">{art.expertTip}</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 md:p-6 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 rounded-md text-xs font-bold text-stone-600 hover:bg-stone-200/70 transition cursor-pointer"
          >
            Đóng cẩm nang
          </button>

          <Link
            href={`/book?service=${encodeURIComponent(art.serviceTarget)}`}
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0284C7] text-white text-xs font-bold rounded-md shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            Đặt dịch vụ {art.serviceTarget} ngay <ArrowRight size={14} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}