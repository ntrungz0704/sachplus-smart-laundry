export type LaundryService = "Giặt & sấy" | "Giặt hấp" | "Chăn ga" | "Giày & túi";
export type LaundryStatus =
  | "Đã đặt"
  | "Shipper đã lấy"
  | "Đã nhận tại tiệm"
  | "Đang phân loại"
  | "Đang giặt"
  | "Đang sấy"
  | "QC & đóng gói"
  | "Đang giao"
  | "Hoàn tất"
  | "Hủy đơn";

export const ORDER_FLOW_STEPS: LaundryStatus[] = [
  "Đã đặt",
  "Shipper đã lấy",
  "Đã nhận tại tiệm",
  "Đang phân loại",
  "Đang giặt",
  "Đang sấy",
  "QC & đóng gói",
  "Đang giao",
  "Hoàn tất",
];

export function getNextStatus(currentStatus: LaundryStatus): LaundryStatus | null {
  const index = ORDER_FLOW_STEPS.indexOf(currentStatus);
  if (index === -1 || index >= ORDER_FLOW_STEPS.length - 1) return null;
  return ORDER_FLOW_STEPS[index + 1];
}

export function getForwardStatuses(currentStatus: LaundryStatus): LaundryStatus[] {
  const index = ORDER_FLOW_STEPS.indexOf(currentStatus);
  if (index === -1 || index >= ORDER_FLOW_STEPS.length - 1) return [];
  return ORDER_FLOW_STEPS.slice(index + 1);
}

export function canCustomerCancel(status: LaundryStatus): boolean {
  return status === "Đã đặt";
}

export type OrderComplaint = {
  id: string;
  orderId: string;
  type: "Thiếu đồ" | "Đồ chưa sạch" | "Hỏng hóc/Vết rách" | "Giao trễ" | "Khác";
  description: string;
  status: "Đang tiếp nhận" | "Đang xử lý" | "Đã bồi hoàn";
  createdAt: string;
};

export type LaundryOrder = {
  id: string;
  service: LaundryService;
  pickupDate: string;
  pickupTime: string;
  journey: string;
  status: LaundryStatus;
  total: number;
  weight?: string;
  machineId?: string;
  machineTimer?: string;
  express?: boolean;
  qrCode?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  cafeItems?: string[];
  voucherCode?: string;
  discountAmount?: number;
  complaints?: OrderComplaint[];
};

export type VoucherItem = {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  activeDays: "all" | "weekdays" | "weekends";
  timeSlot: "all_day" | "custom";
  timeStart?: string; // HH:mm
  timeEnd?: string; // HH:mm
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
};

export type ServiceItem = {
  id: string;
  name: LaundryService;
  price: number;
  unit: string;
  duration: string;
  detail: string;
  highlight: string;
  status?: "active" | "archived";
  category?: string;
};

export type CafeMenuItem = {
  id: string;
  category: string;
  name: string;
  note: string;
  price: number;
  image: string;
  status?: "active" | "archived";
};

export type MachineItem = {
  id: string;
  type: string;
  status: string;
  note: string;
  state: "idle" | "running" | "waiting" | "error";
  assignedOrder?: string;
};

