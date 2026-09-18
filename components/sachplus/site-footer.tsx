import Link from "next/link";
import { Clock3, Coffee, MapPin, Phone, ShieldCheck, UserCheck, WashingMachine, Wrench } from "lucide-react";

import { Logo } from "@/components/sachplus/logo";

export function SiteFooter() {
  return (
    <footer className="site-footer bg-[#0F172A] border-t border-slate-800">
      <div>
        <div className="mb-3">
          <Logo size="lg" inverted={true} href="/" />
        </div>
        <p>
          Hệ sinh thái dịch vụ tích hợp dành riêng cho cư dân Vinhomes Sài Gòn Park. Tầng trệt giặt ủi tự động & vật tư tiện ích, lầu 1 café làm việc & thư giãn.
        </p>
        <div className="flex items-center gap-3 mt-4 text-xs text-[#0284C7]">
          <span className="flex items-center gap-1"><WashingMachine size={15} /> Giặt ủi tự động</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Coffee size={15} /> Đồ uống ngon</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Wrench size={15} /> Vật tư tiện ích</span>
        </div>
      </div>

      <div>
        <h3>Khách hàng</h3>
        <Link href="/#services">4 Dịch vụ chính</Link>
        <Link href="/#floor-explorer">Mô hình 2 tầng Shophouse</Link>
        <Link href="/cafe">Thực đơn Sạch+ Café</Link>
        <Link href="/don-cua-toi">Theo dõi đơn thời gian thực</Link>
        <Link href="/vi-va-uu-dai">Ví Sạch+ & Hội viên Vàng</Link>
      </div>

      <div>
        <h3>Cổng Chuyên Nghiệp</h3>
        <Link href="/quay/quan-ly-don" className="flex items-center gap-1.5 text-[#0284C7]">
          <UserCheck size={14} /> Cổng Vận hành Staff (Kanban)
        </Link>
        <Link href="/admin" className="flex items-center gap-1.5 text-[#0284C7]">
          <ShieldCheck size={14} /> Cổng Báo cáo Owner (Analytics)
        </Link>
        <Link href="/#guide">Cẩm nang cư dân nội khu</Link>
        <Link href="/vi-va-uu-dai">Chỉ số Giặt Xanh (Eco Impact)</Link>
      </div>

      <div>
        <h3>Shophouse Sạch+ SG Park</h3>
        <p><MapPin size={16} className="text-[#0284C7] shrink-0" /> Shophouse SH-08, Vinhomes Sài Gòn Park, Xuân Thới Sơn, TP.HCM</p>
        <p><Clock3 size={16} className="text-[#0284C7] shrink-0" /> Mở cửa: 07:00 – 22:00 (Cả ngày lễ)</p>
        <p><Phone size={16} className="text-[#0284C7] shrink-0" /> Hotline giao nhận: 1900 6868</p>
      </div>

      <small className="pt-4">
        © 2026 Sạch+ Smart Laundry & Coffee · Vinhomes Sài Gòn Park. A Small Space, A Bigger Life.
      </small>
    </footer>
  );
}
