import { NextRequest, NextResponse } from "next/server";

/**
 * SePay Webhook Receiver
 * SePay sẽ POST tới URL này khi có giao dịch tiền vào
 * Cấu hình webhook URL tại: my.sepay.vn → Tích hợp WebHooks
 * 
 * Payload mẫu:
 * {
 *   "id": 92704,
 *   "gateway": "VietinBank",
 *   "transactionDate": "2026-09-21 21:15:30",
 *   "accountNumber": "108875292318",
 *   "code": "SP12345678",
 *   "content": "SEVQR NAP SP12345678",
 *   "transferType": "in",
 *   "transferAmount": 100000,
 *   "referenceCode": "FT260921000123"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate: chỉ xử lý tiền vào tài khoản đúng
    if (body.transferType !== "in" || body.accountNumber !== "108875292318") {
      return NextResponse.json({ success: true, skipped: true });
    }

    const { code, transferAmount, transactionDate, referenceCode, content } = body;

    // Log giao dịch (trong production sẽ ghi vào database)
    console.log(`[SePay Webhook] ✅ Nhận ${transferAmount.toLocaleString("vi-VN")}₫ | Mã: ${code} | Ref: ${referenceCode} | Content: ${content} | Time: ${transactionDate}`);

    // TODO: Khi có database thực, cập nhật trạng thái đơn hàng / ví cư dân tại đây
    // Ví dụ: await db.walletTopup.create({ code, amount: transferAmount, paidAt: transactionDate })

    // Trả về HTTP 200 + success: true (bắt buộc trong vòng 30 giây)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SePay Webhook] Error:", err);
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