// ============================================================
// DEFAULT DATA — only used to seed localStorage on first visit
// ============================================================

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "wash",
    name: "Giặt & sấy",
    price: 69000,
    unit: "3kg",
    duration: "Chu trình 2h · Giao chuẩn 24h",
    detail: "Giặt nước công nghệ tạo bọt siêu vi, sấy tiệt trùng nhiệt độ chuẩn từng sợi vải và gấp gọn tinh tươm.",
    highlight: "Bán chạy nhất",
    status: "active",
    category: "Giặt nước tiêu chuẩn",
  },
  {
    id: "dry",
    name: "Giặt hấp",
    price: 89000,
    unit: "món",
    duration: "Xử lý 4-6h · Giao chuẩn 24h",
    detail: "Dung dịch giặt khô sinh học organic, an toàn cho vest cao cấp, đầm lụa, áo dài và vải nhạy cảm.",
    highlight: "Chăm sóc nâng niu",
    status: "active",
    category: "Chăm sóc cao cấp",
  },
  {
    id: "bedding",
    name: "Chăn ga",
    price: 129000,
    unit: "bộ",
    duration: "Khử khuẩn 3-4h · Giao chuẩn 24h",
    detail: "Làm sạch sâu mạt bụi, khử khuẩn ozone cho chăn bông dày, ga giường, drap phủ và gối ngủ gia đình.",
    highlight: "Khử khuẩn 99.9%",
    status: "active",
    category: "Khử khuẩn chuyên sâu",
  },
  {
    id: "shoes",
    name: "Giày & túi",
    price: 149000,
    unit: "đôi",
    duration: "Spa sâu 12-24h · Giao chuẩn 48h",
    detail: "Vệ sinh bọt khô thủ công, chiếu đèn UV khử mùi hôi, dưỡng da mềm mịn và giữ chuẩn form dáng gốc.",
    highlight: "Chuyên sâu thủ công",
    status: "active",
    category: "Spa phục hồi da",
  },
];

