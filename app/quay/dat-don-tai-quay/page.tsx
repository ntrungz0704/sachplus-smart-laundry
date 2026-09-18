'use client';

import React, { useState, useEffect } from 'react';
import { createLaundryOrder, getServiceCatalog, formatVnd, type ServiceItem } from '@/lib/sachplus-data';
import { toast } from 'sonner';
import { QrCode, Printer, RotateCcw, CheckCircle, Ticket, Store, Shirt, Zap, Bed, Briefcase } from 'lucide-react';

const serviceIcons: Record<string, React.FC<any>> = {
  'Giặt & sấy': Zap,
  'Giặt hấp': Shirt,
  'Chăn ga': Bed,
  'Giày & túi': Briefcase,
};

export default function WalkInPosPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [weight, setWeight] = useState<number | ''>(3);
  const [note, setNote] = useState('');

  const [successData, setSuccessData] = useState<{
    orderId: string;
    orderCode: string;
    totalPrice: number;
    voucherCode: string;
  } | null>(null);

  useEffect(() => {
    const catalog = getServiceCatalog().filter(s => s.status !== "archived");
    setServices(catalog);
    if (catalog.length > 0) {
      setSelectedServiceId(catalog[0].id);
    }
  }, []);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const parsedWeight = Number(weight) || 1;
  const estimatedPrice = selectedService
    ? selectedService.unit.includes('kg')
      ? selectedService.price + Math.max(0, parsedWeight - 3) * 15000
      : selectedService.price * Math.max(1, Math.round(parsedWeight))
    : 69000;

  const generateOrderCode = () => {
    return Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    if (!weight || Number(weight) <= 0) {
      toast.error('Vui lòng nhập số lượng / khối lượng hợp lệ');
      return;
    }

    const orderCode = generateOrderCode();
    
    const newOrder = createLaundryOrder({
      service: selectedService.name,
      customerName: isWalkIn ? 'Khách vãng lai' : (phone ? `Khách ${phone.slice(-4)}` : 'Khách tại quầy'),
      customerPhone: phone || '0901234567',
      total: estimatedPrice,
      weight: `${weight} ${selectedService.unit}`,
      journey: 'Gửi tại quầy → Nhận tại quầy',
      status: 'Đã nhận tại tiệm',
    });

    setSuccessData({
      orderId: newOrder.id,
      orderCode,
      totalPrice: estimatedPrice,
      voucherCode: `CAFE10-${orderCode}`,
    });

    toast.success('Đã tạo đơn hàng thành công tại quầy!');
  };

  const resetForm = () => {
    setSuccessData(null);
    setPhone('');
    setIsWalkIn(false);
    setWeight('');
    setNote('');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 text-[#0F172A] font-sans">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#E2E8F0]">
        <div className="p-3 bg-[#E0F2FE] rounded-md text-[#0284C7]">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0284C7]">Tiếp Nhận Đồ Tại Quầy</h1>
          <p className="text-sm text-stone-500">Tạo đơn trực tiếp cho khách mang đồ đến cửa hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="bg-white p-6 rounded-md border border-[#E2E8F0] shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Số điện thoại khách hàng</label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWalkIn}
                    onChange={(e) => {
                      setIsWalkIn(e.target.checked);
                      if (e.target.checked) setPhone('');
                    }}
                    className="cursor-pointer accent-[#0284C7]"
                  />
                  <span>Khách vãng lai</span>
                </label>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isWalkIn}
                placeholder={isWalkIn ? 'Không yêu cầu' : 'Nhập SĐT...'}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent disabled:bg-stone-100 disabled:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Chọn dịch vụ</label>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => {
                  const Icon = serviceIcons[service.name] || Zap;
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`cursor-pointer p-4 rounded-md border text-left transition-colors flex items-start gap-3 ${
                        isSelected 
                          ? 'border-[#0284C7] bg-[#E0F2FE]' 
                          : 'border-[#E2E8F0] hover:border-[#0284C7]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-[#0284C7]' : 'text-stone-400'}`} />
                      <div>
                        <div className={`font-medium ${isSelected ? 'text-[#0284C7]' : ''}`}>{service.name}</div>
                        <div className="text-xs text-stone-500">{formatVnd(service.price)} / {service.unit}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0.0"
                  required
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tạm tính</label>
                <div className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md font-bold text-[#0284C7] flex items-center h-[42px]">
                  {formatVnd(estimatedPrice)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ghi chú thêm</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Vết bẩn khó giặt, yêu cầu nước xả..."
                rows={3}
                className="w-full px-4 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!!successData}
              className="cursor-pointer w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tạo Đơn Hàng
            </button>
          </form>
        </div>

        {/* Right Column: Result / Success State */}
        <div>
          {successData ? (
            <div className="bg-white p-8 rounded-md border border-[#0284C7] shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E0F2FE] text-[#0284C7] rounded-full mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Tạo Đơn Thành Công</h2>
              <p className="text-stone-500 mb-6">Đơn hàng đã được lưu vào hệ thống</p>

              <div className="bg-[#F8FAFC] p-6 rounded-md border border-[#E2E8F0] mb-6 inline-block w-full max-w-sm">
                <div className="text-sm text-stone-500 uppercase tracking-wide mb-1">Mã Đơn Hàng</div>
                <div className="text-4xl font-black text-[#0284C7] tracking-wider mb-6">
                  #SP-{successData.orderCode}
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-md flex flex-col items-center justify-center">
                    <QrCode className="w-24 h-24 text-[#0F172A] mb-2" />
                    <span className="text-xs text-stone-400">Quét để xem chi tiết</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-[#E2E8F0]">
                  <span className="text-stone-600">Tổng thanh toán:</span>
                  <span className="font-bold text-lg">{formatVnd(successData.totalPrice)}</span>
                </div>
              </div>

              {/* Voucher */}
              <div className="bg-[#0284C7]/10 border border-[#0284C7]/30 rounded-md p-4 mb-8 flex items-center gap-4 text-left">
                <div className="bg-[#0284C7] p-2 rounded-md text-white">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-[#0284C7]">Giảm 10% Café Lầu 1</div>
                  <div className="text-sm opacity-80">Mã: {successData.voucherCode}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Đang in phiếu tiếp nhận...');
                    window.print();
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 border border-[#0284C7] text-[#0284C7] hover:bg-[#E0F2FE] font-medium rounded-md transition-colors"
                >
                  <Printer className="w-5 h-5" />
                  In phiếu biên nhận
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="cursor-pointer flex items-center justify-center gap-2 py-3 px-4 bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium rounded-md transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Tạo đơn mới
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-[#F8FAFC] border border-[#E2E8F0] border-dashed rounded-md flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Store className="w-10 h-10 text-stone-300" />
              </div>
              <h3 className="text-lg font-medium text-stone-600 mb-2">Chưa có đơn hàng</h3>
              <p className="text-stone-400 text-sm max-w-xs">
                Điền thông tin ở biểu mẫu bên trái để tạo đơn hàng mới cho khách vãng lai.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
