"use client";

import { useMemo, useState } from "react";
import { Coffee, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatVnd } from "@/lib/sachplus-data";

const menu = [
  { id: "americano", category: "Cà phê", name: "Americano", note: "Đậm vừa · ít chua", price: 29000, tone: "dark" },
  { id: "bac-xiu", category: "Cà phê", name: "Bạc xỉu", note: "Cà phê sữa dịu", price: 35000, tone: "milk" },
  { id: "latte", category: "Cà phê", name: "Latte", note: "Êm mượt · thơm sữa", price: 39000, tone: "latte" },
  { id: "matcha", category: "Trà", name: "Matcha Latte", note: "Matcha Nhật · sữa tươi", price: 39000, tone: "matcha" },
  { id: "peach", category: "Trà", name: "Trà đào cam sả", note: "Thanh mát · ít ngọt", price: 39000, tone: "peach" },
  { id: "lotus", category: "Trà", name: "Trà sen vàng", note: "Sen thơm · kem sữa", price: 42000, tone: "lotus" },
  { id: "orange", category: "Trái cây", name: "Cam ép", note: "Cam tươi nguyên chất", price: 45000, tone: "orange" },
  { id: "avocado", category: "Trái cây", name: "Sinh tố bơ", note: "Bơ tươi · sánh mịn", price: 49000, tone: "avocado" },
  { id: "croissant", category: "Bánh", name: "Croissant bơ", note: "Nướng mới trong ngày", price: 32000, tone: "bread" },
  { id: "sandwich", category: "Bánh", name: "Bánh mì gà xé", note: "Gọn nhẹ · đủ bữa", price: 45000, tone: "sandwich" },
];

export default function CafePage() {
  const [category, setCategory] = useState("Tất cả");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [mode, setMode] = useState("Chờ lấy đồ");
  const visible = category === "Tất cả" ? menu : menu.filter((item) => item.category === category);
  const items = menu.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] }));
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discount = mode === "Chờ lấy đồ" && subtotal >= 50000 ? Math.round(subtotal * .1) : 0;
  const update = (id: string, by: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + by) }));
  const order = () => { if (!items.length) return; toast.success("Đã đặt món. Sạch+ sẽ chuẩn bị trong khoảng 8 phút."); setCart({}); };

  return <main><SiteHeader active="Sạch+ Café" />
    <section className="subpage-hero cafe-page-hero"><div><p className="kicker">SẠCH+ CAFÉ · 07:00–22:00</p><h1>Một góc ngon lành<br /><em>trong lúc đồ được chăm sóc.</em></h1><p>Gọi trước, ngồi lại hoặc mang đi. Điểm thành viên được cộng chung với dịch vụ giặt ủi.</p></div><aside><strong>−10%</strong><span>cho khách đang chờ giặt<br />với đơn Café từ 50.000₫</span></aside></section>
    <section className="cafe-shop">
      <div className="menu-area">
        <Tabs value={category} onValueChange={setCategory}><TabsList className="category-tabs">{["Tất cả", "Cà phê", "Trà", "Trái cây", "Bánh"].map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></Tabs>
        <div className="product-grid">{visible.map((item) => <article className="product-card" key={item.id}><div className={`drink-art ${item.tone}`}><Coffee /><span>{item.category}</span></div><div className="product-info"><span>{item.category}</span><h2>{item.name}</h2><p>{item.note}</p><strong>{formatVnd(item.price)}</strong></div>{cart[item.id] ? <div className="quantity-control"><button aria-label={`Giảm ${item.name}`} onClick={() => update(item.id,-1)}><Minus /></button><b>{cart[item.id]}</b><button aria-label={`Thêm ${item.name}`} onClick={() => update(item.id,1)}><Plus /></button></div> : <button className="add-product" onClick={() => update(item.id,1)}><Plus /> Thêm</button>}</article>)}</div>
      </div>
      <aside className="cart-panel"><div className="cart-title"><div><p className="kicker">GIỎ CỦA BẠN</p><h2>{items.length ? `${items.reduce((sum,item)=>sum+item.quantity,0)} món` : "Chưa chọn món"}</h2></div><ShoppingBag /></div>
        {!items.length ? <div className="empty-cart"><Coffee /><p>Chọn món để Sạch+ chuẩn bị trong khi bạn gửi hoặc chờ nhận đồ.</p></div> : <>
          <div className="cart-items">{items.map((item) => <div key={item.id}><span>{item.quantity}×</span><div><strong>{item.name}</strong><small>{formatVnd(item.price)}</small></div><b>{formatVnd(item.price * item.quantity)}</b><button aria-label={`Xóa ${item.name}`} onClick={() => setCart((current) => ({...current,[item.id]:0}))}><Trash2 /></button></div>)}</div>
          <RadioGroup value={mode} onValueChange={setMode} className="receive-mode">{[["Chờ lấy đồ","Giảm 10%"],["Ngồi tại quán","Nhận tại bàn"],["Mang đi","Nhận tại quầy"]].map(([label,note])=><label key={label}><RadioGroupItem value={label}/><span><strong>{label}</strong><small>{note}</small></span></label>)}</RadioGroup>
          <label className="cart-field">Tên nhận món<input defaultValue="An Nguyễn" /></label><label className="cart-field">Ghi chú<input placeholder="Ít đá, ít ngọt..." /></label>
          <div className="cart-summary"><p><span>Tạm tính</span><b>{formatVnd(subtotal)}</b></p>{discount > 0 && <p className="discount"><span>Ưu đãi khách giặt</span><b>−{formatVnd(discount)}</b></p>}<p className="cart-total"><span>Thành tiền</span><strong>{formatVnd(subtotal-discount)}</strong></p></div>
          <button className="order-cafe" onClick={order}>Đặt món · nhận sau khoảng 8 phút</button>
        </>}
      </aside>
    </section>
    <SiteFooter />
  </main>;
}