const DEFAULT_CAFE_MENU: CafeMenuItem[] = [
  { id: "americano", category: "Cà phê", name: "Americano Đá", note: "Đậm vừa · Hạt Arabica Cầu Đất", price: 29000, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "bac-xiu", category: "Cà phê", name: "Bạc Xỉu Sạch+", note: "Cà phê sữa dịu · Thơm ngậy", price: 35000, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "latte", category: "Cà phê", name: "Caffe Latte", note: "Êm mượt · Sữa tươi thanh trùng", price: 39000, image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "matcha", category: "Trà", name: "Matcha Latte Nhật", note: "Bột trà Uji Kyoto · Ít ngọt", price: 39000, image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "peach", category: "Trà", name: "Trà Đào Cam Sả", note: "Thanh mát · Đào giòn sần sật", price: 39000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "lotus", category: "Trà", name: "Trà Sen Vàng Kem Sữa", note: "Hạt sen bùi · Lớp foam mặn dịu", price: 42000, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "orange", category: "Trái cây", name: "Cam Ép Tươi Mới", note: "Cam sành nguyên chất 100%", price: 45000, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "avocado", category: "Trái cây", name: "Sinh Tố Bơ Sáp", note: "Bơ tươi Đắk Lắk · Sánh béo", price: 49000, image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "croissant", category: "Bánh", name: "Croissant Bơ Nướng", note: "Vỏ ngàn lớp giòn rụm thơm bơ", price: 32000, image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&auto=format&fit=crop&q=80", status: "active" },
  { id: "sandwich", category: "Bánh", name: "Bánh Mì Gà Xé Nấm", note: "Nóng giòn · Đủ dinh dưỡng bữa sáng", price: 45000, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80", status: "active" },
];

const DEFAULT_MACHINES: MachineItem[] = [
  { id: "W-01", type: "Máy giặt công nghiệp 18kg", status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" },
  { id: "W-02", type: "Máy giặt công nghiệp 18kg", status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" },
  { id: "W-03", type: "Máy giặt công nghiệp 12kg", status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" },
  { id: "W-04", type: "Máy giặt công nghiệp 12kg", status: "Trống", note: "Sẵn sàng nhận đơn mới", state: "idle" },
  { id: "D-01", type: "Máy sấy tiệt trùng 18kg", status: "Trống", note: "Sẵn sàng nhận đồ sấy", state: "idle" },
  { id: "D-02", type: "Máy sấy tiệt trùng 18kg", status: "Trống", note: "Sẵn sàng nhận đồ sấy", state: "idle" },
];

const DEFAULT_VOUCHERS: VoucherItem[] = [
  {
    id: "vch-01",
    code: "SACHPLUS30",
    title: "GIẢM 30% ĐƠN GIẶT",
    description: "Giảm 30% (tối đa 50.000₫) cho đơn giặt sấy từ 100.000₫",
    discountType: "percent",
    discountValue: 30,
    maxDiscount: 50000,
    minOrderValue: 100000,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    activeDays: "all",
    timeSlot: "all_day",
    usageLimit: 500,
    usedCount: 142,
    isActive: true,
  },
  {
    id: "vch-02",
    code: "FREESHIPVIN",
    title: "FREESHIP NỘI KHU 0Đ",
    description: "Giảm 25.000₫ phí giao nhận 2 chiều căn hộ cho đơn từ 69.000₫",
    discountType: "fixed",
    discountValue: 25000,
    maxDiscount: 25000,
    minOrderValue: 69000,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    activeDays: "all",
    timeSlot: "all_day",
    usageLimit: 1000,
    usedCount: 389,
    isActive: true,
  },
  {
    id: "vch-03",
    code: "HAPPYHOUR",
    title: "GIỜ VÀNG SÁNG SỚM -20K",
    description: "Giảm ngay 20.000₫ cho đơn đặt trong khung giờ vàng 07:00 - 11:00",
    discountType: "fixed",
    discountValue: 20000,
    maxDiscount: 20000,
    minOrderValue: 69000,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    activeDays: "weekdays",
    timeSlot: "custom",
    timeStart: "07:00",
    timeEnd: "11:00",
    usageLimit: 300,
    usedCount: 78,
    isActive: true,
  },
  {
    id: "vch-04",
    code: "WEEKEND50",
    title: "CUỐI TUẦN THẢNH THƠI -15%",
    description: "Giảm 15% tối đa 60.000₫ cho đơn giặt chăn ga vào Thứ 7 & Chủ Nhật",
    discountType: "percent",
    discountValue: 15,
    maxDiscount: 60000,
    minOrderValue: 120000,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    activeDays: "weekends",
    timeSlot: "all_day",
    usageLimit: 200,
    usedCount: 45,
    isActive: true,
  },
  {
    id: "vch-05",
    code: "ECOCARE",
    title: "CƯ DÂN GIẶT XANH -35K",
    description: "Giảm 35.000₫ khi giặt hấp sinh học Eco hoặc chăn ga drap gia đình",
    discountType: "fixed",
    discountValue: 35000,
    maxDiscount: 35000,
    minOrderValue: 150000,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    activeDays: "all",
    timeSlot: "all_day",
    usageLimit: 150,
    usedCount: 62,
    isActive: true,
  },
];

// ============================================================
// LOCALSTORAGE KEYS
// ============================================================
const KEYS = {
  orders: "sachplus_orders",
  complaints: "sachplus_complaints",
  services: "sachplus_services",
  cafeMenu: "sachplus_cafe_menu",
  machines: "sachplus_machines",
  wallet: "sachplus_wallet",
  transactions: "sachplus_transactions",
  vouchers: "sachplus_vouchers",
  cafeOrders: "sachplus_cafe_orders",
} as const;

// ============================================================
// HELPERS
// ============================================================

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "₫";
}

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      try { localStorage.setItem(key, JSON.stringify(fallback)); } catch {}
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === 0 && (fallback as unknown[]).length > 0) {
      try { localStorage.setItem(key, JSON.stringify(fallback)); } catch {}
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ============================================================
// REAL-TIME CROSS-TAB SYNC ENGINE (BroadcastChannel + Storage)
// ============================================================

let realtimeChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined") {
  // 1. Modern BroadcastChannel API: zero-latency cross-tab event transmission
  if ("BroadcastChannel" in window) {
    try {
      realtimeChannel = new BroadcastChannel("sachplus_realtime_sync");
      realtimeChannel.onmessage = (event) => {
        const { type, detail } = event.data || {};
        if (type && typeof type === "string") {
          window.dispatchEvent(new CustomEvent(type, { detail }));
        }
      };
    } catch {
      // BroadcastChannel unavailable
    }
  }

  // 2. Storage Event Listener: bulletproof fallback across windows/iframes
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (e.key === KEYS.orders) {
      window.dispatchEvent(new CustomEvent("sachplus:order-updated"));
      window.dispatchEvent(new CustomEvent("sachplus:order-created"));
    } else if (e.key === KEYS.vouchers) {
      window.dispatchEvent(new CustomEvent("sachplus:vouchers-updated"));
    } else if (e.key === KEYS.services) {
      window.dispatchEvent(new CustomEvent("sachplus:service-updated"));
    } else if (e.key === KEYS.cafeMenu) {
      window.dispatchEvent(new CustomEvent("sachplus:menu-updated"));
    } else if (e.key === KEYS.machines) {
      window.dispatchEvent(new CustomEvent("sachplus:machines-updated"));
    } else if (e.key === KEYS.wallet) {
      window.dispatchEvent(new CustomEvent("sachplus:wallet-updated"));
    } else if (e.key === KEYS.cafeOrders) {
      window.dispatchEvent(new CustomEvent("sachplus:cafe-order-created"));
    }
  });
}

function emit(name: string, detail?: unknown) {
  if (typeof window !== "undefined") {
    // 1. Dispatch locally in the current tab
    window.dispatchEvent(new CustomEvent(name, { detail }));

    // 2. Broadcast immediately to all other open tabs in the browser
    if (realtimeChannel) {
      try {
        realtimeChannel.postMessage({ type: name, detail });
      } catch {}
    }
  }
}

// ============================================================
// SERVICE CATALOG — CRUD
// ============================================================

export function getServiceCatalog(): ServiceItem[] {
  return safeGet(KEYS.services, DEFAULT_SERVICES);
}

export function saveServiceCatalog(items: ServiceItem[]) {
  safeSet(KEYS.services, items);
  emit("sachplus:service-updated", items);
}

export function toggleServiceStatus(id: string): ServiceItem[] {
  const current = getServiceCatalog();
  const updated = current.map((s) =>
    s.id === id
      ? { ...s, status: s.status === "archived" ? ("active" as const) : ("archived" as const) }
      : s
  );
  saveServiceCatalog(updated);
  return updated;
}

/** Legacy alias */
export const serviceCatalog = DEFAULT_SERVICES;

// ============================================================
// CAFÉ MENU — CRUD
// ============================================================

export function getCafeMenu(): CafeMenuItem[] {
  return safeGet(KEYS.cafeMenu, DEFAULT_CAFE_MENU);
}

export function saveCafeMenu(items: CafeMenuItem[]) {
  safeSet(KEYS.cafeMenu, items);
  emit("sachplus:menu-updated", items);
}

export function toggleCafeMenuStatus(id: string): CafeMenuItem[] {
  const current = getCafeMenu();
  const updated = current.map((c) =>
    c.id === id
      ? { ...c, status: c.status === "archived" ? ("active" as const) : ("archived" as const) }
      : c
  );
  saveCafeMenu(updated);
  return updated;
}

// ============================================================
// MACHINES — CRUD
// ============================================================

export function getMachines(): MachineItem[] {
  return safeGet(KEYS.machines, DEFAULT_MACHINES);
}

export function saveMachines(items: MachineItem[]) {
  safeSet(KEYS.machines, items);
  emit("sachplus:machines-updated", items);
}

export const DEFAULT_LAUNDRY_ORDERS: LaundryOrder[] = [
  {
    id: "SP-882194",
    service: "Giặt & sấy",
    pickupDate: "17/09/2026",
    pickupTime: "08:30 – 09:30",
    journey: "Lấy tại sảnh Landmark 81 → Giao tận cửa",
    status: "Đang giặt",
    total: 84000,
    weight: "4.2kg",
    machineId: "W-01",
    machineTimer: "28 phút còn lại",
    qrCode: "SP-882194-SGPARK",
    customerName: "Nguyễn Trung (Cư dân)",
    customerPhone: "0901234567",
    customerAddress: "Landmark 81 · Căn 28.05",
    beforePhoto: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80",
    createdAt: "2026-09-17T08:30:00.000Z",
  },
  {
    id: "SP-881920",
    service: "Giặt hấp",
    pickupDate: "17/09/2026",
    pickupTime: "10:00 – 11:00",
    journey: "Gửi tại quầy Shophouse SH-08",
    status: "QC & đóng gói",
    total: 178000,
    weight: "2 áo vest + 1 đầm lụa",
    qrCode: "SP-881920-SGPARK",
    customerName: "Trần Mai Chi",
    customerPhone: "0912345678",
    customerAddress: "Park 5 · Căn 12.02",
    beforePhoto: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=600&q=80",
    createdAt: "2026-09-17T07:15:00.000Z",
  },
  {
    id: "SP-879410",
    service: "Chăn ga",
    pickupDate: "16/09/2026",
    pickupTime: "16:00 – 17:00",
    journey: "Lấy tại sảnh Park 3 → Giao tận cửa",
    status: "Hoàn tất",
    total: 129000,
    weight: "1 bộ chăn ga King",
    qrCode: "SP-879410-SGPARK",
    customerName: "Lê Văn Hùng",
    customerPhone: "0933221100",
    customerAddress: "Park 3 · Căn 18.06",
    beforePhoto: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80",
    afterPhoto: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&q=80",
    createdAt: "2026-09-16T15:00:00.000Z",
  },
];

export function getLaundryOrders(): LaundryOrder[] {
  return safeGet<LaundryOrder[]>(KEYS.orders, DEFAULT_LAUNDRY_ORDERS);
}

export function createLaundryOrder(input: {
  service: LaundryService;
  pickupDate?: string;
  pickupTime?: string;
  journey?: string;
  total?: number;
  express?: boolean;
  cafeTotal?: number;
  cafeItems?: string[];
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  weight?: string;
  status?: LaundryStatus;
  machineId?: string;
  voucherCode?: string;
  discountAmount?: number;
}) {
  const catalog = getServiceCatalog();
  const base = catalog.find((item) => item.name === input.service)?.price ?? 69000;
  const rawTotal = base + (input.express ? 30000 : 0) + (input.cafeTotal ?? 0);
  const calculatedTotal = input.total !== undefined
    ? input.total
    : Math.max(0, rawTotal - (input.discountAmount ?? 0));
  const id = `SP-${new Date().getTime().toString().slice(-6)}`;
  
  const todayFormatted = new Date().toLocaleDateString("vi-VN");
  const pickupDate = input.pickupDate
    ? (input.pickupDate.includes("-") ? input.pickupDate.split("-").reverse().join("/") : input.pickupDate)
    : todayFormatted;

  const order: LaundryOrder = {
    id,
    service: input.service,
    pickupDate,
    pickupTime: input.pickupTime || "Tại quầy Shophouse SH-08",
    journey: input.journey ?? "Lấy tại nhà → giao tận nhà",
    status: input.status ?? "Đã đặt",
    total: calculatedTotal,
    weight: input.weight,
    express: input.express,
    machineId: input.machineId,
    qrCode: `${id}-VINHOMES-SGPARK`,
    cafeItems: input.cafeItems,
    voucherCode: input.voucherCode,
    discountAmount: input.discountAmount,
    customerName: input.customerName || "Cư dân",
    customerPhone: input.customerPhone || "0901234567",
    customerAddress: input.customerAddress || "Shophouse SH-08",
    createdAt: new Date().toISOString(),
  };

  if (input.voucherCode) {
    incrementVoucherUsage(input.voucherCode);
  }

  const existing = getLaundryOrders();
  safeSet(KEYS.orders, [order, ...existing]);
  emit("sachplus:order-created", order);
  return order;
}

export function updateOrderStatus(orderId: string, status: LaundryStatus, extra?: Partial<LaundryOrder>) {
  const orders = getLaundryOrders();
  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status, ...extra } : o
  );
  safeSet(KEYS.orders, updated);
  emit("sachplus:order-updated", { orderId, status });
  return updated;
}

