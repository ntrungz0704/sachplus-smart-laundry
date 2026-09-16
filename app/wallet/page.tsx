import { ArrowDownLeft, ArrowRight, ArrowUpRight, Gift, Gem, QrCode, ShieldCheck, Star, Truck } from "lucide-react";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Progress } from "@/components/ui/progress";

export default function WalletPage() {
  return <main><SiteHeader active="Ví & thành viên" /><section className="subpage-head"><div><p className="kicker">SẠCH+ CARE</p><h1>Ví & ưu đãi.</h1><p>Thanh toán nhanh hơn và nhận quyền lợi thành viên.</p></div></section>
    <section className="wallet-layout"><div className="wallet-main">
      <div className="wallet-card"><div className="wallet-brand"><span className="brand-mark">S+</span><span>VÍ SẠCH+</span></div><p>Số dư khả dụng</p><h2>435.000₫</h2><div><button><QrCode /> Nạp tiền</button><button>Rút tiền</button></div><small>•••• 2409 · bảo vệ bởi Sạch+ Care</small></div>
      <div className="transactions"><div className="panel-title"><h2>Giao dịch gần đây</h2><button>Xem tất cả</button></div>{[
        [ArrowUpRight,"Thanh toán đơn SP-240916","16/09 · 14:31","−128.000₫","out"],
        [ArrowDownLeft,"Cashback thành viên Vàng","15/09 · 09:12","+25.000₫","in"],
        [ArrowDownLeft,"Nạp ví qua VietQR","12/09 · 19:40","+500.000₫","in"],
        [ArrowUpRight,"Bạc xỉu · Sạch+ Café","11/09 · 09:20","−31.500₫","out"],
      ].map(([Icon,title,note,amount,type])=><div className="transaction" key={String(title)}><span className={String(type)}><Icon /></span><div><strong>{title}</strong><small>{note}</small></div><b className={String(type)}>{amount}</b></div>)}</div>
    </div><aside className="benefit-column"><div className="tier-card"><div><span><Gem /></span><p>HẠNG THÀNH VIÊN</p></div><h2>Vàng</h2><p><strong>720</strong> / 1.000 điểm</p><Progress value={72}/><small>Còn 280 điểm để lên hạng Kim cương.</small><div className="tier-scale"><span>Đồng</span><span>Bạc</span><span className="active">Vàng</span><span>Kim cương</span></div></div><div className="voucher-panel"><div className="panel-title"><h2>Ưu đãi của bạn</h2><Gift /></div>{[
        ["GIẢM 30%","Tối đa 80.000₫ cho đơn từ 199.000₫",Star],
        ["FREESHIP","Miễn phí giao nhận cho 2 đơn tiếp theo",Truck],
        ["−50.000₫","Ưu đãi sinh nhật dành riêng cho bạn",ShieldCheck],
      ].map(([title,note,Icon])=><article key={String(title)}><span><Icon /></span><div><strong>{title}</strong><p>{note}</p></div><button><ArrowRight /></button></article>)}</div></aside></section><SiteFooter />
  </main>;
}
