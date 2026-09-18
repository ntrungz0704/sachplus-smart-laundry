'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SiteHeader } from '@/components/sachplus/site-header';
import { SiteFooter } from '@/components/sachplus/site-footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar } from 'lucide-react';

const articlesMap: Record<string, { title: string; date: string; content: string[] }> = {
  'cham-soc-vai': {
    title: 'Hướng dẫn giặt đồ theo chất liệu vải',
    date: '10/10/2023',
    content: [
      'Cotton (Sợi bông): Là loại vải phổ biến nhất, cotton dễ thấm hút nhưng lại dễ nhăn. Nên giặt bằng nước lạnh hoặc ấm nhẹ để tránh co rút. Phơi nơi thoáng mát, tránh nắng gắt trực tiếp làm phai màu.',
      'Len (Wool): Vải len rất nhạy cảm với nhiệt độ và lực tác động. Chỉ nên giặt tay hoặc dùng chế độ giặt len chuyên dụng của máy giặt với nước lạnh. Không vắt mạnh, phơi ngang trên mặt phẳng.',
      'Lụa (Silk): Cực kỳ mỏng manh và dễ xước. Tốt nhất là giặt khô hoặc giặt tay nhẹ nhàng với dầu gội đầu. Tránh dùng bột giặt có tính tẩy mạnh.',
      'Nếu bạn không có thời gian hoặc không chắc chắn về cách chăm sóc những món đồ đắt tiền, hãy mang đến Sạch+. Chúng tôi có quy trình phân loại và giặt ủi chuyên nghiệp cho từng loại chất liệu.'
    ]
  },
  'tay-vet-ban': {
    title: 'Cách tẩy vết bẩn cứng đầu',
    date: '05/10/2023',
    content: [
      'Vết cà phê: Dùng hỗn hợp giấm trắng và nước lạnh xoa nhẹ lên vết bẩn, sau đó giặt lại bằng xà phòng.',
      'Vết dầu mỡ: Rắc phấn rôm hoặc bột bắp lên vết bẩn để hút dầu, để khoảng 15 phút rồi phủi sạch. Sau đó giặt với nước rửa chén.',
      'Vết mực: Dùng cồn y tế chấm lên vết mực (nhớ đặt một miếng khăn giấy lót bên dưới để hút mực chảy ra). Không vò xát mạnh.',
      'Tuy nhiên, với những vết bẩn đã để lâu hoặc trên các chất liệu nhạy cảm, việc tự xử lý có thể làm hỏng vải. Dịch vụ giặt hấp của Sạch+ với dung môi chuyên dụng sẽ giúp loại bỏ vết bẩn an toàn và hiệu quả.'
    ]
  },
  'bao-quan-giay': {
    title: 'Bảo quản giày dép đúng cách',
    date: '01/10/2023',
    content: [
      'Làm sạch định kỳ: Không nên đợi giày quá bẩn mới giặt. Dùng bàn chải mềm để loại bỏ bụi bẩn sau mỗi lần sử dụng.',
      'Bảo vệ form giày: Sử dụng cây giữ form (shoe tree) hoặc nhét giấy báo vo tròn vào bên trong giày khi không sử dụng để hút ẩm và giữ dáng giày.',
      'Tránh nhiệt độ cao: Tuyệt đối không phơi giày trực tiếp dưới ánh nắng mặt trời gắt hoặc dùng máy sấy nhiệt độ cao, sẽ làm chảy keo và bong tróc da.',
      'Sạch+ cung cấp dịch vụ vệ sinh giày chuyên sâu (Deep Clean) sử dụng các loại dung dịch chăm sóc giày cao cấp từ Mỹ, giúp đôi giày của bạn sạch sẽ từ trong ra ngoài và bền đẹp lâu dài.'
    ]
  }
};

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articlesMap[slug] || articlesMap['cham-soc-vai'];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-8 pb-4 border-b border-[#E2E8F0]">
            <Link href="/" className="hover:text-[#0284C7]">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cam-nang" className="hover:text-[#0284C7]">Cẩm nang</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0F172A] font-medium truncate">{article.title}</span>
          </div>

          <article className="bg-white rounded-md border border-[#E2E8F0] p-8 shadow-sm mb-8">
            <h1 className="text-3xl font-bold text-[#0284C7] mb-4">{article.title}</h1>
            <div className="flex items-center gap-2 text-stone-500 text-sm mb-8">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            
            <div className="space-y-6 text-stone-700 leading-relaxed text-lg">
              {article.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </article>

          <div className="bg-[#E0F2FE] rounded-md border border-[#E2E8F0] p-8 text-center">
            <h3 className="text-xl font-bold text-[#0284C7] mb-2">Bạn cần chuyên gia hỗ trợ?</h3>
            <p className="text-stone-600 mb-6">Hãy để Sạch+ chăm sóc những món đồ yêu quý của bạn một cách tốt nhất.</p>
            <Button asChild className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-md cursor-pointer px-8">
              <Link href="/dat-lich">Đặt lịch dịch vụ</Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
