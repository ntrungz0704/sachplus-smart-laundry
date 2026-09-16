"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Coffee, Home, MapPin, PackageCheck, Shirt, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { createLaundryOrder, formatVnd, serviceCatalog, type LaundryService } from "@/lib/sachplus-data";

const cafeAddons = [
  { name: "Bạc xỉu", price: 35000 },
  { name: "Matcha Latte", price: 39000 },
  { name: "Croissant bơ", price: 32000 },
];

export function BookingDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [service, setService] = useState<LaundryService>("Giặt & sấy");
  const [journey, setJourney] = useState("Lấy tại nhà → giao tận nhà");
  const [date, setDate] = useState("2026-09-18");
  const [time, setTime] = useState("17:00 – 19:00");
  const [name, setName] = useState("An Nguyễn");
  const [phone, setPhone] = useState("");
  const [express, setExpress] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const basePrice = serviceCatalog.find((item) => item.name === service)?.price ?? 69000;
  const cafeTotal = cafeAddons.filter((item) => addons.includes(item.name)).reduce((sum, item) => sum + item.price, 0);
  const total = useMemo(() => basePrice + cafeTotal + (express ? 30000 : 0), [basePrice, cafeTotal, express]);

  const toggleAddon = (name: string) => setAddons((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);
  const reset = () => { setStep(1); setConfirmedId(null); setExpress(false); setAddons([]); };

  const submit = () => {
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại để cửa hàng xác nhận lịch lấy đồ.");
      return;
    }
    const order = createLaundryOrder({ service, pickupDate: date, pickupTime: time, journey, express, cafeTotal });
    setConfirmedId(order.id);
    toast.success(`Đã tạo đơn ${order.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setTimeout(reset, 200); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="booking-dialog max-h-[92vh] overflow-y-auto sm:max-w-[760px]">
        {confirmedId ? (
          <div className="booking-success">
            <span><Check size={36} /></span>
            <p className="kicker">ĐẶT LỊCH THÀNH CÔNG</p>
            <DialogTitle>Đơn {confirmedId} đã được tạo</DialogTitle>
            <DialogDescription>Sạch+ sẽ gọi xác nhận trước khi đến lấy đồ. Bạn có thể theo dõi từng công đoạn trong mục “Đơn của tôi”.</DialogDescription>
            <div className="success-recap"><span>{service}</span><strong>{formatVnd(total)}</strong><span>{date.split("-").reverse().join("/")} · {time}</span></div>
            <a href="/orders" className="modal-primary">Theo dõi đơn hàng</a>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="kicker">ĐƠN GIẶT MỚI</p>
              <DialogTitle className="font-serif text-3xl">Đặt lịch lấy đồ</DialogTitle>
              <DialogDescription>Chọn dịch vụ, lịch lấy và xác nhận trong ba bước.</DialogDescription>
            </DialogHeader>
            <div className="booking-progress">
              {["Dịch vụ", "Lấy đồ", "Xác nhận"].map((label, index) => <span key={label} className={step >= index + 1 ? "active" : ""}><b>{step > index + 1 ? <Check size={14} /> : index + 1}</b>{label}</span>)}
            </div>
            <Progress value={(step / 3) * 100} className="booking-bar" />

            {step === 1 && <div className="booking-step">
              <h3>Bạn cần giặt gì?</h3>
              <RadioGroup value={service} onValueChange={(value) => setService(value as LaundryService)} className="service-options">
                {serviceCatalog.map((item, index) => <label key={item.id} className="option-card">
                  <RadioGroupItem value={item.name} />
                  <span className="option-icon">{index === 1 ? <Sparkles /> : <Shirt />}</span>
                  <span><strong>{item.name}</strong><small>{item.detail}</small></span>
                  <b>{formatVnd(item.price)} <small>/ {item.unit}</small></b>
                </label>)}
              </RadioGroup>
              <div className="addon-panel">
                <div><p className="kicker"><Coffee size={14} /> ĐƠN KẾT HỢP</p><h3>Thêm một món cho lúc chờ?</h3><small>Giảm 10% Café khi đặt cùng dịch vụ giặt ủi.</small></div>
                <div className="addon-list">{cafeAddons.map((item) => <label key={item.name}><Checkbox checked={addons.includes(item.name)} onCheckedChange={() => toggleAddon(item.name)} /><span>{item.name}</span><b>{formatVnd(item.price)}</b></label>)}</div>
              </div>
            </div>}

            {step === 2 && <div className="booking-step">
              <h3>Bạn muốn giao nhận thế nào?</h3>
              <RadioGroup value={journey} onValueChange={setJourney} className="journey-options">
                {[
                  ["Lấy tại nhà → giao tận nhà", "Sạch+ lo trọn hai chặng", Home],
                  ["Tự gửi → tự nhận tại cửa hàng", "Ghé khi thuận tiện", PackageCheck],
                  ["Tự gửi → giao tận nhà", "Gửi nhanh tại quầy", Truck],
                ].map(([label, note, Icon]) => <label key={String(label)} className="option-card compact"><RadioGroupItem value={String(label)} /><span className="option-icon"><Icon /></span><span><strong>{String(label)}</strong><small>{String(note)}</small></span></label>)}
              </RadioGroup>
              <div className="field-grid">
                <label>Tên người gửi<input value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label>Số điện thoại<input inputMode="tel" placeholder="090 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                <label>Ngày lấy đồ<input type="date" min="2026-09-18" value={date} onChange={(event) => setDate(event.target.value)} /></label>
                <label>Khung giờ<select value={time} onChange={(event) => setTime(event.target.value)}><option>09:00 – 11:00</option><option>13:00 – 15:00</option><option>17:00 – 19:00</option><option>19:00 – 21:00</option></select></label>
                <label className="full-field">Địa chỉ lấy đồ<span className="field-icon"><MapPin size={17} /><input defaultValue="Vinhomes Sài Gòn Park, Xuân Thới Sơn" /></span></label>
              </div>
            </div>}

            {step === 3 && <div className="booking-step">
              <h3>Kiểm tra đơn của bạn</h3>
              <div className="review-card">
                <div><span>Dịch vụ</span><strong>{service}</strong></div>
                <div><span>Hành trình</span><strong>{journey}</strong></div>
                <div><span>Thời gian</span><strong>{date.split("-").reverse().join("/")} · {time}</strong></div>
                {addons.length > 0 && <div><span>Café</span><strong>{addons.join(", ")}</strong></div>}
              </div>
              <label className="express-box"><Checkbox checked={express} onCheckedChange={(value) => setExpress(Boolean(value))} /><span><strong>Ưu tiên nhanh 6 giờ</strong><small>Nhận lại đồ sạch trong ngày</small></span><b>+30.000₫</b></label>
              <div className="payment-row"><span>Thanh toán</span><div><button type="button" className="selected">Ví Sạch+</button><button type="button">VietQR</button><button type="button">Tiền mặt</button></div></div>
              <div className="total-row"><span>Tổng tạm tính</span><strong>{formatVnd(total)}</strong></div>
            </div>}

            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={() => step === 1 ? setOpen(false) : setStep((value) => value - 1)}>{step === 1 ? "Để sau" : "Quay lại"}</button>
              <button type="button" className="modal-primary" onClick={() => step < 3 ? setStep((value) => value + 1) : submit()}>{step < 3 ? "Tiếp tục" : "Xác nhận & đặt đơn"}</button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
