'use client';

import React, { useEffect, useState } from 'react';
import { getLaundryOrders, getMachines, formatVnd, type LaundryOrder, type MachineItem } from '@/lib/sachplus-data';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LayoutDashboard, ShoppingBag, Loader2, CheckCircle2, DollarSign, Activity, AlertCircle, PlayCircle, StopCircle } from 'lucide-react';

const COLORS = ['#0284C7', '#0369A1', '#E0F2FE', '#2563EB', '#E2E8F0'];

export default function DashboardPage() {
  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadData = () => {
    setOrders(getLaundryOrders());
    setMachines(getMachines());
  };

  useEffect(() => {
    setIsMounted(true);
    loadData();

    const handleDataUpdate = () => loadData();
    
    window.addEventListener('sachplus:order-created', handleDataUpdate);
    window.addEventListener('sachplus:order-updated', handleDataUpdate);
    window.addEventListener('sachplus:machines-updated', handleDataUpdate);

    return () => {
      window.removeEventListener('sachplus:order-created', handleDataUpdate);
      window.removeEventListener('sachplus:order-updated', handleDataUpdate);
      window.removeEventListener('sachplus:machines-updated', handleDataUpdate);
    };
  }, []);

  if (!isMounted) return null;

  // Calculate KPIs
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  
  const processingOrders = orders.filter(o => !['Hoàn tất', 'Đã đặt'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Hoàn tất');
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || (o as any).totalPrice || 0), 0);

  // Prepare Chart Data
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));

  const getMachineStatusIcon = (status: string) => {
    switch (status) {
      case 'Đang chạy': return <PlayCircle className="w-5 h-5 text-yellow-500" />;
      case 'Bảo trì': return <AlertCircle className="w-5 h-5 text-[#DC2626]" />;
      default: return <StopCircle className="w-5 h-5 text-[#16A34A]" />; // Trống
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 text-[#0F172A] font-sans space-y-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#E0F2FE] rounded-md text-[#0284C7]">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0284C7]">Tổng Quan Hoạt Động</h1>
          <p className="text-sm text-stone-500">Giám sát tình trạng máy móc và đơn hàng</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#E0F2FE] rounded-full text-[#0284C7]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Đơn Hôm Nay</p>
            <p className="text-2xl font-bold">{todayOrders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#0284C7]/10 rounded-full text-[#0284C7]">
            <Loader2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Đang Xử Lý</p>
            <p className="text-2xl font-bold">{processingOrders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-[#E0F2FE] rounded-full text-[#0284C7]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Hoàn Tất</p>
            <p className="text-2xl font-bold">{completedOrders.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-md border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">Tổng Doanh Thu</p>
            <p className="text-xl font-bold">{formatVnd(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm lg:col-span-1">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0284C7]" />
            Trạng Thái Đơn
          </h2>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-stone-400">
                Chưa có dữ liệu đơn hàng
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {chartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Status Section */}
        <div className="bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold mb-4">Tình Trạng Máy Móc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {machines.map((machine) => {
              const runningMachinesCount = machines.filter(m => m.state === 'running').length;
              const utilPercent = machines.length > 0 ? Math.round((runningMachinesCount / machines.length) * 100) : 0;
              return (
                <div key={machine.id} className="border border-[#E2E8F0] rounded-md p-4 hover:border-[#0284C7] transition-colors bg-[#F8FAFC]/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-[#0284C7]">{machine.id}</h3>
                      <p className="text-xs text-stone-500 uppercase tracking-wide">{machine.type}</p>
                    </div>
                    {getMachineStatusIcon(machine.status)}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="text-sm">
                      <span className={`font-medium ${
                        machine.status === 'Trống' ? 'text-[#16A34A]' :
                        machine.status === 'Đang chạy' || machine.status.includes('Đang') ? 'text-yellow-600' : 'text-[#DC2626]'
                      }`}>
                        {machine.status}
                      </span>
                      {machine.note && <div className="text-[11px] text-stone-400 mt-0.5">{machine.note}</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-stone-500 mb-1">Hiệu suất</div>
                      <div className="font-bold text-lg">{utilPercent}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {machines.length === 0 && (
            <div className="text-center py-8 text-stone-400 border border-dashed border-[#E2E8F0] rounded-md">
              Không tìm thấy dữ liệu máy móc.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
