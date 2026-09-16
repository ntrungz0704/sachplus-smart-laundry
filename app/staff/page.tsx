"use client";

import { useState } from "react";
import { Camera, Check, ChevronRight, CircleAlert, Clock3, PackageCheck, Play, Plus, QrCode, Scale, ScanLine, Shirt, Truck, WashingMachine } from "lucide-react";
import { toast } from "sonner";
import { OpsShell } from "@/components/sachplus/ops-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Job = { id: string; service: string; weight: string; due: string; priority?: boolean; column: string };
const columns = ["Đơn mới", "Phân loại", "Đang giặt", "Đang sấy", "QC & đóng gói"];
const initialJobs: Job[] = [
  {id:"SP-250917",service:"Giặt & sấy",weight:"4,3 kg",due:"10:30",priority:true,column:"Đơn mới"},
  {id:"SP-250918",service:"Chăn ga",weight:"1 bộ",due:"11:00",column:"Đơn mới"},
  {id:"SP-250914",service:"Giặt hấp",weight:"3 món",due:"10:15",column:"Phân loại"},
  {id:"SP-240916",service:"Giặt & sấy",weight:"6,2 kg",due:"17:30",column:"Đang giặt"},
  {id:"SP-240915",service:"Giày & túi",weight:"2 đôi",due:"16:45",column:"Đang giặt"},
  {id:"SP-240912",service:"Giặt & sấy",weight:"3,8 kg",due:"09:50",column:"Đang sấy"},
  {id:"SP-240910",service:"Chăn ga",weight:"2 bộ",due:"09:30",priority:true,column:"QC & đóng gói"},
];
const machines = [
  ["W-01","Máy giặt 18kg","Trống","Sẵn sàng nhận đơn","idle"],
  ["W-02","Máy giặt 18kg","Đang giặt","SP-240916 · còn 24 phút","running"],
  ["W-03","Máy giặt 12kg","Chờ lấy đồ","SP-240915 · quá 4 phút","waiting"],
  ["W-04","Máy giặt 12kg","Bảo trì","Kiểm tra bơm xả","error"],
  ["D-01","Máy sấy 18kg","Đang sấy","SP-240912 · còn 18 phút","running"],
  ["D-02","Máy sấy 18kg","Trống","Sẵn sàng nhận đơn","idle"],
];

export default function StaffPage() {
  const [jobs,setJobs]=useState(initialJobs);
  const advance=(job:Job)=>{const index=columns.indexOf(job.column); if(index===columns.length-1){toast.success(`${job.id} đã sẵn sàng giao`);setJobs((all)=>all.filter((item)=>item.id!==job.id));return;} const next=columns[index+1];setJobs((all)=>all.map((item)=>item.id===job.id?{...item,column:next}:item));toast.success(`Đã chuyển ${job.id} sang ${next}`);};
  const scan=()=>toast.success("Đã nhận diện túi đồ SP-250919 · Giặt & sấy");
  return <OpsShell role="staff"><header className="ops-topbar"><div><p>Thứ Năm, 17 tháng 9</p><h1>Vận hành ca sáng</h1></div><div className="shift-status"><i/> Đang trong ca · còn 2h 14m</div></header><section className="ops-kpis">{[["8","Đơn mới",Plus],["17","Đang xử lý",WashingMachine],["5","Sắp đến hạn",Clock3],["3","Chờ giao",Truck]].map(([value,label,Icon])=><article key={String(label)}><span><Icon/></span><div><strong>{value}</strong><p>{label}</p></div></article>)}</section>
    <Tabs defaultValue="kanban" className="ops-tabs"><TabsList><TabsTrigger value="kanban">Bảng công việc</TabsTrigger><TabsTrigger value="receive">Nhận đồ & QR</TabsTrigger><TabsTrigger value="machines">Máy giặt / sấy</TabsTrigger></TabsList>
      <TabsContent value="kanban"><div className="kanban-board">{columns.map((column,index)=><section key={column} className="kanban-column"><div className="column-head"><div><span>{String(index+1).padStart(2,"0")}</span><h2>{column}</h2></div><b>{jobs.filter((job)=>job.column===column).length}</b></div><div className="kanban-stack">{jobs.filter((job)=>job.column===column).map((job)=><article key={job.id} className={job.priority?"priority":""}><div className="job-head"><strong>{job.id}</strong>{job.priority&&<span>Hỏa tốc</span>}</div><h3>{job.service}</h3><p><Scale/>{job.weight}<span>•</span><Clock3/>{job.due}</p>{job.column==="Đang giặt"&&<div className="machine-tag"><WashingMachine/> W-02 · còn 24 phút</div>}<button onClick={()=>advance(job)}>{index===columns.length-1?"Hoàn tất QC":"Chuyển bước"}<ChevronRight/></button></article>)}{!jobs.some((job)=>job.column===column)&&<div className="empty-column"><Check/><span>Đã xử lý hết</span></div>}</div></section>)}</div></TabsContent>
      <TabsContent value="receive"><div className="receive-layout" id="scan"><section className="scanner-panel"><div className="scan-window"><ScanLine/><span>Đưa mã QR trên túi đồ vào khung</span></div><button onClick={scan}><QrCode/> Quét mã QR</button><p>Hoặc nhập mã đơn thủ công</p><div><input placeholder="SP-XXXXXX"/><button onClick={scan}>Tra cứu</button></div></section><section className="receive-checklist"><p className="kicker">CHECKLIST NHẬN ĐỒ</p><h2>Mỗi túi đồ, một hồ sơ rõ ràng.</h2>{[[Scale,"Cân & ghi khối lượng"],[Camera,"Chụp ảnh tình trạng lúc nhận"],[Shirt,"Phân loại vải và màu"],[CircleAlert,"Ghi nhận vết bẩn / đồ dễ phai"],[PackageCheck,"In tem QR và niêm phong túi"]].map(([Icon,label],index)=><div key={String(label)}><span><Icon/></span><strong>{index+1}. {label}</strong></div>)}</section></div></TabsContent>
      <TabsContent value="machines"><div className="machine-grid" id="machines">{machines.map(([id,type,status,note,state])=><article className={`machine-card ${state}`} key={id}><div className="machine-top"><span><WashingMachine/></span><div><strong>{id}</strong><small>{type}</small></div><i/></div><h3>{status}</h3><p>{note}</p><button disabled={state!=="idle"}><Play/> {state==="idle"?"Gán đơn vào máy":"Xem chi tiết"}</button></article>)}</div></TabsContent>
    </Tabs></OpsShell>;
}
