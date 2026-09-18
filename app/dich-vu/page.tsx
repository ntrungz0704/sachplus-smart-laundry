'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/sachplus/site-header';
import { SiteFooter } from '@/components/sachplus/site-footer';
import { Button } from '@/components/ui/button';
import { getServiceCatalog, formatVnd } from '@/lib/sachplus-data';
import { Shirt, Sparkles, BedDouble, ShoppingBag, ArrowRight } from 'lucide-react';

export default function DichVuPage() {
  const catalog = getServiceCatalog().filter((s) => s.status !== "archived");
  
  const iconMap: Record<string, any> = {
    'Giặt sấy lấy ngay': Shirt,
    'Giặt sấy thường': Shirt, // fallback
    'Giặt hấp': Sparkles,
    'Vệ sinh chăn ga': BedDouble,
    'Vệ sinh giày & túi': ShoppingBag,
  };

  const slugMap: Record<string, string> = {
    'Giặt sấy lấy ngay': 'giat-say',
    'Giặt sấy thường': 'giat-say',
    'Giặt hấp': 'giat-hap',
    'Vệ sinh chăn ga': 'chan-ga',
    'Vệ sinh giày & túi': 'giay-tui',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0284C7] mb-4">Dịch Vụ Giặt Ủi Chuyên Nghiệp</h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Phục vụ tận tâm, chất lượng vượt trội tại khu vực Vinhomes. 
              Mang lại sự tiện lợi tối đa cho cuộc sống của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {catalog.map((service, idx) => {
              const Icon = iconMap[service.name] || Shirt;
              const slug = slugMap[service.name] || 'giat-say';
              
              return (
                <div key={idx} className="bg-white rounded-md border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow spotlight-card group">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#E0F2FE] p-3 rounded-md text-[#0284C7]">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#0284C7] transition-colors">
                        <Link href={`/dich-vu/${slug}`} className="hover:underline">
                          {service.name}
                        </Link>
                      </h3>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-[#0284C7]">
                          {formatVnd(service.price)}
                        </span>
                        <span className="text-sm text-stone-500">/ {service.unit}</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">
                        <span className="font-semibold text-stone-800">Thời gian:</span> {service.duration}
                      </p>
                      <p className="text-sm text-stone-600 mb-4 h-10 line-clamp-2">
                        {service.detail}
                      </p>
                      <div className="mb-6">
                        <span className="inline-block bg-[#E0F2FE] text-[#0284C7] text-xs px-2 py-1 rounded-md font-medium">
                          {service.highlight}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button asChild className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md cursor-pointer flex-1">
                          <Link href={`/dat-lich?service=${slug}`}>Đặt lịch ngay</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-[#E2E8F0] text-[#0F172A] hover:bg-stone-50 rounded-md cursor-pointer">
                          <Link href={`/dich-vu/${slug}`}>
                            <span className="sr-only">Chi tiết</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
