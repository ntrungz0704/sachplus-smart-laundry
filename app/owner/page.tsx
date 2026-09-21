"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowUpRight, Clock3, Coffee, Download, PackageCheck, Repeat2, Shirt, Sparkles, TrendingUp, Users, WashingMachine } from "lucide-react";
import { toast } from "sonner";
import { OpsShell } from "@/components/sachplus/ops-shell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatVnd, getLaundryOrders, getMachines, type LaundryOrder } from "@/lib/sachplus-data";

export default function OwnerPage() {
  const [period, setPeriod] = useState("week");
  const [orders, setOrders] = useState<LaundryOrder[]>([]);

  useEffect(() => {
    const load = () => setOrders(getLaundryOrders());
    load();
    window.addEventListener("sachplus:order-created", load);
    window.addEventListener("sachplus:order-updated", load);
    return () => {
      window.removeEventListener("sachplus:order-created", load);
      window.removeEventListener("sachplus:order-updated", load);
    };
  }, []);

  // KPI tính toán từ dữ liệu thật
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Hoàn tất").length;
  const pendingOrders = orders.filter((o) => o.status !== "Hoàn tất" && o.status !== "Đã đặt").length;
  const machines = getMachines();
  const runningMachines = machines.filter((m) => m.state === "running").length;

  // Biểu đồ doanh thu — tổng hợp theo ngày từ đơn thật
  const revenueData = useMemo(() => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const map: Record<string, number> = {};
    days.forEach((d) => (map[d] = 0));
    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      const dayName = days[date.getDay()];
      map[dayName] = (map[dayName] || 0) + o.total / 1000;
    });
    return days.slice(1).concat(days[0]).map((day) => ({ day, revenue: Math.round(map[day] * 10) / 10 }));
  }, [orders]);

  // Tỷ lệ dịch vụ
  const mixData = useMemo(() => {
    const cafe = orders.filter((o) => o.cafeItems && o.cafeItems.length > 0).length;
    const laundry = totalOrders - cafe;
    if (totalOrders === 0) return [
      { name: "Chưa có đơn hàng", value: 100, color: "#94A3B8" },
    ];
    return [
      { name: "Laundry (Giặt sấy, hấp, chăn ga)", value: Math.round((laundry / totalOrders) * 100), color: "#0284C7" },
      { name: "Sạch+ Café & Đồ uống", value: Math.round((cafe / totalOrders) * 100), color: "#10B981" },
    ];
  }, [orders, totalOrders]);

  const handleExport = () => {
    toast.success("Đang xuất tệp Excel báo cáo doanh thu & công suất máy (SạchPlus-SGPARK-2026.xlsx)...");
  };

  return (
    <OpsShell role="owner">
      {/* Topbar */}
      <header className="ops-topbar owner-topbar">
        <div>
          <p>Cập nhật số liệu realtime · {new Date().toLocaleDateString("vi-VN")}</p>
          <h1>Báo Cáo Hoạt Động & Doanh Thu</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="bg-stone-200">
              <TabsTrigger value="today">Hôm nay</TabsTrigger>
              <TabsTrigger value="week">7 ngày qua</TabsTrigger>
              <TabsTrigger value="month">Tháng {new Date().getMonth() + 1}</TabsTrigger>
            </TabsList>
          </Tabs>
          <button type="button" className="export-button" onClick={handleExport}>
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </header>

      {/* 4 Thẻ KPI vận hành */}
      <section className="owner-kpis">
        {[
          { value: formatVnd(totalRevenue), label: "Tổng doanh thu", change: `${totalOrders} đơn hàng`, Icon: TrendingUp, tone: "positive" },
          { value: `${totalOrders} đơn`, label: "Tổng đơn tiếp nhận", change: `${pendingOrders} đang xử lý`, Icon: Shirt, tone: "positive" },
          { value: `${completedOrders} đơn`, label: "Đã hoàn thành QC", change: totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}% năng suất` : "Chưa có đơn", Icon: PackageCheck, tone: "neutral" },
          { value: `${runningMachines}/${machines.length}`, label: "Máy đang chạy", change: `${machines.length - runningMachines} máy trống`, Icon: WashingMachine, tone: "neutral" },
        ].map(({ value, label, change, Icon, tone }) => (
          <article key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} className="text-stone-400" />
            </div>
            <strong className={tone === "warning" ? "text-[#0284C7]" : ""}>{value}</strong>
            <small className={tone === "positive" ? "text-[#0284C7]" : tone === "warning" ? "text-[#0284C7]" : ""}>
              {change}
            </small>
          </article>
        ))}
      </section>

      {/* Biểu đồ doanh thu */}
      <section className="owner-charts">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="kicker">DOANH THU THEO NGÀY</p>
              <h2 className="text-xl font-bold tracking-tight">Xu hướng doanh thu 7 ngày qua</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="K" />
              <Tooltip
                formatter={(val: any) => [`${Number(val || 0).toFixed(1)}K`, "Doanh thu"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0284C7" fill="url(#gRevenue)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut tỷ lệ */}
        <div>
          <p className="kicker">TỶ LỆ DOANH THU</p>
          <h2 className="text-xl font-bold tracking-tight">Cơ cấu dịch vụ</h2>
          <div className="donut-wrap">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={mixData} dataKey="value" innerRadius={55} outerRadius={78} stroke="none" paddingAngle={3}>
                  {mixData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div>
              {mixData.map((entry) => (
                <p key={entry.name}>
                  <i style={{ background: entry.color }} /> {entry.name}: <b>{entry.value}%</b>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Công suất máy */}
      <section className="p-6">
        <p className="kicker">TRẠNG THÁI MÁY MÓC</p>
        <h2 className="text-xl font-bold tracking-tight mb-4">Công suất máy giặt & sấy</h2>
        <div className="efficiency-grid">
          {machines.map((m) => (
            <div key={m.id} className="machine-card">
              <div className="flex justify-between items-center">
                <strong>{m.id}</strong>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    m.state === "running"
                      ? "bg-[#E0F2FE] text-[#0284C7]"
                      : m.state === "error"
                      ? "bg-red-50 text-[#DC2626]"
                      : m.state === "waiting"
                      ? "bg-[#F0F9FF] text-[#0369A1]"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <small className="text-stone-500">{m.type}</small>
              <p className="text-xs text-stone-400 mt-1">{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Danh sách đơn gần đây */}
      <section className="p-6 pt-0">
        <p className="kicker">ĐƠN HÀNG GẦN ĐÂY</p>
        <h2 className="text-xl font-bold tracking-tight mb-4">Đơn hàng mới nhất</h2>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Shirt size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">Chưa có đơn hàng nào trong hệ thống</p>
            <p className="text-sm mt-1">Đơn hàng từ khách sẽ hiển thị tại đây khi có người đặt dịch vụ.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#0284C7]">{o.id}</span>
                  <span className="text-sm text-stone-600">{o.service}</span>
                  {o.customerName && <span className="text-xs text-stone-400">· {o.customerName}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status === "Hoàn tất" ? "bg-[#E0F2FE] text-[#0284C7]" : "bg-[#F0F9FF] text-[#0369A1]"}`}>
                    {o.status}
                  </span>
                  <strong className="text-sm text-[#0369A1]">{formatVnd(o.total)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </OpsShell>
  );
}