/**
 * Điều phối tiến độ một chiều (Forward-Only Progression)
 * Chỉ cho phép tiến bước tiếp theo trong ORDER_FLOW_STEPS, nghiêm cấm quay lùi bước cũ
 */
export function advanceOrderStatus(
  orderId: string,
  targetStatus: LaundryStatus,
  extra?: Partial<LaundryOrder>
): { success: boolean; message: string; orders?: LaundryOrder[] } {
  const orders = getLaundryOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Không tìm thấy đơn hàng trên hệ thống." };

  if (order.status === "Hủy đơn") {
    return { success: false, message: "Đơn hàng đã hủy, không thể tiếp tục điều phối." };
  }
  if (order.status === "Hoàn tất") {
    return { success: false, message: "Đơn hàng đã hoàn tất thành công." };
  }

  const currentIndex = ORDER_FLOW_STEPS.indexOf(order.status);
  const nextIndex = ORDER_FLOW_STEPS.indexOf(targetStatus);

  if (currentIndex !== -1 && nextIndex !== -1 && nextIndex <= currentIndex) {
    return {
      success: false,
      message: `Quy trình giặt ủi một chiều: Không thể lùi trạng thái từ "${order.status}" về "${targetStatus}".`,
    };
  }

  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status: targetStatus, ...extra } : o
  );
  safeSet(KEYS.orders, updated);
  emit("sachplus:order-updated", { orderId, status: targetStatus, previousStatus: order.status });
  return { success: true, message: `Đã chuyển đơn ${orderId} sang: "${targetStatus}"`, orders: updated };
}

