"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Coffee, Gift, Home, MapPin, PackageCheck, QrCode, Shirt, Sparkles, Tag, Truck, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { createLaundryOrder, formatVnd, getServiceCatalog, getVouchers, validateVoucher, type LaundryService, type VoucherItem } from "@/lib/sachplus-data";
import { getCurrentUser } from "@/lib/sachplus-auth";

const cafeAddons = [
  { name: "Bạc xỉu (Lầu 1)", price: 35000, note: "Pha sẵn đón khách" },
  { name: "Matcha Latte", price: 39000, note: "Matcha Nhật êm dịu" },
  { name: "Croissant bơ nướng", price: 32000, note: "Bánh nóng mới ra lò" },
];

export function BookingDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
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
  const [paymentMethod, setPaymentMethod] = useState("Ví Sạch+");
  const [express, setExpress] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  // Voucher state
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherItem | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherItem[]>([]);

  const catalog = getServiceCatalog();
  const basePrice = catalog.find((item) => item.name === service)?.price ?? 69000;
  const cafeTotal = cafeAddons
    .filter((item) => addons.includes(item.name))
    .reduce((sum, item) => sum + item.price, 0);
  // Khách đặt giặt kèm café được giảm 10% café
  const cafeDiscount = addons.length > 0 ? Math.round(cafeTotal * 0.1) : 0;
  const subtotal = useMemo(
    () => basePrice + (cafeTotal - cafeDiscount) + (express ? 30000 : 0),
    [basePrice, cafeTotal, cafeDiscount, express]
  );
  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  useEffect(() => {
    if (open) {
      const all = getVouchers().filter((v) => v.isActive);
      setAvailableVouchers(all);
      const u = getCurrentUser();
      if (u) {
        if (!name) setName(u.name);
        if (!phone) setPhone(u.phone);
        if (!address) setAddress(u.apartment || "");
      }

      // Tự động tìm và áp dụng mã ưu đãi tốt nhất cho khách hàng
      if (!appliedVoucher) {
        let best: VoucherItem | null = null;
        let maxD = 0;
        for (const v of all) {
          const res = validateVoucher(v.code, subtotal);
          if (res.valid && res.discountAmount > maxD) {
            maxD = res.discountAmount;
            best = res.voucher || v;
          }
        }
        if (best && maxD > 0) {
          setAppliedVoucher(best);
          setDiscountAmount(maxD);
          setVoucherInput(best.code);
        }
      }
    }
  }, [open]);

  // Cập nhật lại mức giảm khi giá trị đơn thay đổi
  useEffect(() => {
    if (appliedVoucher) {
      const res = validateVoucher(appliedVoucher.code, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
      } else {
        setAppliedVoucher(null);
        setDiscountAmount(0);
      }
    }
  }, [subtotal]);

  const toggleAddon = (name: string) =>
    setAddons((items) =>
      items.includes(name) ? items.filter((item) => item !== name) : [...items, name]
    );

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
    toast.info("Đã hủy mã ưu đãi.");
  };

  const reset = () => {
    setStep(1);
    setConfirmedId(null);
    setExpress(false);
    setAddons([]);
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherInput("");
  };

  const submit = () => {
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để nhân viên Sạch+ liên hệ xác nhận lấy đồ.");
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
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
    });
    setConfirmedId(order.id);
    toast.success(`Đã tạo đơn ${order.id} thành công!`);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setTimeout(reset, 200); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="booking-dialog max-h-[94vh] overflow-y-auto sm:max-w-[720px] p-6 md:p-8">
        {confirmedId ? (
          <div className="booking-success">
            <span><Check size={36} /></span>
            <p className="kicker">ĐẶT LỊCH THÀNH CÔNG</p>
            <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight">Đơn #{confirmedId} đã được tạo</DialogTitle>
            <DialogDescription className="text-sm md:text-base text-stone-600 max-w-md mx-auto">
              Nhân viên Sạch+ Vinhomes Sài Gòn Park sẽ gọi xác nhận trong 5 phút. Túi đồ của bạn đã được cấp mã QR định danh riêng.
            </DialogDescription>
            <div className="success-recap">
              <div>
                <small className="text-xs text-stone-500 block">Dịch vụ</small>
                <strong>{service}</strong>
              </div>
              <div className="text-center">
                <small className="text-xs text-stone-500 block">Tổng thanh toán</small>
                <strong className="text-[#0284C7] text-lg">{formatVnd(total)}</strong>
              </div>
              <div className="text-right">
                <small className="text-xs text-stone-500 block">Khung giờ</small>
                <strong>{date.split("-").reverse().join("/")} · {time}</strong>
              </div>
            </div>
            <div className="p-3 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md w-full text-xs text-[#0369A1] flex items-center justify-center gap-2">
              <QrCode size={16} /> Mã túi đồ: <strong>{confirmedId}-SGPARK</strong> (In tem lúc nhận đồ)
            </div>
            <a href="/don-cua-toi" className="modal-primary w-full md:w-auto">Theo dõi tiến độ đơn hàng</a>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <p className="kicker">SẠCH+ LAUNDRY & COFFEE</p>
                <span className="text-xs font-bold text-[#0369A1] bg-[#F0F9FF] px-2 py-0.5 rounded-full">Bước {step}/3</span>
              </div>
              <DialogTitle className="font-bold tracking-tight text-2xl md:text-3xl">Đặt lịch lấy đồ tận nơi</DialogTitle>
              <DialogDescription className="text-stone-500 text-sm">
                Quy trình 3 bước tiện lợi cho cư dân Vinhomes Sài Gòn Park.
              </DialogDescription>
            </DialogHeader>

            <div className="booking-progress">
              {["1. Chọn dịch vụ", "2. Giao nhận", "3. Xác nhận"].map((label, index) => (
                <span key={label} className={step >= index + 1 ? "active" : ""}>
                  <b>{step > index + 1 ? <Check size={14} /> : index + 1}</b>
                  {label}
                </span>
              ))}
            </div>
            <Progress value={(step / 3) * 100} className="booking-bar" />

            {/* BƯỚC 1: DỊCH VỤ & COMBO CAFÉ */}
            {step === 1 && (
              <div className="booking-step">
                <h3>Bạn cần giặt trang phục hay đồ gì hôm nay?</h3>
                <RadioGroup value={service} onValueChange={(value) => setService(value as LaundryService)} className="service-options">
                  {catalog.map((item, index) => (
                    <label key={item.id} className="option-card">
                      <RadioGroupItem value={item.name} />
                      <span className="option-icon">
                        {index === 1 ? <Sparkles size={20} /> : <Shirt size={20} />}
                      </span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <b>
                        {formatVnd(item.price)} <small className="text-xs text-stone-500">/ {item.unit}</small>
                      </b>
                    </label>
                  ))}
                </RadioGroup>

                {/* Cross-sell combo Café */}
                <div className="addon-panel">
                  <div>
                    <p className="kicker"><Coffee size={14} /> COMBO CHỜ SẠCH · LẦU 1</p>
                    <h3>Thưởng thức café trong lúc chờ đồ?</h3>
                    <small>Ưu đãi giảm 10% món Café khi đặt chung với dịch vụ giặt ủi.</small>
                  </div>
                  <div className="addon-list">
                    {cafeAddons.map((item) => (
                      <label key={item.name}>
                        <Checkbox checked={addons.includes(item.name)} onCheckedChange={() => toggleAddon(item.name)} />
                        <div>
                          <span>{item.name}</span>
                          <small className="block text-stone-400 text-[11px]">{item.note}</small>
                        </div>
                        <b>{formatVnd(item.price)}</b>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BƯỚC 2: PHƯƠNG THỨC GIAO NHẬN & THỜI GIAN */}
            {step === 2 && (
              <div className="booking-step">
                <h3>Bạn muốn hình thức giao nhận như thế nào?</h3>
                <RadioGroup value={journey} onValueChange={setJourney} className="journey-options">
                  {[
                    ["Lấy tại nhà → giao tận nhà", "Nhân viên đến nhận tận cửa căn hộ và giao lại khi hoàn tất", Home],
                    ["Tự gửi tại quầy → giao tận nhà", "Ghé quầy tầng trệt gửi đồ nhanh, đồ giặt xong giao tận căn hộ", PackageCheck],
                    ["Tự gửi → tự nhận tại cửa hàng", "Ghé gửi và nhận đồ trực tiếp tại Shophouse Sạch+", Truck],
                  ].map(([label, note, Icon]) => (
                    <label key={String(label)} className="option-card compact">
                      <RadioGroupItem value={String(label)} />
                      <span className="option-icon"><Icon size={18} /></span>
                      <span>
                        <strong>{String(label)}</strong>
                        <small>{String(note)}</small>
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                <div className="field-grid">
                  <label>
                    Họ & tên người gửi
                    <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nhập họ tên" />
                  </label>
                  <label>
                    Số điện thoại liên hệ *
                    <input
                      inputMode="tel"
                      placeholder="090 123 4567"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </label>
                  <label>
                    Ngày lấy đồ
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </label>
                  <label>
                    Khung giờ lấy đồ
                    <select value={time} onChange={(event) => setTime(event.target.value)}>
                      <option>09:00 – 11:00 (Sáng)</option>
                      <option>13:00 – 15:00 (Trưa)</option>
                      <option>17:00 – 19:00 (Chiều tối)</option>
                      <option>19:00 – 21:00 (Tối muộn)</option>
                    </select>
                  </label>
                  <label className="full-field">
                    Địa chỉ căn hộ tại Vinhomes Sài Gòn Park
                    <span className="field-icon">
                      <MapPin size={17} className="text-[#0369A1]" />
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số căn, Tòa tháp, Phân khu..."
                      />
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* BƯỚC 3: XÁC NHẬN VÀ THANH TOÁN */}
            {step === 3 && (
              <div className="booking-step">
                <h3>Xác nhận thông tin đơn hàng</h3>
                <div className="review-card">
                  <div><span>Dịch vụ chính</span><strong>{service}</strong></div>
                  <div><span>Hình thức</span><strong>{journey}</strong></div>
                  <div><span>Thời gian hẹn</span><strong>{date.split("-").reverse().join("/")} ({time})</strong></div>
                  <div><span>Địa chỉ</span><strong>{address}</strong></div>
                  <div><span>Người gửi</span><strong>{name} ({phone})</strong></div>
                  {addons.length > 0 && (
                    <div>
                      <span>Café đặt kèm (-10%)</span>
                      <strong className="text-[#0369A1]">{addons.join(", ")} (−{formatVnd(cafeDiscount)})</strong>
                    </div>
                  )}
                  {appliedVoucher && (
                    <div className="text-emerald-700 font-bold">
                      <span>Voucher [{appliedVoucher.code}]</span>
                      <strong className="text-emerald-700">−{formatVnd(discountAmount)}</strong>
                    </div>
                  )}
                </div>

                {/* Voucher / Mã ưu đãi */}
                <div className="p-3 bg-[#F0F9FF] border border-[#0284C7]/20 rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5">
                      <Gift size={15} /> Mã ưu đãi / Voucher cư dân
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
                    <div className="space-y-1.5">
                      <div className="p-2.5 bg-white rounded-md border border-emerald-300 flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                              ✨ Đã tự động áp dụng
                            </span>
                            <span className="font-bold text-emerald-900 font-mono flex items-center gap-1">
                              <Check size={13} className="text-emerald-600" /> {appliedVoucher.code}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700 block mt-0.5">
                            Đã giảm <strong className="text-emerald-900 font-bold">{formatVnd(discountAmount)}</strong> vào tổng hóa đơn
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            -{formatVnd(discountAmount)}
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveVoucher}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                            title="Hủy mã"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      {availableVouchers.filter((v) => v.code !== appliedVoucher.code).length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap text-[10px]">
                          <span className="text-stone-500">Đổi mã:</span>
                          {availableVouchers
                            .filter((v) => v.code !== appliedVoucher.code)
                            .slice(0, 3)
                            .map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => handleApplyVoucher(v.code)}
                                className="px-1.5 py-0.5 bg-white hover:bg-sky-50 text-[#0284C7] border border-sky-200 rounded font-mono font-bold transition cursor-pointer"
                              >
                                {v.code}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={voucherInput}
                          onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                          placeholder="Mã ưu đãi (VD: SACHPLUS30)..."
                          className="flex-1 px-2.5 py-1.5 text-xs uppercase font-mono bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0284C7]"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyVoucher()}
                          className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs rounded transition cursor-pointer"
                        >
                          Áp dụng
                        </button>
                      </div>

                      {availableVouchers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {availableVouchers.slice(0, 3).map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handleApplyVoucher(v.code)}
                              className="text-[10px] font-mono px-1.5 py-0.5 bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30 rounded font-bold transition cursor-pointer flex items-center gap-0.5"
                            >
                              <Tag size={9} /> {v.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <label className="express-box cursor-pointer">
                  <Checkbox checked={express} onCheckedChange={(value) => setExpress(Boolean(value))} />
                  <span>
                    <strong className="flex items-center gap-1.5"><Zap size={16} className="text-[#0284C7]" /> Giặt hỏa tốc 6 giờ</strong>
                    <small>Ưu tiên đưa vào máy giặt sấy ngay, nhận lại trong ngày</small>
                  </span>
                  <b>+30.000₫</b>
                </label>

                <div className="payment-row">
                  <span>Phương thức thanh toán</span>
                  <div>
                    {["Ví Sạch+", "VietQR NAPAS", "Tiền mặt"].map((method) => (
                      <button
                        type="button"
                        key={method}
                        className={paymentMethod === method ? "selected" : ""}
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="total-row">
                  <span>Tổng thanh toán tạm tính</span>
                  <strong>{formatVnd(total)}</strong>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-secondary"
                onClick={() => (step === 1 ? setOpen(false) : setStep((value) => value - 1))}
              >
                {step === 1 ? "Đóng lại" : "Quay lại"}
              </button>
              <button
                type="button"
                className="modal-primary"
                onClick={() => (step < 3 ? setStep((value) => value + 1) : submit())}
              >
                {step < 3 ? "Tiếp tục" : "Xác nhận & Đặt đơn"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
