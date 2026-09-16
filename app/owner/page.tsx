"use client";

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowUpRight, Clock3, Coffee, Download, PackageCheck, Repeat2, Shirt, TrendingUp, Users, WashingMachine } from "lucide-react";
import { OpsShell } from "@/components/sachplus/ops-shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const revenue=[{day:"T2",laundry:5.2,cafe:1.7},{day:"T3",laundry:5.8,cafe:1.9},{day:"T4",laundry:5.5,cafe:2.1},{day:"T5",laundry:6.23,cafe:2.19},{day:"T6",laundry:7.1,cafe:2.5},{day:"T7",laundry:8.4,cafe:3.2},{day:"CN",laundry:7.7,cafe:3.0}];
const mix=[{name:"Laundry",value:74,color:"#0f5b46"},{name:"Café",value:26,color:"#f0bd46"}];

export default function OwnerPage(){return <OpsShell role="owner"><header className="ops-topbar owner-topbar"><div><p>Cập nhật lúc 10:46 · 17/09/2026</p><h1>Tổng quan cửa hàng</h1></div><div><Tabs defaultValue="today"><TabsList><TabsTrigger value="today">Hôm nay</TabsTrigger><TabsTrigger value="week">7 ngày</TabsTrigger><TabsTrigger value="month">Tháng này</TabsTrigger></TabsList></Tabs><button className="export-button"><Download/> Xuất báo cáo</button></div></header>
  <section className="owner-kpis">{[
    ["8.420.000₫","Doanh thu hôm nay","+12,4%",TrendingUp,"positive"],
    ["84","Đơn giặt","+9 đơn",Shirt,"positive"],
    ["62","Đã hoàn thành","74% tổng đơn",PackageCheck,"neutral"],
    ["5","Đơn trễ","Cần xử lý",AlertTriangle,"warning"],
  ].map(([value,label,change,Icon,tone])=><article key={String(label)}><div><span>{label}</span><Icon/></div><strong>{value}</strong><p className={String(tone)}>{change}</p></article>)}</section>
  <section className="owner-charts"><article className="revenue-panel"><div className="panel-title"><div><p>DOANH THU 7 NGÀY</p><h2>54,1 triệu ₫</h2></div><div className="chart-legend"><span><i className="laundry"/>Laundry</span><span><i className="cafe"/>Café</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenue}><defs><linearGradient id="laundryFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f5b46" stopOpacity={.3}/><stop offset="100%" stopColor="#0f5b46" stopOpacity={0}/></linearGradient><linearGradient id="cafeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e3aa2e" stopOpacity={.25}/><stop offset="100%" stopColor="#e3aa2e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcded9"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={(value)=>`${value}tr`}/><Tooltip formatter={(value)=>`${value} triệu ₫`}/><Area type="monotone" dataKey="laundry" stroke="#0f5b46" strokeWidth={3} fill="url(#laundryFill)"/><Area type="monotone" dataKey="cafe" stroke="#e3aa2e" strokeWidth={3} fill="url(#cafeFill)"/></AreaChart></ResponsiveContainer></div></article>
    <article className="mix-panel"><div className="panel-title"><div><p>CƠ CẤU DOANH THU</p><h2>Hôm nay</h2></div></div><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={mix} dataKey="value" innerRadius={70} outerRadius={95} startAngle={90} endAngle={-270} paddingAngle={3}>{mix.map((entry)=><Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div><strong>74%</strong><span>Laundry</span></div></div><div className="mix-details"><p><span><i className="laundry"/>Laundry</span><strong>6.230.000₫</strong></p><p><span><i className="cafe"/>Café</span><strong>2.190.000₫</strong></p></div></article>
  </section>
  <section className="efficiency-grid">{[
    [WashingMachine,"74%","Công suất máy","Tốt hơn 6% so với T4"],
    [Clock3,"2h 14m","Xử lý trung bình","Mục tiêu dưới 2h 30m"],
    [ArrowUpRight,"112K","Giá trị đơn TB","Tăng 8.000₫ / đơn"],
    [Repeat2,"61%","Khách quay lại","412 khách trong 30 ngày"],
  ].map(([Icon,value,label,note])=><article key={String(label)}><span><Icon/></span><div><strong>{value}</strong><p>{label}</p><small>{note}</small></div></article>)}</section>
  <section className="owner-bottom"><article className="hourly-panel"><div className="panel-title"><div><p>NHỊP VẬN HÀNH HÔM NAY</p><h2>Đơn theo khung giờ</h2></div></div><div className="hour-bars">{[["07h",12],["09h",28],["11h",22],["13h",36],["15h",30],["17h",48],["19h",34],["21h",14]].map(([hour,value])=><div key={hour}><span style={{height:`${Number(value)*2}px`}}/><b>{hour}</b></div>)}</div></article><article className="attention-panel"><div className="panel-title"><div><p>CẦN CHÚ Ý</p><h2>5 việc đang chờ</h2></div></div>{[[AlertTriangle,"2 đơn sắp trễ","Còn dưới 30 phút"],[WashingMachine,"Máy W-04 bảo trì","Đã dừng 42 phút"],[Users,"3 phản hồi mới","Điểm trung bình 4,7"],[Coffee,"Tồn kho sữa tươi thấp","Còn đủ khoảng 18 ly"]].map(([Icon,title,note])=><div key={String(title)}><span><Icon/></span><div><strong>{title}</strong><small>{note}</small></div><button>→</button></div>)}</article></section>
  </OpsShell>}
