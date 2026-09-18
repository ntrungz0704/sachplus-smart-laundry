'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/sachplus/site-header';
import { SiteFooter } from '@/components/sachplus/site-footer';
import { Button } from '@/components/ui/button';
import { WashingMachine, Package, Receipt, Wind, Coffee, Wifi, Sofa, Tag } from 'lucide-react';

export default function MoHinh2TangPage() {
  const floor1 = [
    { title: 'Máy giặt tự động', desc: 'Hệ thống máy sấy, máy giặt công nghiệp hiện đại.', icon: WashingMachine },
    { title: 'Kệ vật tư tiện ích', desc: 'Cung cấp các sản phẩm chăm sóc vải chuyên dụng.', icon: Package },
    { title: 'Quầy tiếp nhận', desc: 'Khu vực nhận đồ và tư vấn dịch vụ chuyên nghiệp.', icon: Receipt },
    { title: 'Kho sấy chuyên dụng', desc: 'Đảm bảo quần áo luôn khô ráo trong mọi thời tiết.', icon: Wind },
  ];

  const floor2 = [
    { title: 'Menu 20+ món', desc: 'Đa dạng các loại cà phê, trà và đồ uống đá xay.', icon: Coffee },
    { title: 'Wi-Fi tốc độ cao', desc: 'Kết nối ổn định phục vụ làm việc và học tập.', icon: Wifi },
    { title: 'Không gian thư giãn', desc: 'Thiết kế hiện đại, yên tĩnh và thoải mái.', icon: Sofa },
    { title: 'Ưu đãi combo', desc: 'Giảm giá đặc biệt khi kết hợp giặt ủi và café.', icon: Tag },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[#0284C7] mb-4">Mô Hình 2 Tầng Độc Đáo</h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Trải nghiệm mô hình kết hợp giặt ủi và không gian cà phê làm việc đầu tiên tại khu vực, 
              mang lại tiện ích kép cho khách hàng bận rộn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Tầng Trệt */}
            <div className="bg-white rounded-md border border-[#E2E8F0] p-8 shadow-sm">
              <div className="inline-block bg-[#E0F2FE] text-[#0284C7] px-4 py-1 rounded-full text-sm font-bold mb-6">
                Tầng Trệt
              </div>
              <h2 className="text-3xl font-bold mb-8 text-[#0F172A]">Smart Laundry Zone</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {floor1.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 text-[#0284C7]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-stone-600">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <Button asChild className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md cursor-pointer w-full sm:w-auto">
                  <Link href="/dat-lich">Khám phá dịch vụ giặt</Link>
                </Button>
              </div>
            </div>

            {/* Lầu 1 */}
            <div className="bg-white rounded-md border border-[#E2E8F0] p-8 shadow-sm">
              <div className="inline-block bg-[#F0F9FF] text-[#0284C7] px-4 py-1 rounded-full text-sm font-bold mb-6">
                Lầu 1
              </div>
              <h2 className="text-3xl font-bold mb-8 text-[#0F172A]">Sạch+ Café & Co-working</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {floor2.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 text-[#0284C7]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">{item.title}</h3>
                        <p className="text-sm text-stone-600">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-[#E2E8F0]">
                <Button asChild className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md cursor-pointer w-full sm:w-auto">
                  <Link href="/cafe">Xem Menu Café</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
