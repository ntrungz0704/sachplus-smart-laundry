"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Coffee,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Clock,
  QrCode,
  X,
  ShieldAlert,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  formatVnd,
  getCafeMenu,
  createCafeOrder,
  type CafeMenuItem,
  getWalletBalance,
  deductWalletBalance,
} from "@/lib/sachplus-data";
import { getCurrentUser, switchRole, type UserProfile } from "@/lib/sachplus-auth";

export default function CafePage() {
  const [menu, setMenu] = useState<CafeMenuItem[]>([]);
  const [category, setCategory] = useState("Tất cả");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [mode, setMode] = useState("Chờ lấy đồ");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"counter" | "wallet">("counter");
  const [walletBalance, setWalletBalance] = useState(0);
  const cartRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMenu(getCafeMenu());
    const u = getCurrentUser();
    setCurrentUser(u);
    if (u) {
      setCustomerName(u.name);
      setWalletBalance(getWalletBalance(u.id));
    }

    const handleMenuUpdate = () => {
      setMenu(getCafeMenu());
    };

    const handleAuth = (e: Event) => {
      const cu = (e as CustomEvent<UserProfile | null>).detail ?? getCurrentUser();
      setCurrentUser(cu);
      if (cu) {
        setCustomerName(cu.name);
        setWalletBalance(getWalletBalance(cu.id));
      }
    };

    const handleWallet = () => {
      const cu = getCurrentUser();
      if (cu) setWalletBalance(getWalletBalance(cu.id));
    };

    window.addEventListener("sachplus:menu-updated", handleMenuUpdate);
    window.addEventListener("sachplus:auth-changed", handleAuth);
    window.addEventListener("sachplus:wallet-updated", handleWallet);
    return () => {
      window.removeEventListener("sachplus:menu-updated", handleMenuUpdate);
      window.removeEventListener("sachplus:auth-changed", handleAuth);
      window.removeEventListener("sachplus:wallet-updated", handleWallet);
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
    if (currentUser?.role === "admin") {
      toast.error("Tài khoản Quản Trị Viên (Admin) không có quyền mua hàng. Vui lòng chuyển sang tài khoản Cư dân!");
      return;
    }
    if (!items.length) return;

    const finalTotal = Math.max(0, subtotal - discount);

    if (paymentMethod === "wallet") {
      if (!currentUser) {
        toast.error("Vui lòng đăng nhập để thanh toán bằng Ví Sạch+.");
        return;
      }
      if (walletBalance < finalTotal) {
        toast.error(`Số dư Ví Sạch+ không đủ (${formatVnd(walletBalance)}). Vui lòng chọn thanh toán tại quầy hoặc nạp thêm ví.`);
        return;
      }
    }

    const newCafeOrder = createCafeOrder({
      items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      subtotal,
      discount,
      total: finalTotal,
      mode,
      customerName: customerName || "Cư dân",
      note: note ? `${note} · [TT: ${paymentMethod === "wallet" ? "Đã trừ Ví Sạch+" : "Thanh toán tại quầy"}]` : `[TT: ${paymentMethod === "wallet" ? "Đã trừ Ví Sạch+" : "Thanh toán tại quầy"}]`,
    });

    if (paymentMethod === "wallet" && currentUser) {
      deductWalletBalance(
        finalTotal,
        currentUser.id,
        newCafeOrder.id,
        `Thanh toán đơn Sạch+ Café #${newCafeOrder.id}`
      );
      setWalletBalance(getWalletBalance(currentUser.id));
      toast.success(`Đã thanh toán ${formatVnd(finalTotal)} từ Ví Sạch+ thành công!`);
    }

    setConfirmedOrder({ ...newCafeOrder, note: newCafeOrder.note || "" });
    setCart({});
    toast.success(`Đã nhận đơn Café #${newCafeOrder.id}! Đang chuẩn bị phục vụ trong 8 phút.`);
  };

  return (
    <main>
      <SiteHeader active="Sạch+ Café" />

      {/* Admin Permission Warning Banner */}
      {currentUser?.role === "admin" && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-3 text-amber-950 backdrop-blur-xs">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="text-xs">
                <strong className="block text-sm font-bold text-amber-900">
                  CHẾ ĐỘ QUẢN TRỊ VIÊN (ADMIN) — KHÔNG ĐƯỢC PHÉP MUA HÀNG
                </strong>
                <span className="text-amber-800">
                  Theo quy định phân quyền hệ thống, tài khoản Admin chỉ quản trị danh mục/giá bán và vận hành, không được phép đặt đồ uống. Vui lòng chuyển sang tài khoản Cư dân (User) để đặt món.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  switchRole("customer");
                  toast.success("Đã chuyển sang tài khoản Cư dân (User). Giờ bạn có thể đặt món!");
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Chuyển sang Cư dân (User) <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Payment Method Selector */}
              <div className="my-3 pt-2 border-t border-stone-200">
                <span className="text-xs font-bold text-[#0284C7] block mb-1.5">Hình thức thanh toán:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("counter")}
                    className={`p-2 rounded-lg border text-left text-xs font-semibold transition cursor-pointer ${
                      paymentMethod === "counter"
                        ? "border-[#0284C7] bg-sky-50 text-[#0284C7]"
                        : "border-stone-200 hover:border-stone-300 text-stone-700 bg-white"
                    }`}
                  >
                    <div className="font-bold">Tại quầy / Tiền mặt</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Tiền mặt hoặc POS thẻ</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`p-2 rounded-lg border text-left text-xs font-semibold transition cursor-pointer ${
                      paymentMethod === "wallet"
                        ? "border-[#0284C7] bg-sky-50 text-[#0284C7]"
                        : "border-stone-200 hover:border-stone-300 text-stone-700 bg-white"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Wallet size={13} className="text-[#0284C7]" /> Ví Sạch+ Pay
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      Dư: {formatVnd(walletBalance)}
                    </div>
                  </button>
                </div>
              </div>

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

              {currentUser?.role === "admin" && (
                <div className="my-2 p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Admin không được phép mua hàng</strong>
                    <span>Bạn đang đăng nhập tài khoản Quản trị. Vui lòng chuyển sang tài khoản Cư dân (User) để đặt đồ uống.</span>
                  </div>
                </div>
              )}

              <button
                className={`order-cafe ${currentUser?.role === "admin" ? "opacity-50 cursor-not-allowed bg-stone-400 hover:bg-stone-400" : "cursor-pointer"}`}
                onClick={order}
                disabled={currentUser?.role === "admin"}
              >
                {currentUser?.role === "admin"
                  ? "Admin không có quyền đặt món"
                  : "Xác nhận đặt món · Phục vụ sau 8 phút"}
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
