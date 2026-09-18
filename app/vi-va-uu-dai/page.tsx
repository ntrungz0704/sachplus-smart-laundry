"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  Droplet,
  Gem,
  Gift,
  Info,
  QrCode,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVnd, getWalletBalance, addWalletBalance, getTransactions, addTransaction, getVouchers, getAccumulatedPoints, type Transaction, type VoucherItem } from "@/lib/sachplus-data";
import { getCurrentUser } from "@/lib/sachplus-auth";


export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(200000);
  const [ecoModalOpen, setEcoModalOpen] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const user = getCurrentUser();
    const uid = user?.id;
    setBalance(getWalletBalance(uid));
    setTransactions(getTransactions(uid));
    setVouchers(getVouchers());
    setPoints(getAccumulatedPoints());

    const loadWallet = () => {
      const u = getCurrentUser();
      setBalance(getWalletBalance(u?.id));
      setTransactions(getTransactions(u?.id));
      setPoints(getAccumulatedPoints());
    };
    const loadVouchers = () => {
      setVouchers(getVouchers());
    };

    window.addEventListener("sachplus:wallet-updated", loadWallet);
    window.addEventListener("sachplus:vouchers-updated", loadVouchers);
    window.addEventListener("sachplus:order-updated", loadWallet);
    return () => {
      window.removeEventListener("sachplus:wallet-updated", loadWallet);
      window.removeEventListener("sachplus:vouchers-updated", loadVouchers);
      window.removeEventListener("sachplus:order-updated", loadWallet);
    };
  }, []);

  const handleDepositSuccess = () => {
    const user = getCurrentUser();
    const bonus = depositAmount >= 500000 ? 50000 : depositAmount >= 200000 ? 10000 : 0;
    const added = depositAmount + bonus;
    const newBal = addWalletBalance(added, user?.id);
    setBalance(newBal);
    setTransactions(getTransactions(user?.id));
    setDepositOpen(false);
    toast.success(`Nạp ví thành công ${formatVnd(added)}! Số dư mới: ${formatVnd(newBal)}`);
  };

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép: ${text}`);
  };

  return (
    <main>
      <SiteHeader active="Ví & Ưu đãi" />

      <section className="subpage-head">
        <div>
          <p className="kicker">SẠCH+ WALLET & MEMBERSHIP</p>
          <h1>Ví cư dân & Ưu đãi thành viên</h1>
          <p>Thanh toán một chạm cho cả dịch vụ giặt sấy tầng trệt và thức uống lầu 1.</p>
        </div>
      </section>

      <section className="wallet-layout">
        {/* Cột trái: Thẻ ví & Lịch sử giao dịch */}
        <div className="wallet-main">
          <div className="wallet-card">
            <div className="wallet-brand">
              <div className="flex items-center gap-2">
                <span className="brand-mark">S+</span>
                <span className="text-white font-bold tracking-wider">VÍ SẠCH+ PAY</span>
              </div>
              <span className="text-xs bg-[#0284C7]/20 text-[#0284C7] px-2.5 py-1 rounded-full font-bold border border-[#0284C7]/30">
                HỘI VIÊN VÀNG
              </span>
            </div>

            <p>Số dư khả dụng hiện tại</p>
            <h2>{formatVnd(balance)}</h2>

            <div>
              <button type="button" onClick={() => setDepositOpen(true)}>
                <QrCode size={18} /> Nạp tiền VietQR
              </button>
              <button type="button" onClick={() => toast.info("Tính năng rút tiền về tài khoản ngân hàng liên kết khả dụng 24/7.")}>
                Rút tiền
              </button>
            </div>

            <small>•••• 2409 · Cư dân Vinhomes Sài Gòn Park · Bảo mật bởi Sạch+ Care</small>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="transactions">
            <div className="panel-title">
              <h2>Lịch sử biến động số dư</h2>
              <span className="text-xs text-stone-500 font-semibold">{transactions.length} giao dịch</span>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p className="font-medium">Chưa có giao dịch nào</p>
                <p className="text-sm mt-1">Nạp tiền vào ví để bắt đầu sử dụng dịch vụ.</p>
              </div>
            ) : (
            transactions.map((tx) => (
              <div className="transaction" key={tx.id}>
                <span className={tx.amount >= 0 ? "in" : "out"}>
                  {tx.amount >= 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </span>
                <div>
                  <strong>{tx.type}</strong>
                  <small>{tx.note}</small>
                </div>
                <b className={tx.amount >= 0 ? "in" : "out"}>
                  {tx.amount >= 0 ? "+" : ""}{formatVnd(tx.amount)}
                </b>
              </div>
            ))
            )}
          </div>

          {/* CHỈ SỐ GIẶT XANH ECO IMPACT */}
          <div className="eco-panel">
            <div className="panel-title">
              <div>
                <p className="kicker">TIẾT KIỆM TÀI NGUYÊN</p>
                <h2>Đóng góp Giặt Xanh của bạn</h2>
              </div>
              <button
                type="button"
                className="text-[#0284C7] text-xs font-bold flex items-center gap-1 hover:underline"
                onClick={() => setEcoModalOpen(true)}
              >
                <Info size={14} /> Công thức đo lường
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#E0F2FE] border border-[#E2E8F0] rounded-md text-center">
                <Droplet className="text-[#0284C7] mx-auto mb-1" size={22} />
                <strong className="text-xl font-bold tracking-tight text-[#0369A1] block">{Math.round(points * 0.2)} Lít</strong>
                <small className="text-stone-500 text-xs">Nước sạch tiết kiệm</small>
              </div>

              <div className="p-4 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md text-center">
                <Zap className="text-[#0369A1] mx-auto mb-1" size={22} />
                <strong className="text-xl font-bold tracking-tight text-[#0369A1] block">{(points * 0.006).toFixed(1)} kWh</strong>
                <small className="text-stone-500 text-xs">Điện năng giảm tải</small>
              </div>

              <div className="p-4 bg-[#E0F2FE] border border-[#E2E8F0] rounded-md text-center">
                <Recycle className="text-[#0284C7] mx-auto mb-1" size={22} />
                <strong className="text-xl font-bold tracking-tight text-[#0369A1] block">{Math.max(1, Math.floor(points / 50))} Túi</strong>
                <small className="text-stone-500 text-xs">Túi vải Canvas tuần hoàn</small>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Hạng thành viên & Voucher */}
        <aside className="benefit-column">
          {/* Hạng thành viên */}
          <div className="tier-card">
            <div>
              <span><Gem size={18} /></span>
              <p>HẠNG HỘI VIÊN HIỆN TẠI</p>
            </div>
            <h2>{points >= 1000 ? "Hạng Kim Cương" : points >= 500 ? "Hạng Vàng" : points >= 200 ? "Hạng Bạc" : "Hạng Đồng"}</h2>
            <p className="text-stone-900">
              <strong>{points.toLocaleString("vi-VN")}</strong> / {points >= 1000 ? "∞" : points >= 500 ? "1.000" : points >= 200 ? "500" : "200"} điểm tích lũy
            </p>
            <Progress value={points >= 1000 ? 100 : points >= 500 ? (points / 1000) * 100 : points >= 200 ? (points / 500) * 100 : (points / 200) * 100} className="h-2 bg-[#0369A1]/20" />
            <small className="text-stone-800">
              {points >= 1000
                ? "Bạn đã đạt hạng cao nhất! Hoàn tiền 10% mọi đơn."
                : `Còn ${(points >= 500 ? 1000 : points >= 200 ? 500 : 200) - points} điểm nữa để lên hạng tiếp theo.`}
            </small>
            <div className="tier-scale">
              <span className={points < 200 ? "active" : ""}>Đồng</span>
              <span className={points >= 200 && points < 500 ? "active" : ""}>Bạc</span>
              <span className={points >= 500 && points < 1000 ? "active" : ""}>Vàng (5% hoàn tiền)</span>
              <span className={points >= 1000 ? "active" : ""}>Kim Cương (10%)</span>
            </div>
          </div>

          {/* Danh sách Voucher ưu đãi */}
          <div className="voucher-panel">
            <div className="panel-title">
              <div>
                <h2>Kho Voucher của bạn</h2>
                <span className="text-[11px] text-stone-500 font-medium">Cập nhật tự động từ hệ thống ưu đãi</span>
              </div>
              <Gift className="text-[#0284C7]" />
            </div>

            {vouchers.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                Hiện tại chưa có mã ưu đãi nào.
              </div>
            ) : (
              vouchers
                .filter((v) => v.isActive)
                .map((v) => (
                  <article key={v.id} className="p-3 bg-stone-50 border border-stone-200 rounded-md mb-3 last:mb-0 hover:border-[#0284C7]/40 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0369A1] flex items-center justify-center shrink-0 mt-0.5 border border-[#0284C7]/20">
                          <Star size={16} />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <strong className="text-xs font-bold text-stone-900">{v.title}</strong>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-[#E0F2FE] text-[#0284C7] rounded border border-[#0284C7]/30">
                              {v.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 mt-0.5">{v.description}</p>
                          
                          {/* Conditions Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-[10px] bg-white border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded font-medium">
                              Đơn từ {formatVnd(v.minOrderValue)}
                            </span>
                            {v.timeSlot === "custom" && v.timeStart && v.timeEnd && (
                              <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                                ⚡ Giờ vàng: {v.timeStart} – {v.timeEnd}
                              </span>
                            )}
                            <span className="text-[10px] bg-white border border-stone-200 text-stone-500 px-1.5 py-0.5 rounded">
                              Hạn: {v.endDate.split("-").reverse().join("/")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <a
                          href={`/dat-lich?voucher=${encodeURIComponent(v.code)}`}
                          className="px-2.5 py-1 text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white rounded text-center shadow-xs transition cursor-pointer"
                        >
                          Dùng
                        </a>
                        <button
                          type="button"
                          onClick={() => copyContent(v.code)}
                          className="px-2 py-0.5 text-[10px] font-semibold text-stone-500 hover:text-stone-800 bg-white border border-stone-200 rounded text-center transition cursor-pointer"
                        >
                          Chép mã
                        </button>
                      </div>
                    </div>
                  </article>
                ))
            )}
          </div>
        </aside>
      </section>

      {/* DIALOG NẠP TIỀN VIETQR ĐỘNG */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="sm:max-w-[420px] p-6 bg-white rounded-md">
          <DialogHeader>
            <p className="kicker text-[#0284C7]">VIETQR NAPAS 24/7</p>
            <DialogTitle className="text-2xl font-bold tracking-tight">Nạp Ví Sạch+ Tức Thì</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Quét mã QR từ bất kỳ ứng dụng ngân hàng nào (Vietcombank, MB, Techcombank...).
            </DialogDescription>
          </DialogHeader>

          {/* Chọn số tiền */}
          <div className="my-3">
            <span className="text-xs font-bold text-stone-700 block mb-2">Chọn số tiền nạp:</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { amount: 50000, label: "50.000₫", bonus: "" },
                { amount: 100000, label: "100.000₫", bonus: "" },
                { amount: 200000, label: "200.000₫", bonus: "+10k bonus" },
                { amount: 500000, label: "500.000₫", bonus: "+50k bonus" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.amount}
                  className={`p-2.5 rounded-md border text-left font-bold text-xs transition ${
                    depositAmount === item.amount
                      ? "bg-[#E0F2FE] border-[#0284C7] text-[#0369A1] ring-1 ring-[#0284C7]"
                      : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                  onClick={() => setDepositAmount(item.amount)}
                >
                  <span className="block text-sm">{item.label}</span>
                  {item.bonus && <small className="text-[#0369A1] font-extrabold text-[10px]">{item.bonus}</small>}
                </button>
              ))}
            </div>
          </div>

          {/* Khung mã QR VietQR */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-md flex flex-col items-center justify-center my-2 text-center">
            <div className="w-48 h-48 bg-white p-2 border border-stone-200 rounded-md flex items-center justify-center shadow-inner relative">
              <img
                src={`https://api.vietqr.io/image/970423-8888668899-compact2.jpg?amount=${depositAmount}&addInfo=NAP%20SACHPLUS%200901234567&accountName=SACH%20PLUS%20VINHOMES`}
                alt="Mã VietQR nạp tiền"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback nếu ảnh không load
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <QrCode size={110} className="text-[#0369A1] absolute -z-10" />
            </div>

            <div className="w-full mt-3 space-y-1 text-xs text-left bg-white p-3 rounded-md border border-stone-200 font-mono">
              <div className="flex justify-between">
                <span className="text-stone-500">Ngân hàng:</span>
                <strong>TPBank (Tiên Phong)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Số tài khoản:</span>
                <span className="font-bold flex items-center gap-1">
                  8888 6688 99
                  <Copy size={13} className="cursor-pointer text-[#0369A1]" onClick={() => copyContent("8888668899")} />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nội dung CK:</span>
                <span className="font-bold text-[#0369A1] flex items-center gap-1">
                  NAP SACHPLUS 0901
                  <Copy size={13} className="cursor-pointer text-[#0369A1]" onClick={() => copyContent("NAP SACHPLUS 0901")} />
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-2.5 border border-stone-200 text-stone-600 rounded-md text-xs font-bold"
              onClick={() => setDepositOpen(false)}
            >
              Để sau
            </button>
            <button
              type="button"
              className="px-5 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md text-xs font-bold shadow-md flex items-center gap-1.5"
              onClick={handleDepositSuccess}
            >
              <Check size={15} /> Tôi đã chuyển khoản xong
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG GIẢI THÍCH CÔNG THỨC GIẶT XANH */}
      <Dialog open={ecoModalOpen} onOpenChange={setEcoModalOpen}>
        <DialogContent className="sm:max-w-[460px] p-6 bg-white rounded-md">
          <DialogHeader>
            <p className="kicker text-[#0284C7]">TRANSPARENT ECO-METRICS</p>
            <DialogTitle className="text-xl font-bold tracking-tight">Minh bạch chỉ số Giặt Xanh</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs text-stone-600 leading-relaxed my-2">
            <div className="p-3 bg-[#E0F2FE] rounded-md border border-[#E2E8F0]">
              <strong className="text-[#0284C7] block text-sm mb-1">💧 Công thức tính Nước tiết kiệm (142L):</strong>
              <p>Mỗi mẻ giặt máy gia thông thường: tiêu hao ~70 Lít nước.<br />
              Máy công nghiệp tại Sạch+ với cảm biến tải trọng: tiêu hao ~47.2 Lít nước.<br />
              → Tiết kiệm trung bình: <strong>22.8 Lít / mẻ giặt</strong>. Với 6.2 mẻ giặt tháng này của bạn = 142 Lít.</p>
            </div>

            <div className="p-3 bg-[#F0F9FF] rounded-md border border-[#F0F9FF]">
              <strong className="text-[#0369A1] block text-sm mb-1">⚡ Điện năng giảm tải (4.2 kWh):</strong>
              <p>Hệ thống động cơ Inverter biến tần trực tiếp giảm 35% điện năng tiêu hao so với dòng máy giặt dây curoa truyền thống.</p>
            </div>

            <div className="p-3 bg-[#E0F2FE] rounded-md border border-[#E2E8F0]">
              <strong className="text-[#0284C7] block text-sm mb-1">♻️ Túi vải Canvas tuần hoàn:</strong>
              <p>100% đơn giao nhận tại Vinhomes SG Park sử dụng túi vải giặt khử khuẩn tái sử dụng, loại bỏ hoàn toàn túi nilon xả thải ra môi trường.</p>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2 bg-stone-900 text-white font-bold rounded-md text-xs mt-2"
            onClick={() => setEcoModalOpen(false)}
          >
            Đã hiểu
          </button>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </main>
  );
}
