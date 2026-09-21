import { NextRequest, NextResponse } from "next/server";

/**
 * SePay Transaction Check Proxy
 * Frontend gọi: GET /api/sepay/check?code=SP12345678&amount=50000
 * Server gọi SePay API v2 với token bảo mật → trả kết quả isPaid
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const amount = Number(searchParams.get("amount") || "0");

  if (!code) {
    return NextResponse.json({ isPaid: false, error: "Missing code" }, { status: 400 });
  }

  const token = process.env.SEPAY_API_TOKEN;
  if (!token) {
    // Nếu chưa cấu hình token, trả về chưa thanh toán (demo mode)
    return NextResponse.json({ isPaid: false, mode: "demo", message: "SEPAY_API_TOKEN chưa được cấu hình trong .env.local" });
  }

  try {
    const res = await fetch(
      `https://userapi.sepay.vn/v2/transactions?q=${encodeURIComponent(code)}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ isPaid: false, error: `SePay API error: ${res.status}` });
    }

    const data = await res.json();
    const transactions = data?.transactions || data?.data || [];

    // Tìm giao dịch tiền vào (transferType === "in") khớp mã và số tiền
    const matched = transactions.find(
      (tx: { transferType: string; transferAmount: number; content: string }) =>
        tx.transferType === "in" &&
        tx.transferAmount >= amount &&
        tx.content?.toUpperCase().includes(code.toUpperCase())
    );

    return NextResponse.json({
      isPaid: !!matched,
      transaction: matched
        ? {
            id: matched.id,
            amount: matched.transferAmount,
            date: matched.transactionDate,
            content: matched.content,
          }
        : null,
    });
  } catch (err) {
    return NextResponse.json({ isPaid: false, error: "Network error" }, { status: 500 });
  }
}