/**
 * Hủy đơn hàng bảo lưu lịch sử sổ cái (Soft-Cancel)
 * - Khách hàng chỉ được hủy khi đơn ở trạng thái "Đã đặt"
 * - Nhân viên & Quản trị được hủy khi có lý do chính đáng trước khi đơn "Hoàn tất"
 */
export function cancelOrder(
  orderId: string,
  reason: string = "Khách hàng yêu cầu hủy",
  cancelledByRole: "customer" | "staff" | "admin" = "customer"
): { success: boolean; message: string; orders?: LaundryOrder[] } {
  const orders = getLaundryOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Không tìm thấy đơn hàng." };

  if (order.status === "Hủy đơn") {
    return { success: false, message: "Đơn hàng đã được hủy trước đó." };
  }
  if (order.status === "Hoàn tất") {
    return { success: false, message: "Đơn hàng đã hoàn tất, không thể hủy." };
  }

  if (cancelledByRole === "customer" && order.status !== "Đã đặt") {
    return {
      success: false,
      message: "Đơn hàng đã được tiệm tiếp nhận và đưa vào chu trình giặt tiệt trùng. Không thể tự hủy đơn. Quý khách vui lòng liên hệ Hotline 0901.234.567 để được hỗ trợ khẩn cấp.",
    };
  }

  const updated = orders.map((o) =>
    o.id === orderId ? { ...o, status: "Hủy đơn" as LaundryStatus } : o
  );
  safeSet(KEYS.orders, updated);
  emit("sachplus:order-updated", { orderId, status: "Hủy đơn", reason, cancelledByRole });
  return {
    success: true,
    message: `Đã hủy đơn #${orderId} thành công (Lưu vết sổ cái).`,
    orders: updated,
  };
}

