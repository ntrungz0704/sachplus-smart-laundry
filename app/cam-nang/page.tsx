'use client';

import Link from 'next/link';
import { SiteHeader } from '@/components/sachplus/site-header';
import { SiteFooter } from '@/components/sachplus/site-footer';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function CamNangPage() {
  const articles = [
    {
      slug: 'cham-soc-vai',
      title: 'Hướng dẫn giặt đồ theo chất liệu vải',
      desc: 'Mỗi loại vải cần một cách chăm sóc khác nhau. Tìm hiểu cách phân loại và giặt đồ để giữ quần áo luôn như mới.',
      date: '10/10/2023'
    },
    {
      slug: 'tay-vet-ban',
      title: 'Cách tẩy vết bẩn cứng đầu',
      desc: 'Cà phê, mực, dầu mỡ... những vết bẩn khó ưa sẽ biến mất hoàn toàn với những mẹo đơn giản sau đây.',
      date: '05/10/2023'
    },
    {
      slug: 'bao-quan-giay',
      title: 'Bảo quản giày dép đúng cách',
      desc: 'Bí quyết giúp những đôi giày yêu quý của bạn luôn bền đẹp, không bị form hay mốc trong thời tiết ẩm ướt.',
      date: '01/10/2023'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-10">
            <BookOpen className="w-8 h-8 text-[#0284C7]" />
            <h1 className="text-3xl font-bold text-[#0284C7]">Cẩm Nang Chăm Sóc Đồ</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div key={article.slug} className="bg-white rounded-md border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="text-sm text-stone-500 mb-3">{article.date}</div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-[#0284C7] transition-colors">
                  <Link href={`/cam-nang/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="text-stone-600 mb-6 flex-1 line-clamp-3">
                  {article.desc}
                </p>
                <Link 
                  href={`/cam-nang/${article.slug}`}
                  className="inline-flex items-center gap-2 text-[#0284C7] font-semibold hover:underline mt-auto cursor-pointer"
                >
                  Đọc thêm <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
