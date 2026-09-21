"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Coffee, Minus, Plus, ShoppingBag, Trash2, CheckCircle2, Clock, QrCode, X, Receipt } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatVnd, getCafeMenu, createCafeOrder, type CafeMenuItem } from "@/lib/sachplus-data";
import { getCurrentUser } from "@/lib/sachplus-auth";

export default function CafePage() {
  const [menu, setMenu] = useState<CafeMenuItem[]>([]);
  const [category, setCategory] = useState("Tất cả");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [mode, setMode] = useState("Chờ lấy đồ");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [isCartVisible, setIsCartVisible] = useState(false);
  const cartRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMenu(getCafeMenu());
    const u = getCurrentUser();
    if (u) setCustomerName(u.name);

    const handleMenuUpdate = () => {
      setMenu(getCafeMenu());
    };

    window.addEventListener("sachplus:menu-updated", handleMenuUpdate);
    return () => {
      window.removeEventListener("sachplus:menu-updated", handleMenuUpdate);
    };
  }, []);

  useEffect(() => {
    if (!cartRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCartVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(cartRef.current);
    return () => observer.disconnect();
  }, []);

  const activeMenu = menu.filter((item) => item.status !== "archived");
  const visible = category === "Tất cả" ? activeMenu : activeMenu.filter((item) => item.category === category);
  const items = menu.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] }));
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discount = mode === "Chờ lấy đồ" && subtotal >= 50000 ? Math.round(subtotal * 0.1) : 0;

  const update = (id: string, by: number) => {
    const targetItem = menu.find((m) => m.id === id);
    const availableStock = targetItem?.stock ?? 999;
    const currentQty = cart[id] || 0;
    const nextQty = currentQty + by;

    if (by > 0 && nextQty > availableStock) {
      toast.error(
        `Rất tiếc, món "${targetItem?.name}" hiện chỉ còn ${availableStock} ${targetItem?.unit || "ly"} trong kho!`
      );
      return;
    }

    setCart((current) => ({ ...current, [id]: Math.max(0, nextQty) }));
  };

  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    items: { id: string; name: string; quantity: number; price: number }[];
    subtotal: number;
    discount: number;
    total: number;
    mode: string;
    customerName: string;
    note: string;
    createdAt: string;
  } | null>(null);

  const order = () => {
    if (!items.length) return;
    const newCafeOrder = createCafeOrder({
      items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      mode,
      customerName: customerName || "Cư dân",
      note: note || "",
    });

    setConfirmedOrder({ ...newCafeOrder, note: newCafeOrder.note || "" });
    setCart({});
    toast.success(`Đã nhận đơn Café #${newCafeOrder.id}! Đang chuẩn bị phục vụ trong 8 phút.`);
  };

  return (
    <main>
      <SiteHeader active="Sạch+ Café" />

      {/* Hero Café */}
      <section className="subpage-hero cafe-page-hero">
        <div>
          <p className="kicker text-sky-100 font-extrabold flex items-center gap-1.5">
            <Coffee size={15} /> SẠCH+ CAFÉ · LẦU 1 (07:00 – 22:00)
          </p>
          <h1>
            Một góc ngon lành<br />
            <em>trong lúc đồ giặt được chăm sóc.</em>
          </h1>
          <p className="text-white/95 text-base leading-relaxed">
            Gọi món trước khi ghé hoặc ngồi lại làm việc trên lầu 1. Wi-Fi tốc độ cao, máy lạnh mát và không gian yên tĩnh sẵn sàng đón bạn.
          </p>
        </div>
        <aside>
          <strong>−10%</strong>
          <span>
            Ưu đãi khách chờ giặt đồ<br />
            cho hóa đơn Café từ 50.000₫
          </span>
        </aside>
      </section>

      {/* Menu & Cart */}
      <section className="cafe-shop">
        <div className="menu-area">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="category-tabs">
              {["Tất cả", "Cà phê", "Trà", "Trái cây", "Bánh"].map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="product-grid">
            {visible.map((item) => {
              const isOutOfStock = (item.stock ?? 0) <= 0;
              const isLowStock = !isOutOfStock && (item.stock ?? 0) <= (item.alertThreshold ?? 10);

              return (
                <article
                  className={`product-card relative transition ${
                    isOutOfStock ? "opacity-75 grayscale-[20%]" : ""
                  }`}
                  key={item.id}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="drink-art-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80";
                      }}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded shadow">
                          Tạm hết hàng
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <div className="flex items-center justify-between gap-1">
                      <span>{item.category}</span>
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          Hết hàng
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Chỉ còn {item.stock} {item.unit || "ly"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          Còn {item.stock} {item.unit || "ly"}
                        </span>
                      )}
                    </div>
                    <h2>{item.name}</h2>
                    <p>{item.note}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <strong>{formatVnd(item.price)}</strong>
                      <span className="text-[11px] text-stone-500 font-medium">/ {item.unit || "ly"}</span>
                    </div>
                  </div>

                  {isOutOfStock ? (
                    <button
                      disabled
                      className="add-product opacity-50 cursor-not-allowed bg-stone-100 text-stone-400 border border-stone-200 shadow-none hover:bg-stone-100"
                    >
                      Hết hàng
                    </button>
                  ) : cart[item.id] ? (
                    <div className="quantity-control">
                      <button aria-label={`Giảm ${item.name}`} onClick={() => update(item.id, -1)}>
                        <Minus size={14} />
                      </button>
                      <b>{cart[item.id]}</b>
                      <button
                        aria-label={`Thêm ${item.name}`}
                        onClick={() => update(item.id, 1)}
                        disabled={(cart[item.id] || 0) >= (item.stock ?? 999)}
                        className={(cart[item.id] || 0) >= (item.stock ?? 999) ? "opacity-40 cursor-not-allowed" : ""}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button className="add-product cursor-pointer" onClick={() => update(item.id, 1)}>
                      <Plus size={14} /> Thêm
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Giỏ hàng thanh toán */}
        <aside className="cart-panel" id="cart-checkout-panel" ref={cartRef}>
          <div className="cart-title">
            <div>
              <p className="kicker">GIỎ MÓN CỦA BẠN</p>
              <h2>
                {items.length
                  ? `${items.reduce((sum, item) => sum + item.quantity, 0)} món đã chọn`
                  : "Chưa chọn món"}
              </h2>
            </div>
            <ShoppingBag />
          </div>

          {!items.length ? (
            <div className="empty-cart">
              <Coffee />
              <p>Hãy chọn món yêu thích để Sạch+ chuẩn bị sẵn khi bạn ghé gửi hoặc chờ nhận đồ nhé.</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id}>
                    <span>{item.quantity}×</span>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{formatVnd(item.price)}</small>
                    </div>
                    <b>{formatVnd(item.price * item.quantity)}</b>
                    <button
                      aria-label={`Xóa ${item.name}`}
                      onClick={() => setCart((current) => ({ ...current, [item.id]: 0 }))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="my-3">
                <span className="text-xs font-bold text-[#0284C7] block mb-1">Phương thức nhận món:</span>
                <RadioGroup value={mode} onValueChange={setMode} className="receive-mode">
                  {[
                    ["Chờ lấy đồ", "Giảm 10%"],
                    ["Ngồi tại lầu 1", "Phục vụ tại bàn"],
                    ["Mang đi tầng trệt", "Nhận tại quầy bar"],
                  ].map(([label, note]) => (
                    <label key={label}>
                      <RadioGroupItem value={label} />
                      <span>
                        <strong>{label}</strong>
                        <small>{note}</small>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <label className="cart-field">
                Tên người nhận món
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Tên của bạn" />
              </label>

              <label className="cart-field">
                Ghi chú pha chế
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ít đá, ít đường, không sữa đặc..."
                />
              </label>

              <div className="cart-summary">
                <p>
                  <span>Tạm tính</span>
                  <b>{formatVnd(subtotal)}</b>
                </p>
                {discount > 0 && (
                  <p className="discount">
                    <span>Ưu đãi khách chờ giặt (-10%)</span>
                    <b>−{formatVnd(discount)}</b>
                  </p>
                )}
                <p className="cart-total">
                  <span>Tổng thanh toán</span>
                  <strong>{formatVnd(subtotal - discount)}</strong>
                </p>
              </div>

              <button className="order-cafe" onClick={order}>
                Xác nhận đặt món · Phục vụ sau 8 phút
              </button>
            </>
          )}
        </aside>
      </section>

      {/* Mobile Floating Quick Cart Bar */}
      {items.length > 0 && !isCartVisible && (
        <div className="md:hidden fixed bottom-[74px] left-3 right-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <a
            href="#cart-checkout-panel"
            className="flex items-center justify-between px-4 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl shadow-xl shadow-sky-950/20 font-semibold text-sm transition"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span>{items.reduce((s, i) => s + i.quantity, 0)} món đã chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold">{formatVnd(subtotal - discount)}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Xem giỏ →</span>
            </div>
          </a>
        </div>
      )}

      {/* Confirmation Receipt Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-sky-600">
                <CheckCircle2 size={24} />
                <span className="font-bold text-sm uppercase tracking-wider">Đã tiếp nhận đơn Café</span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center py-3 border-b border-slate-100">
              <span className="text-xs text-slate-400 block font-semibold">Mã đơn gọi món</span>
              <strong className="text-3xl font-extrabold tracking-tight text-slate-900 block mt-0.5">
                #{confirmedOrder.id}
              </strong>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mt-2">
                <Clock size={13} /> Đang pha chế · Dự kiến phục vụ trong 8 phút
              </div>
            </div>

            <div className="my-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Khách hàng:</span>
                <strong className="text-slate-800">{confirmedOrder.customerName}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hình thức nhận món:</span>
                <strong className="text-sky-700">{confirmedOrder.mode}</strong>
              </div>
              {confirmedOrder.note && (
                <div className="flex justify-between text-slate-500">
                  <span>Ghi chú:</span>
                  <span className="text-slate-700 italic">{confirmedOrder.note}</span>
                </div>
              )}

              <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                {confirmedOrder.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-slate-700">
                    <span>{i.name} × {i.quantity}</span>
                    <span className="font-semibold">{formatVnd(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                  <span>Ưu đãi khách chờ giặt (-10%):</span>
                  <span>−{formatVnd(confirmedOrder.discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
                <span>Tổng thanh toán:</span>
                <span className="text-lg text-sky-600">{formatVnd(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-center flex items-center justify-center gap-3 text-xs text-slate-600 mb-5">
              <QrCode size={36} className="text-sky-600 shrink-0" />
              <span className="text-left text-[11px] leading-relaxed">
                Đưa mã này cho Barista tại <b>Quầy Bar Lầu 1</b> hoặc nhân viên phục vụ bàn sẽ mang đến tận nơi.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-md transition shadow-sm"
              >
                Hoàn tất & Tiếp tục xem menu
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </main>
  );
}