export function deleteOrder(orderId: string) {
  const orders = getLaundryOrders().filter((o) => o.id !== orderId);
  safeSet(KEYS.orders, orders);
  emit("sachplus:order-updated", { orderId, deleted: true });
}

// ============================================================
// COMPLAINTS — CRUD
// ============================================================

export function getOrderComplaints(orderId?: string): OrderComplaint[] {
  const all = safeGet<OrderComplaint[]>(KEYS.complaints, []);
  return orderId ? all.filter((c) => c.orderId === orderId) : all;
}

export function submitOrderComplaint(orderId: string, type: OrderComplaint["type"], description: string) {
  const complaint: OrderComplaint = {
    id: `CS-${new Date().getTime().toString().slice(-4)}`,
    orderId,
    type,
    description,
    status: "Đang tiếp nhận",
    createdAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " hôm nay",
  };
  const existing = getOrderComplaints();
  safeSet(KEYS.complaints, [complaint, ...existing]);
  emit("sachplus:complaint-submitted", complaint);
  return complaint;
}

// ============================================================
// WALLET — Read/Write (Per-User Namespace)
// ============================================================

function walletKey(userId?: string): string {
  return userId ? `${KEYS.wallet}_${userId}` : KEYS.wallet;
}
function txKey(userId?: string): string {
  return userId ? `${KEYS.transactions}_${userId}` : KEYS.transactions;
}

