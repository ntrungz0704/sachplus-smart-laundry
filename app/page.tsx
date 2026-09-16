import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, BriefcaseBusiness, Check, Clock3, Coffee, MapPin, PackageCheck, Shirt, ShoppingBag, Sparkles, Truck, Wifi, Zap } from "lucide-react";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { BookingDialog } from "@/components/sachplus/order-dialog";
import { serviceCatalog, formatVnd } from "@/lib/sachplus-data";

const serviceIcons = [Shirt, Sparkles, BedDouble, ShoppingBag];
const process = [
  ["01", "Đặt lịch", "Chọn dịch vụ và giờ lấy phù hợp."],
  ["02", "Nhận tận nơi", "Đối soát túi đồ bằng mã QR riêng."],
  ["03", "Theo dõi realtime", "Biết đồ đang giặt, sấy hay trên kệ."],
  ["04", "Giao & xác nhận", "Chỉ hoàn tất khi bạn xác nhận đủ đồ."],
];

export default function Home() {
  return <main>
    <SiteHeader active="Trang chủ" />
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span /> LAUNDRY & CAFÉ NỘI KHU</p>
        <h1>Giặt sạch.<br />Uống ngon.<br /><em>Sống nhẹ hơn.</em></h1>
        <p className="hero-lead">Sạch+ đến lấy, chăm đúng cách và giao lại tận cửa. Trong lúc chờ, một góc café sáng, yên và đủ tiện nghi đang đợi bạn.</p>
        <div className="hero-actions">
          <BookingDialog><button className="button button-primary">Đặt lịch lấy đồ <ArrowRight size={18} /></button></BookingDialog>
          <a className="button button-ghost" href="#services">Xem bảng giá</a>
        </div>
        <div className="hero-meta"><span><Clock3 size={17} /> 07:00–22:00 mỗi ngày</span><span><MapPin size={17} /> Vinhomes Sài Gòn Park</span></div>
      </div>
      <div className="hero-visual">
        <div className="photo-frame"><Image src="/sachplus-concept.png" alt="Mô hình hai tầng Sạch+ Laundry và Café" fill priority sizes="(max-width: 900px) 100vw, 48vw" /><div className="photo-badge"><strong>4,9</strong><span>★★★★★<br />khách nội khu</span></div></div>
        <aside className="quick-book">
          <div className="quick-book-head"><div><span>ĐẶT NHANH</span><h2>Lấy đồ tận nhà</h2></div><span className="open-pill">Đang mở</span></div>
          <div className="quick-service"><span><Shirt size={20} /></span><div><small>DỊCH VỤ PHỔ BIẾN</small><strong>Giặt & sấy · từ 69K</strong></div><Check size={18} /></div>
          <div className="quick-route"><span><MapPin size={17} /> Lấy tại nhà</span><ArrowRight size={15} /><span><Truck size={17} /> Giao tận cửa</span></div>
          <BookingDialog><button type="button">Chọn lịch lấy đồ <ArrowRight size={18} /></button></BookingDialog>
          <p>Miễn phí giao nhận nội khu cho thành viên Vàng.</p>
        </aside>
      </div>
    </section>

    <section className="service-strip" id="services" aria-labelledby="service-title">
      <div className="section-title"><div><p>DỊCH VỤ PHỔ BIẾN</p><h2 id="service-title">Chăm đúng cách cho từng món đồ.</h2></div><p className="section-note">Giá minh bạch trước khi xác nhận. Mọi đơn đều có mã QR và ảnh đối soát.</p></div>
      <div className="service-grid">{serviceCatalog.map((item, index) => { const Icon = serviceIcons[index]; return <article key={item.id} className={`service-card ${index === 3 ? "service-all" : ""}`}><span className="service-icon"><Icon size={24} /></span><div><h3>{item.name}</h3><p>{item.detail}</p></div><strong>từ {formatVnd(item.price)} / {item.unit}</strong><ArrowRight className="service-arrow" size={20} /></article>; })}</div>
      <div className="service-foot"><span><Zap size={18} /> Hỏa tốc 6 giờ · +30.000₫ / đơn</span><span><BriefcaseBusiness size={18} /> Gói doanh nghiệp định kỳ · nhận báo giá riêng</span></div>
    </section>

    <section className="process-section" id="process">
      <div className="process-intro"><p className="kicker">QUY TRÌNH SẠCH+</p><h2>Bốn bước.<br /><em>Không phải chờ đợi.</em></h2><p>Từ lúc giao túi đồ đến khi nhận lại, từng công đoạn đều được ghi nhận để bạn luôn biết đồ của mình đang ở đâu.</p><Link href="/orders" className="text-link">Xem đơn mẫu <ArrowRight size={17} /></Link></div>
      <div className="process-list">{process.map(([number, title, note]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{note}</p></div><Check size={19} /></article>)}</div>
    </section>

    <section className="cafe-section" id="cafe">
      <div className="cafe-copy"><p className="kicker">SẠCH+ CAFÉ · LẦU 1</p><h2>Thời gian chờ<br />cũng là thời gian của bạn.</h2><p>Gọi trước khi đến, nhận tại quầy hoặc ngồi lại làm việc. Khách đang có đơn giặt được giảm 10% món Café từ 50.000₫.</p><Link className="button cafe-button" href="/cafe">Xem thực đơn <ArrowRight size={18} /></Link><div className="amenities"><span><Wifi /> Wi‑Fi nhanh</span><span><Zap /> Ổ cắm mỗi bàn</span><span><Coffee /> Pha trong 8 phút</span></div></div>
      <div className="menu-stack">
        <article className="menu-card menu-yellow"><span>01</span><div><small>CÀ PHÊ SỮA DỊU</small><h3>Bạc xỉu</h3><p>35.000₫</p></div><Coffee /></article>
        <article className="menu-card menu-cream"><span>02</span><div><small>MATCHA NHẬT · SỮA TƯƠI</small><h3>Matcha Latte</h3><p>39.000₫</p></div><Coffee /></article>
        <article className="menu-card menu-green"><span>03</span><div><small>NƯỚNG MỚI TRONG NGÀY</small><h3>Croissant bơ</h3><p>32.000₫</p></div><PackageCheck /></article>
      </div>
    </section>

    <section className="tracking-showcase" id="tracking">
      <div className="tracking-card">
        <div className="tracking-top"><div><p className="kicker">ĐƠN ĐANG XỬ LÝ</p><h2>SP-240916 · Giặt & sấy</h2></div><span className="status-badge"><i /> Đang giặt</span></div>
        <div className="timeline">{["Nhận đồ", "Phân loại", "Giặt", "Sấy", "QC", "Đang giao", "Đã nhận"].map((step, index) => <div key={step} className={index < 3 ? "done" : index === 2 ? "current" : ""}><b>{index < 2 ? <Check size={15} /> : index + 1}</b><span>{step}</span></div>)}</div>
        <div className="tracking-bottom"><span>Dự kiến hoàn tất hôm nay lúc <strong>17:30</strong></span><Link href="/orders">Theo dõi chi tiết <ArrowRight size={17} /></Link></div>
      </div>
      <aside className="member-card"><p>THÀNH VIÊN VÀNG</p><h3>720 <small>điểm</small></h3><div><span style={{ width: "72%" }} /></div><p>Còn 280 điểm để lên hạng Kim cương.</p><Link href="/wallet">Xem quyền lợi <ArrowRight size={16} /></Link></aside>
    </section>

    <section className="guide-section" id="guide">
      <div className="guide-head"><div><p className="kicker">CẨM NANG CƯ DÂN</p><h2>Sống sạch tại Sài Gòn Park.</h2></div><p>Những hướng dẫn ngắn, thực tế cho ngày nhận nhà và nhịp sống bận rộn.</p></div>
      <div className="guide-grid">{[
        ["01", "Nhận nhà không mang theo bụi công trình", "Checklist 48 giờ cho rèm, chăn ga và quần áo trước khi đưa vào tủ."],
        ["02", "Lịch giặt cho gia đình bận rộn", "Gom đồ theo ba giỏ và đặt một khung lịch cố định mỗi tuần."],
        ["03", "Chăm chăn ga mùa mưa", "Sấy đúng nhiệt, đóng gói chống ẩm và nhận biết khi cần giặt sâu."],
      ].map(([number, title, note]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{note}</p><button>Đọc 5 phút <ArrowRight size={16} /></button></article>)}</div>
    </section>

    <section className="final-cta"><div><p className="kicker">SẠCH+ CARE</p><h2>Để việc giặt giũ<br />rời khỏi danh sách hôm nay.</h2></div><div><p>Chọn khung giờ, Sạch+ lo phần còn lại.</p><BookingDialog><button className="button button-primary">Đặt lịch ngay <ArrowRight size={18} /></button></BookingDialog></div></section>
    <SiteFooter />
  </main>;
}
