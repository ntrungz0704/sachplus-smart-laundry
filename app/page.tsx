"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Coffee,
  Droplet,
  Flame,
  Layers,
  MapPin,
  PackageCheck,
  QrCode,
  Recycle,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  WashingMachine,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { formatVnd, serviceCatalog } from "@/lib/sachplus-data";
import { LiveTrackingStage } from "@/components/sachplus/live-tracking-stage";

const serviceIcons = [Shirt, Sparkles, BedDouble, ShoppingBag];

const processSteps = [
  ["01", "Đặt lịch hẹn", "Chọn dịch vụ và khung giờ lấy đồ qua app/web trong 30 giây."],
  ["02", "Nhận đồ tận cửa", "Nhân viên kiểm đếm, chụp ảnh đối soát và dán tem mã QR định danh."],
  ["03", "Giặt sấy công nghệ", "Chăm sóc theo từng chất liệu vải, tiệt trùng nhiệt và theo dõi realtime."],
  ["04", "Giao tận căn hộ", "Kiểm tra QC kỹ lưỡng, đóng gói niêm phong và giao tận tay bạn."],
];

export default function Home() {
  const [activeFloor, setActiveFloor] = useState<"ground" | "first">("ground");

  return (
    <main className="overflow-x-hidden">
      <SiteHeader />

      {/* 1. HERO SECTION */}
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> VINHOMES SÀI GÒN PARK · TIỆN LỢI MỖI NGÀY
          </p>
          <h1>
            Giặt sạch.<br />
            Uống ngon.<br />
            <em className="shiny-text">Sống nhẹ hơn.</em>
          </h1>
          <p className="hero-lead">
            Hệ sinh thái Smart Laundry & Coffee 2 tầng chuẩn sống hiện đại. Tầng trệt giặt sấy tự động & kệ vật tư tiện ích; Lầu 1 café làm việc thư thái với Wi-Fi tốc độ cao.
          </p>

          <div className="hero-actions">
            <Link href="/dat-lich" className="button button-primary cursor-pointer">
              Đặt lịch lấy đồ <ArrowRight size={18} />
            </Link>
            <a className="button button-ghost cursor-pointer" href="#two-ways">
              2 Cách gửi đồ tiện lợi
            </a>
          </div>

          <div className="hero-meta">
            <span>
              <Clock3 size={17} /> 07:00 – 22:00 mỗi ngày
            </span>
            <span>
              <MapPin size={17} /> Shophouse SH-08 Vinhomes Sài Gòn Park
            </span>
          </div>
        </div>

        <div className="hero-visual relative">
          {/* ReactBits Ambient Floating Bubbles */}
          <div className="floating-bubble absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#0284C7]/20 backdrop-blur-sm border border-[#0284C7]/30 pointer-events-none z-10 hidden sm:block" />
          <div className="floating-bubble-delayed absolute -bottom-6 -right-3 w-16 h-16 rounded-full bg-[#0284C7]/20 backdrop-blur-sm border border-[#0284C7]/30 pointer-events-none z-10 hidden sm:block" />

          <div className="photo-frame">
            <Image
              src="/vinhomes-concept-real.jpg"
              alt="Phối cảnh 3D mặt cắt thực tế mô hình 2 tầng Sạch+ Laundry và Coffee tại Vinhomes Saigon Park"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <div className="photo-badge">
              <strong>4.9</strong>
              <span>
                ★★★★★<br />
                Đánh giá cư dân
              </span>
            </div>
          </div>

          <aside className="quick-book">
            <div className="quick-book-head">
              <div>
                <span>ĐẶT NHANH 1-CHẠM</span>
                <h2>Giao nhận nội khu</h2>
              </div>
              <span className="open-pill">Đang mở cửa</span>
            </div>
            <div className="quick-service">
              <span>
                <Shirt size={20} />
              </span>
              <div>
                <small>DỊCH VỤ PHỔ BIẾN</small>
                <strong>Giặt sấy tiệt trùng · từ 69K</strong>
              </div>
              <Check size={18} className="text-[#0284C7]" />
            </div>
            <div className="quick-route">
              <span>
                <MapPin size={15} /> Lấy tại sảnh căn hộ
              </span>
              <ArrowRight size={14} />
              <span>
                <Truck size={15} /> Giao lại tận cửa
              </span>
            </div>
            <Link href="/dat-lich" className="w-full block">
              <button type="button" className="w-full cursor-pointer">
                Chọn giờ lấy đồ ngay <ArrowRight size={18} />
              </button>
            </Link>
            <p>Freeship nội khu cho thành viên hạng Vàng & Kim Cương.</p>
          </aside>
        </div>
      </section>

      {/* 2. INTERACTIVE 2-FLOOR ARCHITECTURAL EXPLORER */}
      <section className="floor-explorer-section" id="floor-explorer">
        <div className="floor-explorer-head">
          <div>
            <p className="kicker">MÔ HÌNH THỰC TẾ 2 TẦNG</p>
            <h2>A Small Space, A Bigger Life.</h2>
          </div>
          <div className="floor-tabs-bar">
            <button
              className={`floor-tab-btn ${activeFloor === "ground" ? "active" : ""}`}
              onClick={() => setActiveFloor("ground")}
            >
              <WashingMachine size={17} /> Tầng Trệt: Giặt & Đồ uống
            </button>
            <button
              className={`floor-tab-btn ${activeFloor === "first" ? "active" : ""}`}
              onClick={() => setActiveFloor("first")}
            >
              <Coffee size={17} /> Lầu 1: Café & Seating
            </button>
          </div>
        </div>

        <div className="floor-explorer-body">
          <div className="floor-visual-wrapper">
            <Image
              src="/vinhomes-concept-real.jpg"
              alt="Mô hình mặt cắt shophouse Sạch+ Vinhomes Sài Gòn Park"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={activeFloor === "first" ? "scale-110 object-top" : "scale-105 object-bottom"}
            />
            <div className="floor-tag-badge">
              {activeFloor === "ground" ? (
                <>
                  <Layers size={14} /> TẦNG TRỆT · GIẶT ỦI TỰ ĐỘNG & VẬT TƯ TIỆN ÍCH
                </>
              ) : (
                <>
                  <Coffee size={14} /> LẦU 1 · KHÔNG GIAN CAFÉ, HỌC TẬP & LÀM VIỆC
                </>
              )}
            </div>
          </div>

          <div className="floor-info-box">
            {activeFloor === "ground" ? (
              <>
                <p className="kicker">TIỆN NGHI TẦNG TRỆT</p>
                <h3>Giặt sấy thông minh & Quầy Bar Take-away</h3>
                <p className="floor-desc">
                  Trang bị dãy máy giặt sấy công nghiệp Wash-Dry-Fold hiện đại. Quầy đồ uống pha chế nhanh (Cà phê, Trà sữa, Nước ép) và kệ vật tư điện nước tiện ích sẵn sàng phục vụ cư dân.
                </p>
                <div className="floor-features-list">
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Shirt size={20} /></span>
                    <div>
                      <strong>Dãy máy giặt sấy công nghiệp nhập khẩu</strong>
                      <small>Khử khuẩn nhiệt, bảo vệ từng sợi vải, chu trình nhanh 45 - 60 phút.</small>
                    </div>
                  </div>
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Coffee size={20} /></span>
                    <div>
                      <strong>Quầy Bar Coffee & Cold Drinks</strong>
                      <small>Cà phê pha máy, Bạc xỉu thơm béo, nước ép tươi mang đi trong 3 phút.</small>
                    </div>
                  </div>
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Wrench size={20} /></span>
                    <div>
                      <strong>Kệ vật tư điện nước & giặt giũ tiện ích</strong>
                      <small>Nước giặt xả sinh học organic, phụ kiện ống nước, vật dụng gia đình khẩn cấp.</small>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="kicker">KHÔNG GIAN LẦU 1</p>
                <h3>Café & Seating Area · Good Drinks, Brighter Days</h3>
                <p className="floor-desc">
                  Không gian ấm cúng với dãy sofa băng êm ái, bàn tròn gỗ sồi, cây xanh mát mắt và ánh sáng tự nhiên. Nơi bạn có thể ngồi đọc sách, làm việc hoặc chuyện trò thoải mái trong lúc chờ đồ giặt.
                </p>
                <div className="floor-features-list">
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Wifi size={20} /></span>
                    <div>
                      <strong>Wi-Fi 6 tốc độ cao & Ổ cắm từng bàn</strong>
                      <small>Thoải mái cắm sạc laptop, họp online và làm việc từ xa mượt mà.</small>
                    </div>
                  </div>
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Coffee size={20} /></span>
                    <div>
                      <strong>Thực đơn bánh nướng & đồ uống phục vụ tại bàn</strong>
                      <small>Giảm 10% toàn bộ đồ uống khi bạn có đơn giặt đang xử lý.</small>
                    </div>
                  </div>
                  <div className="floor-feature-item">
                    <span className="feat-icon"><Building2 size={20} /></span>
                    <div>
                      <strong>Ban công thoáng đãng ngắm cảnh nội khu</strong>
                      <small>Góc nhìn ngắm công viên Vinhomes Sài Gòn Park xanh mát, trong lành.</small>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2.5. HAI CÁCH TRẢI NGHIỆM TIỆN LỢI (ONLINE BOOKING VS WALK-IN TRỰC TIẾP) */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto my-6" id="two-ways">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="kicker text-[#0284C7] font-extrabold tracking-wider uppercase text-xs">
            LINH HOẠT CHO MỌI NHU CẦU CƯ DÂN
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 mt-2">
            Hai cách gửi đồ cực nhanh tại Sạch+
          </h2>
          <p className="text-stone-600 text-sm md:text-base mt-3">
            Dù bạn đang bận việc tại căn hộ hay đang dạo bộ dưới công viên Shophouse, Sạch+ luôn có phương thức tiếp nhận tối ưu nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Online Booking */}
          <div className="spotlight-card rounded-md p-8 border border-[#E2E8F0] bg-white shadow-lg shadow-[#0284C7]/5 hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#E0F2FE] text-[#0284C7] rounded-md text-xs font-black uppercase tracking-wider border border-[#E2E8F0]">
                  Cách 1 · Cư dân bận rộn
                </span>
                <div className="w-10 h-10 rounded-md bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <Truck size={22} />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-2">
                Đặt lịch Online – Nhận & Giao tận cửa
              </h3>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6">
                Không cần bước chân ra khỏi nhà. Shipper nội khu Vinhomes Sài Gòn Park nhận đồ tận sảnh hoặc cửa căn hộ theo khung giờ bạn chọn.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-stone-700">
                    <strong>Đặt lịch trong 30 giây:</strong> Chọn dịch vụ và khung giờ shipper lên lấy trên web/app.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-stone-700">
                    <strong>Quét mã QR niêm phong:</strong> Shipper kiểm đếm, niêm phong túi giặt và in tem định danh.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-stone-700">
                    <strong>Giao tận tay:</strong> Quần áo được giặt thơm, sấy tiệt trùng, gấp gọn và giao trả đúng hẹn.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/dat-lich"
              className="w-full py-3.5 px-4 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-xs text-center flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              Đặt lịch lấy đồ tại căn hộ <ArrowRight size={15} />
            </Link>
          </div>

          {/* Card 2: Walk-in counter */}
          <div className="spotlight-card rounded-md p-8 border border-[#0284C7]/20 bg-white shadow-lg shadow-slate-900/5 hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#F0F9FF] text-[#0369A1] rounded-md text-xs font-black uppercase tracking-wider border border-[#0284C7]/20">
                  Cách 2 · Khách ghé trực tiếp (Walk-in)
                </span>
                <div className="w-10 h-10 rounded-md bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center">
                  <Coffee size={22} />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-stone-900 mb-2">
                Mang đến Shophouse SH-08 · Không cần đặt trước
              </h3>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed mb-6">
                Dành cho khách dạo bộ, tập thể dục hoặc thích ghé quán trực tiếp. Nhân viên tiếp nhận ngay tại quầy tầng trệt chỉ trong 1 phút.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-stone-700">
                    <strong>Ghé quầy Shophouse SH-08:</strong> Mang đồ đến bất kỳ lúc nào từ 07:00 – 22:00.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-stone-700">
                    <strong>Cân ký & Nhận tem tức thì:</strong> Nhân viên cân kg tại quầy, cấp tem QR và phiếu hẹn lấy.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-stone-700">
                    <strong>Uống Café Lầu 1 (-10%):</strong> Thưởng thức ly Espresso / Trà sen vàng ngắm công viên trong lúc chờ lấy đồ sau 45p.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/cafe"
              className="w-full py-3.5 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-md text-xs text-center flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              Xem thực đơn Café & Khám phá quán <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 4 DỊCH VỤ CHÍNH */}
      <section className="service-strip overflow-x-hidden" id="services" aria-labelledby="service-title">
        <div className="section-title">
          <div>
            <p className="kicker">4 DỊCH VỤ CHÍNH TẠI SẠCH+</p>
            <h2 id="service-title">Chăm sóc đúng cách cho từng món đồ.</h2>
          </div>
          <p className="text-stone-600 text-sm md:text-base max-w-md">
            Bảng giá minh bạch trước khi nhận đồ. Mọi đơn hàng đều có tem QR và ảnh chụp đối soát trước - sau.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {serviceCatalog.map((item, index) => {
            const Icon = serviceIcons[index];
            const isAccent = index === 3;
            return (
              <Link
                href={`/dat-lich?service=${encodeURIComponent(item.name)}`}
                key={item.id}
                className={`service-card ${isAccent ? "service-all" : ""} block no-underline`}
              >
                <span className="service-icon mb-4 block">
                  <Icon size={22} />
                </span>
                <div className="mb-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isAccent ? "text-[#0284C7]" : "text-[#0284C7]"}`}>
                    {item.highlight}
                  </span>
                  <h3 className="font-bold text-lg mb-2 text-stone-900">{item.name}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.detail}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-stone-100">
                  <small className="block text-xs text-stone-500 mb-1">Thời gian: {item.duration}</small>
                  <strong className={`block text-base font-extrabold ${isAccent ? "text-[#0284C7]" : "text-[#0284C7]"}`}>
                    từ {formatVnd(item.price)} / {item.unit}
                  </strong>
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <ArrowRight className={isAccent ? "text-[#0284C7]" : "text-[#0284C7]"} size={18} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="service-foot mt-8">
          <span className="text-stone-800 font-semibold">
            <Zap size={18} className="text-[#0284C7]" /> Dịch vụ Hỏa tốc 6 giờ · +30.000₫ / đơn
          </span>
          <span className="text-stone-800 font-semibold">
            <BriefcaseBusiness size={18} className="text-[#0284C7]" /> Gói giặt rèm, thảm & doanh nghiệp định kỳ · Báo giá riêng
          </span>
        </div>
      </section>

      {/* 4. QUY TRÌNH 4 BƯỚC */}
      <section className="process-section" id="process">
        <div className="process-intro">
          <p className="kicker">QUY TRÌNH MINH BẠCH</p>
          <h2>
            Bốn bước.<br />
            <em>Không mất thời gian chờ.</em>
          </h2>
          <p>
            Từ lúc shipper đến nhận túi đồ tại căn hộ cho đến khi giao lại hoàn tất, mọi công đoạn đều được cập nhật thời gian thực vào ứng dụng.
          </p>
          <Link href="/don-cua-toi" className="text-link">
            Trải nghiệm theo dõi đơn mẫu <ArrowRight size={17} />
          </Link>
        </div>

        <div className="process-list">
          {processSteps.map(([number, title, note]) => (
            <article key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{note}</p>
              </div>
              <Check size={19} />
            </article>
          ))}
        </div>
      </section>

      {/* 5. SẠCH+ CAFÉ LẦU 1 */}
      <section className="cafe-section" id="cafe">
        <div className="cafe-copy">
          <p className="kicker text-stone-900">SẠCH+ CAFÉ · LẦU 1</p>
          <h2>
            Thời gian chờ đồ,<br />
            cũng là thời gian thư giãn.
          </h2>
          <p>
            Lên lầu thưởng thức ly cà phê đậm đà, đọc sách hoặc xử lý công việc. Khách đang có đơn giặt được giảm ngay 10% toàn bộ đồ uống từ 50.000₫.
          </p>
          <Link className="button cafe-button" href="/cafe">
            Xem thực đơn & Đặt món <ArrowRight size={18} />
          </Link>
          <div className="amenities">
            <span><Wifi size={16} /> Wi-Fi 6 siêu tốc</span>
            <span><Zap size={16} /> Ổ cắm mỗi bàn</span>
            <span><Coffee size={16} /> Pha mới trong 5-8 phút</span>
          </div>
        </div>

        <div className="space-y-3.5 w-full max-w-lg mx-auto lg:mx-0">
          {[
            {
              num: "01",
              tag: "CÀ PHÊ SỮA DỊU",
              name: "Bạc xỉu Sạch+",
              price: "35.000₫",
              desc: "Cà phê sữa dịu thơm ngậy, hạt Arabica Cầu Đất nguyên chất",
              image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&auto=format&fit=crop&q=80",
            },
            {
              num: "02",
              tag: "MATCHA NHẬT · SỮA TƯƠI",
              name: "Matcha Latte",
              price: "39.000₫",
              desc: "Bột trà xanh Uji Kyoto hảo hạng & sữa tươi thanh trùng ít ngọt",
              image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=200&auto=format&fit=crop&q=80",
            },
            {
              num: "03",
              tag: "NƯỚNG NÓNG TRONG NGÀY",
              name: "Croissant bơ Pháp",
              price: "32.000₫",
              desc: "Vỏ ngàn lớp giòn rụm, nướng thơm lừng bơ hảo hạng mỗi sáng",
              image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=200&auto=format&fit=crop&q=80",
            },
          ].map((item) => (
            <article
              key={item.num}
              className="flex items-center gap-4 p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-[#0284C7]/40 transition-all group"
            >
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80";
                }}
                className="w-16 h-16 rounded-md object-cover border border-slate-100 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7]">
                    {item.num} · {item.tag}
                  </span>
                  <strong className="text-sm font-extrabold text-[#0284C7]">{item.price}</strong>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate group-hover:text-[#0284C7] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. TRACKING SHOWCASE & ECO METRICS */}
      <div className="overflow-x-hidden w-full">
        <LiveTrackingStage />
      </div>

      {/* 7. GREEN LAUNDRY ECO IMPACT */}
      <section className="py-16 px-4 md:px-16 bg-[#F8FAFC] border-t border-stone-200">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <p className="kicker">TIÊU CHUẨN GIẶT XANH</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
            Giặt sạch cho bạn, nhẹ gánh cho môi trường.
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto mt-2 text-sm md:text-base">
            Nhờ sử dụng hệ thống máy giặt Inverter chuẩn công nghiệp và cảm biến định lượng nước thông minh, Sạch+ giảm lãng phí tài nguyên trên từng mẻ giặt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-md border border-stone-200 shadow-sm text-center">
            <span className="w-12 h-12 rounded-md bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-3">
              <Droplet size={24} />
            </span>
            <strong className="text-3xl font-bold tracking-tight text-[#0369A1] block">142 Lít</strong>
            <p className="text-xs font-bold text-[#0284C7] uppercase tracking-wider mt-1">Nước sạch tiết kiệm</p>
            <small className="text-stone-500 text-xs block mt-2">
              So với giặt máy gia đình thông thường (tiết kiệm 22.8L/mẻ)
            </small>
          </div>

          <div className="bg-white p-6 rounded-md border border-stone-200 shadow-sm text-center">
            <span className="w-12 h-12 rounded-md bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center mx-auto mb-3">
              <Zap size={24} />
            </span>
            <strong className="text-3xl font-bold tracking-tight text-[#0369A1] block">4.2 kWh</strong>
            <p className="text-xs font-bold text-[#0369A1] uppercase tracking-wider mt-1">Điện năng tiêu thụ giảm</p>
            <small className="text-stone-500 text-xs block mt-2">
              Động cơ biến tần Inverter chuẩn tiết kiệm A+++
            </small>
          </div>

          <div className="bg-white p-6 rounded-md border border-stone-200 shadow-sm text-center">
            <span className="w-12 h-12 rounded-md bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto mb-3">
              <Recycle size={24} />
            </span>
            <strong className="text-3xl font-bold tracking-tight text-[#0369A1] block">8 Túi</strong>
            <p className="text-xs font-bold text-[#0284C7] uppercase tracking-wider mt-1">Túi vải Canvas tái sử dụng</p>
            <small className="text-stone-500 text-xs block mt-2">
              Không dùng túi nilon một lần, bảo vệ môi trường khu đô thị
            </small>
          </div>
        </div>
      </section>

      {/* 8. ĐÁNH GIÁ CỦA CƯ DÂN */}
      <section className="py-16 px-4 md:px-16 bg-[#E2E8F0]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <p className="kicker">TIẾNG NÓI TỪ KHÁCH HÀNG</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                Được tin chọn bởi cư dân Vinhomes.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[#0369A1] font-bold text-sm">
              <span>Đánh giá 4.9/5 từ 420+ lượt dịch vụ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Lần đầu tiên đi giặt đồ mà thư giãn như đi café boutique. Quần áo gấp thẳng thớm, thơm mùi hoa cỏ tự nhiên không bị nồng hóa chất.",
                author: "Chị Mai Hương",
                room: "Căn hộ S1.02 - Vinhomes SG Park",
              },
              {
                quote: "Dịch vụ lấy đồ tận cửa rất tiện cho người bận rộn như mình. Thích nhất là có ảnh chụp kiểm tra trước và sau khi giặt rất minh bạch.",
                author: "Anh Tuấn Kiệt",
                room: "Căn hộ S2.05 - Vinhomes SG Park",
              },
              {
                quote: "Lầu 1 café làm việc rất yên tĩnh, Wi-Fi mạnh, máy lạnh mát rượi. Đặt giặt đồ xong lên ngồi làm việc là vừa khéo xong đồ.",
                author: "Bạn Hoàng Nam",
                room: "Freelancer cư dân phân khu Park",
              },
            ].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-md border border-stone-200 shadow-sm flex flex-col justify-between">
                <div className="flex gap-1 text-[#F59E0B] mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm italic leading-relaxed mb-4">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="border-t border-stone-100 pt-3">
                  <strong className="text-stone-900 text-sm block">{review.author}</strong>
                  <small className="text-stone-500 text-xs block">{review.room}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CẨM NANG CƯ DÂN */}
      <section className="guide-section" id="guide">
        <div className="guide-head">
          <div>
            <p className="kicker">CẨM NANG CƯ DÂN</p>
            <h2>Bí quyết chăm sóc trang phục tại Sài Gòn Park.</h2>
          </div>
          <p>Những hướng dẫn thực tế, ngắn gọn giúp quần áo luôn bền màu và tinh tươm.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["01", "Checklist bảo quản rèm & chăn ga mùa mưa", "Bí quyết sấy tiệt trùng chống ẩm mốc và tích tụ vi khuẩn cho đồ vải kích thước lớn.", "bao-quan-rem"],
            ["02", "Cách giặt áo sơ mi & đầm lụa cao cấp", "Tại sao công nghệ giặt hấp sinh học giúp giữ form áo và màu vải bền gấp 3 lần.", "giat-ao-so-mi"],
            ["03", "Vệ sinh giày thể thao không bong keo", "Quy trình làm sạch bọt khô và chiếu đèn UV diệt khuẩn chuyên sâu.", "ve-sinh-giay"],
          ].map(([number, title, note, slug]) => (
            <Link href={`/cam-nang/${slug}`} key={number} className="group block no-underline bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm transition-transform hover:-translate-y-1">
              <article>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#E0F2FE] text-[#0284C7] font-black text-xs tracking-wider border border-[#0284C7]/20">
                    CẨM NANG #{number}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">3 phút đọc</span>
                </div>
                <h3 className="group-hover:text-[#0284C7] transition-colors text-base font-bold mb-2.5 text-slate-900 leading-snug">{title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{note}</p>
                <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#0284C7] group-hover:translate-x-1 transition-transform">
                  Đọc cẩm nang chi tiết <ArrowRight size={14} />
                </span>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="final-cta">
        <div>
          <p className="kicker text-[#0284C7]">SẠCH+ LAUNDRY & COFFEE</p>
          <h2>
            Để việc giặt giũ<br />
            rời khỏi danh sách hôm nay.
          </h2>
          <p className="mt-2">Chọn khung giờ tiện nhất, Sạch+ sẽ đến nhận và chăm sóc chu đáo.</p>
        </div>
        <div>
          <Link href="/dat-lich" className="button button-accent inline-flex items-center gap-2">
            Đặt lịch lấy đồ ngay <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
