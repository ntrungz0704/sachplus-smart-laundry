"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Headphones, PackageSearch, Plus, Search, Truck } from "lucide-react";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { BookingDialog } from "@/components/sachplus/order-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVnd, getLaundryOrders, type LaundryOrder } from "@/lib/sachplus-data";

const stages = ["Đã đặt", "Phân loại", "Đang giặt", "Đang sấy", "QC", "Đang giao", "Đã nhận"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<LaundryOrder[]>(getLaundryOrders());
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LaundryOrder>(orders[0]);
  useEffect(() => { const refresh = () => setOrders(getLaundryOrders()); window.addEventListener("sachplus:order-created", refresh); return () => window.removeEventListener("sachplus:order-created", refresh); }, []);
  const visible = useMemo(() => orders.filter((order) => (filter === "Tất cả" || (filter === "Đang xử lý" ? order.status !== "Hoàn tất" : order.status === "Hoàn tất")) && `${order.id} ${order.service}`.toLowerCase().includes(query.toLowerCase())), [orders, filter, query]);
  const stageIndex = selected.status === "Hoàn tất" ? 6 : selected.status === "Đang giặt" ? 2 : selected.status === "Đang sấy" ? 3 : selected.status === "Đang giao" ? 5 : selected.status === "QC & đóng gói" ? 4 : 0;
  return <main><SiteHeader active="Đơn của tôi" />
    <section className="subpage-head"><div><p className="kicker">SẠCH+ CARE</p><h1>Đơn giặt của bạn.</h1><p>Theo dõi tiến độ, lịch giao và chi phí trong một nơi.</p></div><BookingDialog><button className="button button-primary"><Plus /> Tạo đơn mới</button></BookingDialog></section>
    <section className="orders-layout">
      <div className="orders-main">
        <div className="orders-tools"><label><Search /><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Tìm theo mã đơn hoặc dịch vụ..." /></label><Tabs value={filter} onValueChange={setFilter}><TabsList className="order-tabs">{["Tất cả","Đang xử lý","Hoàn tất"].map((item)=><TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}</TabsList></Tabs></div>
        <div className="order-table-card"><Table><TableHeader><TableRow><TableHead>Mã đơn</TableHead><TableHead>Dịch vụ & hành trình</TableHead><TableHead>Thời gian</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Thành tiền</TableHead></TableRow></TableHeader><TableBody>{visible.map((order)=><TableRow key={order.id} onClick={()=>setSelected(order)} data-state={selected.id===order.id?"selected":undefined} className="cursor-pointer"><TableCell><strong>{order.id}</strong></TableCell><TableCell><strong>{order.service}</strong><small>{order.journey}<br/>{order.weight||"Chờ cân"}</small></TableCell><TableCell>{order.pickupDate}<small>{order.pickupTime}</small></TableCell><TableCell><span className={`table-status ${order.status==="Hoàn tất"?"complete":"working"}`}><i />{order.status}</span></TableCell><TableCell className="text-right"><strong>{formatVnd(order.total)}</strong></TableCell></TableRow>)}</TableBody></Table></div>
      </div>
      <aside className="order-detail"><div className="detail-head"><div><p className="kicker">CHI TIẾT ĐƠN</p><h2>{selected.id}</h2></div><span className="status-badge"><i /> {selected.status}</span></div><div className="order-bag"><PackageSearch /><div><span>{selected.service}</span><strong>{selected.weight || "Chờ nhân viên cân"}</strong></div><b>{formatVnd(selected.total)}</b></div><Progress value={((stageIndex+1)/7)*100} /><div className="vertical-timeline">{stages.map((stage,index)=><div className={index<=stageIndex?"done":""} key={stage}><b>{index<stageIndex?<Check/>:index+1}</b><span><strong>{stage}</strong><small>{index===stageIndex?"Đang xử lý · cập nhật realtime":index<stageIndex?"Đã hoàn tất":"Chưa bắt đầu"}</small></span></div>)}</div><div className="delivery-estimate"><Truck /><div><span>Dự kiến hoàn tất</span><strong>Hôm nay · 17:30</strong></div></div><button className="support-button"><Headphones /> Báo vấn đề với đơn</button></aside>
    </section><SiteFooter />
  </main>;
}
