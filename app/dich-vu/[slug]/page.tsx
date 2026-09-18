'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/sachplus/site-header';
import { SiteFooter } from '@/components/sachplus/site-footer';
import { Button } from '@/components/ui/button';
import { getServiceCatalog, formatVnd } from '@/lib/sachplus-data';
import { Shirt, Sparkles, BedDouble, ShoppingBag, ChevronRight, CheckCircle2 } from 'lucide-react';

const serviceMapping: Record<string, { name: string; icon: any; catalogNames: string[] }> = {
  'giat-say': { name: 'Giặt & sấy', icon: Shirt, catalogNames: ['Giặt sấy lấy ngay', 'Giặt sấy thường'] },
  'giat-hap': { name: 'Giặt hấp', icon: Sparkles, catalogNames: ['Giặt hấp'] },
  'chan-ga': { name: 'Chăn ga', icon: BedDouble, catalogNames: ['Vệ sinh chăn ga'] },
  'giay-tui': { name: 'Giày & túi', icon: ShoppingBag, catalogNames: ['Vệ sinh giày & túi'] },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const serviceInfo = serviceMapping[slug] || serviceMapping['giat-say'];
  const Icon = serviceInfo.icon;
  
  const catalog = getServiceCatalog().filter(s => serviceInfo.catalogNames.includes(s.name));

  const steps = [
    { title: 'Tiếp nhận', desc: 'Kiểm tra tình trạng đồ' },
    { title: 'Phân loại', desc: 'Tách riêng theo chất liệu, màu sắc' },
    { title: 'Xử lý', desc: 'Giặt sấy chuyên nghiệp' },
    { title: 'Hoàn tất', desc: 'Kiểm tra chất lượng và đóng gói' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E2E8F0] py-3">
          <div className="container mx-auto px-4 max-w-6xl flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-[#0284C7]">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dich-vu" className="hover:text-[#0284C7]">Dịch vụ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0F172A] font-medium">{serviceInfo.name}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-[#0284C7] text-white py-16">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="inline-flex bg-white/20 p-4 rounded-md mb-6">
              <Icon className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{serviceInfo.name}</h1>
            <p className="text-[#E0F2FE] text-lg max-w-2xl mx-auto">
              Chăm sóc trang phục của bạn với quy trình chuyên nghiệp, máy móc hiện đại và dung dịch an toàn.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl py-12 space-y-12">
          {/* Quy trình */}
          <section>
            <h2 className="text-2xl font-bold text-[#0284C7] mb-8 text-center">Quy Trình Chăm Sóc</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-[2px] bg-[#E2E8F0] -z-10 mx-12"></div>
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-[#E0F2FE] text-[#0284C7] rounded-full flex items-center justify-center font-bold text-lg mb-4 border-4 border-white shadow-sm">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-stone-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bảng giá */}
          <section className="bg-white rounded-md border border-[#E2E8F0] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#E2E8F0] bg-stone-50">
              <h2 className="text-2xl font-bold text-[#0284C7]">Bảng Giá Dịch Vụ</h2>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {catalog.map((pkg, idx) => (
                <div key={idx} className="p-6 md:flex justify-between items-center gap-6">
                  <div className="flex-1 mb-4 md:mb-0">
                    <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-stone-600 mb-2">{pkg.detail}</p>
                    <div className="flex items-center gap-2 text-sm text-[#0284C7]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{pkg.highlight}</span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-2xl font-bold text-[#0284C7]">
                      {formatVnd(pkg.price)}
                    </div>
                    <div className="text-sm text-stone-500 mb-4">/ {pkg.unit} • {pkg.duration}</div>
                    <Button asChild className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md cursor-pointer w-full md:w-auto">
                      <Link href={`/dat-lich?service=${slug}`}>Đặt lịch ngay</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
