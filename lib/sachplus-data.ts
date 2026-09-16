export type LaundryService = "Giặt & sấy" | "Giặt hấp" | "Chăn ga" | "Giày & túi";
export type LaundryStatus = "Đã đặt" | "Đang phân loại" | "Đang giặt" | "Đang sấy" | "QC & đóng gói" | "Đang giao" | "Hoàn tất";

export type LaundryOrder = {
  id: string;
  service: LaundryService;
  pickupDate: string;
  pickupTime: string;
  journey: string;
  status: LaundryStatus;
  total: number;
  weight?: string;
  express?: boolean;
  createdAt: string;
};

export const serviceCatalog = [
  { id: "wash", name: "Giặt & sấy" as const, price: 69000, unit: "3kg", detail: "Giặt nước, sấy khô và gấp gọn theo từng loại vải." },
  { id: "dry", name: "Giặt hấp" as const, price: 89000, unit: "món", detail: "Chăm sóc vest, đầm, áo dài và chất liệu cao cấp." },
  { id: "bedding", name: "Chăn ga" as const, price: 129000, unit: "bộ", detail: "Khử khuẩn, làm sạch sâu chăn mền, ga và gối." },
  { id: "shoes", name: "Giày & túi" as const, price: 149000, unit: "đôi", detail: "Vệ sinh thủ công, giữ phom và dưỡng bề mặt." },
];

export const baseOrders: LaundryOrder[] = [
  { id: "SP-240916", service: "Giặt & sấy", pickupDate: "16/09/2026", pickupTime: "14:30", journey: "Lấy tại nhà → giao tận nhà", status: "Đang giặt", total: 128000, weight: "6,2 kg", createdAt: "2026-09-16T14:30:00" },
  { id: "SP-110916", service: "Giặt hấp", pickupDate: "11/09/2026", pickupTime: "09:15", journey: "Lấy tại nhà → giao tận nhà", status: "Hoàn tất", total: 245000, weight: "3 món", createdAt: "2026-09-11T09:15:00" },
  { id: "SP-020916", service: "Chăn ga", pickupDate: "02/09/2026", pickupTime: "18:40", journey: "Gửi tại quầy → giao tận nhà", status: "Hoàn tất", total: 198000, weight: "1 bộ", createdAt: "2026-09-02T18:40:00" },
  { id: "SP-280826", service: "Giày & túi", pickupDate: "28/08/2026", pickupTime: "10:20", journey: "Tại cửa hàng", status: "Hoàn tất", total: 298000, weight: "2 đôi", createdAt: "2026-08-28T10:20:00" },
];

const STORAGE_KEY = "sachplus_laundry_orders";

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "₫";
}

export function getLaundryOrders(): LaundryOrder[] {
  if (typeof window === "undefined") return baseOrders;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as LaundryOrder[];
    return [...saved, ...baseOrders];
  } catch {
    return baseOrders;
  }
}

export function createLaundryOrder(input: {
  service: LaundryService;
  pickupDate: string;
  pickupTime: string;
  journey?: string;
  express?: boolean;
  cafeTotal?: number;
}) {
  const base = serviceCatalog.find((item) => item.name === input.service)?.price ?? 69000;
  const total = base + (input.express ? 30000 : 0) + (input.cafeTotal ?? 0);
  const id = `SP-${new Date().getTime().toString().slice(-6)}`;
  const order: LaundryOrder = {
    id,
    service: input.service,
    pickupDate: input.pickupDate.split("-").reverse().join("/"),
    pickupTime: input.pickupTime,
    journey: input.journey ?? "Lấy tại nhà → giao tận nhà",
    status: "Đã đặt",
    total,
    express: input.express,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    const existing = getLaundryOrders().filter((item) => !baseOrders.some((baseItem) => baseItem.id === item.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...existing]));
    window.dispatchEvent(new CustomEvent("sachplus:order-created", { detail: order }));
  }
  return order;
}
