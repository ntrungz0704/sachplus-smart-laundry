import Link from "next/link";
import { Clock3, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return <footer className="site-footer">
    <div><Link className="brand footer-brand" href="/"><span className="brand-mark">S+</span><span>Sạch<span>+</span></span></Link><p>Giặt ủi thông minh, café vừa vị và một nhịp sống nhẹ hơn cho cư dân nội khu.</p></div>
    <div><h3>Khách hàng</h3><Link href="/#services">Bảng giá</Link><Link href="/cafe">Thực đơn Café</Link><Link href="/orders">Theo dõi đơn</Link><Link href="/wallet">Ví & thành viên</Link></div>
    <div><h3>Vận hành</h3><Link href="/staff">Cổng nhân viên</Link><Link href="/owner">Cổng chủ cửa hàng</Link><Link href="/#guide">Cẩm nang cư dân</Link></div>
    <div><h3>Sạch+ Sài Gòn Park</h3><p><MapPin size={16} /> Tầng trệt & Lầu 1, Xuân Thới Sơn</p><p><Clock3 size={16} /> 07:00–22:00 mỗi ngày</p><p><Phone size={16} /> 1900 6868</p></div>
    <small>© 2026 Sạch+ Laundry & Café. Bản trải nghiệm sản phẩm.</small>
  </footer>;
}