export function getWalletBalance(userId?: string): number {
  return safeGet(walletKey(userId), 0);
}

export function addWalletBalance(amount: number, userId?: string) {
  const current = getWalletBalance(userId);
  const next = current + amount;
  safeSet(walletKey(userId), next);
  addTransaction({ type: "Nạp tiền", amount, note: `Nạp ${formatVnd(amount)} qua VietQR` }, userId);
  emit("sachplus:wallet-updated", next);
  return next;
}

export type Transaction = {
  id: string;
  type: string;
  amount: number;
  note: string;
  createdAt: string;
};

export function getTransactions(userId?: string): Transaction[] {
  return safeGet<Transaction[]>(txKey(userId), []);
}

export function addTransaction(input: { type: string; amount: number; note: string }, userId?: string) {
  const tx: Transaction = {
    id: `TX-${Date.now().toString().slice(-6)}`,
    ...input,
    createdAt: new Date().toISOString(),
  };
  const existing = getTransactions(userId);
  safeSet(txKey(userId), [tx, ...existing]);
  return tx;
}

/**
 * Tính điểm tích lũy từ đơn hàng đã hoàn tất (1 điểm / 1.000₫)
 */
export function getAccumulatedPoints(): number {
  const orders = getLaundryOrders();
  return orders
    .filter((o) => o.status === "Hoàn tất")
    .reduce((sum, o) => sum + Math.floor(o.total / 1000), 0);
}

// ============================================================
// PROMOTIONS & VOUCHERS — CRUD & ENGINE
// ============================================================

export function getVouchers(): VoucherItem[] {
  return safeGet<VoucherItem[]>(KEYS.vouchers, DEFAULT_VOUCHERS);
}

export function saveVouchers(items: VoucherItem[]) {
  safeSet(KEYS.vouchers, items);
  emit("sachplus:vouchers-updated", items);
}

export function incrementVoucherUsage(code: string) {
  const vouchers = getVouchers();
  const updated = vouchers.map((v) =>
    v.code.toUpperCase() === code.trim().toUpperCase()
      ? { ...v, usedCount: (v.usedCount || 0) + 1 }
      : v
  );
  saveVouchers(updated);
}

export function validateVoucher(
  code: string,
  orderValue: number,
  refDate: Date = new Date()
): { valid: boolean; message: string; discountAmount: number; voucher?: VoucherItem } {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "Vui lòng nhập mã ưu đãi.", discountAmount: 0 };
  }

  const vouchers = getVouchers();
  const found = vouchers.find((v) => v.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, message: `Mã ưu đãi "${cleanCode}" không tồn tại.`, discountAmount: 0 };
  }

  if (!found.isActive) {
    return { valid: false, message: `Mã ưu đãi "${found.code}" hiện đang tạm dừng áp dụng.`, discountAmount: 0, voucher: found };
  }

  // Check date range
  const todayStr = refDate.toISOString().split("T")[0]; // YYYY-MM-DD
  if (found.startDate && todayStr < found.startDate) {
    return {
      valid: false,
      message: `Mã ưu đãi bắt đầu áp dụng từ ngày ${found.startDate.split("-").reverse().join("/")}.`,
      discountAmount: 0,
      voucher: found,
    };
  }
  if (found.endDate && todayStr > found.endDate) {
    return {
      valid: false,
      message: `Mã ưu đãi đã hết hạn vào ngày ${found.endDate.split("-").reverse().join("/")}.`,
      discountAmount: 0,
      voucher: found,
    };
  }

  // Check day of week
  const dayOfWeek = refDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (found.activeDays === "weekdays" && isWeekend) {
    return { valid: false, message: `Mã ưu đãi "${found.code}" chỉ áp dụng từ Thứ 2 đến Thứ 6.`, discountAmount: 0, voucher: found };
  }
  if (found.activeDays === "weekends" && !isWeekend) {
    return { valid: false, message: `Mã ưu đãi "${found.code}" chỉ áp dụng vào Thứ 7 và Chủ Nhật.`, discountAmount: 0, voucher: found };
  }

  // Check time slot / golden hour
  if (found.timeSlot === "custom" && found.timeStart && found.timeEnd) {
    const currentHours = String(refDate.getHours()).padStart(2, "0");
    const currentMins = String(refDate.getMinutes()).padStart(2, "0");
    const currentTime = `${currentHours}:${currentMins}`;
    if (currentTime < found.timeStart || currentTime > found.timeEnd) {
      return {
        valid: false,
        message: `Mã ưu đãi "${found.code}" chỉ áp dụng trong khung giờ vàng (${found.timeStart} – ${found.timeEnd}).`,
        discountAmount: 0,
        voucher: found,
      };
    }
  }

  // Check minimum order value
  if (orderValue < (found.minOrderValue || 0)) {
    return {
      valid: false,
      message: `Đơn hàng tối thiểu để áp dụng mã là ${formatVnd(found.minOrderValue)} (hiện tại: ${formatVnd(orderValue)}).`,
      discountAmount: 0,
      voucher: found,
    };
  }

  // Check usage limit
  if (found.usageLimit && found.usedCount >= found.usageLimit) {
    return {
      valid: false,
      message: `Mã ưu đãi "${found.code}" đã hết lượt sử dụng trong chương trình.`,
      discountAmount: 0,
      voucher: found,
    };
  }

  // Calculate discount amount
  let discount = 0;
  if (found.discountType === "percent") {
    discount = Math.round((orderValue * found.discountValue) / 100);
    if (found.maxDiscount && discount > found.maxDiscount) {
      discount = found.maxDiscount;
    }
  } else {
    discount = Math.min(found.discountValue, orderValue);
  }

  return {
    valid: true,
    message: `Áp dụng thành công! Giảm ${formatVnd(discount)} cho đơn hàng.`,
    discountAmount: discount,
    voucher: found,
  };
}

// ============================================================
// CAFÉ ORDERS — Read/Write
// ============================================================

export type CafeOrder = {
  id: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  mode: string;
  customerName: string;
  note?: string;
  createdAt: string;
};

export function getCafeOrders(): CafeOrder[] {
  return safeGet<CafeOrder[]>(KEYS.cafeOrders, []);
}

export function createCafeOrder(input: Omit<CafeOrder, "id" | "createdAt"> & { id?: string }) {
  const id = input.id || `CF-${Math.floor(1000 + Math.random() * 9000)}`;
  const order: CafeOrder = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  };
  const existing = getCafeOrders();
  safeSet(KEYS.cafeOrders, [order, ...existing]);
  emit("sachplus:cafe-order-created", order);
  return order;
}
