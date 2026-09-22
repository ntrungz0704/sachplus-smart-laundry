export type LaundryService = "Giặt & sấy" | "Giặt hấp" | "Chăn ga" | "Giày & túi";
export type LaundryStatus =
  | "Đã đặt"
  | "Shipper đã lấy"
  | "Đã nhận tại tiệm"
  | "Đang phân loại"
  | "Đang giặt"
  | "Đang sấy"
  | "QC & đóng gói"
  | "Sẵn sàng lấy tại quầy"
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
  "Sẵn sàng lấy tại quầy",
  "Đang giao",
  "Hoàn tất",
];

export function normalizeDate(dateStr?: string): string {
  if (!dateStr) return "";
  const clean = dateStr.trim();
  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    }
  }
  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
  }
  return clean;
}

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

export const SYSTEM_CONFIG = {
  brandName: "Sạch+ Smart Laundry & Café",
  hotline: "1900 6868",
  hotlineDisplay: "1900 6868 (hoặc 0908.889.999)",
  supportPhone: "0908.889.999",
  email: "support@sachplus.vn",
  address: "Shophouse SH-08, Tòa Landmark 81, Vinhomes Sài Gòn Park, Xuân Thới Sơn, TP.HCM",
  workingHours: "07:00 – 22:00 (Cả ngày lễ)",
  vietqr: {
    bankBin: "970415",
    bankCode: "ICB",
    bankName: "VietinBank (CTG)",
    accountNumber: "108875292318",
    accountName: "NGUYEN TRUNG",
  },
};

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
  userId?: string;
  service: LaundryService;
  pickupDate: string;
  pickupTime: string;
  journey: string;
  status: LaundryStatus;
  total: number;
  paymentMethod?: "Ví Sạch+" | "COD" | "VietQR" | "Tại quầy";
  paymentStatus?: "Đã thanh toán" | "Chờ thanh toán" | "Đã hoàn tiền";
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
  stock: number;
  initialStock?: number;
  unit: string;
  alertThreshold: number;
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
  { id: "americano", category: "Cà phê", name: "Americano Đá", note: "Đậm vừa · Hạt Arabica Cầu Đất", price: 29000, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80", status: "active", stock: 85, initialStock: 100, unit: "ly", alertThreshold: 15 },
  { id: "bac-xiu", category: "Cà phê", name: "Bạc Xỉu Sạch+", note: "Cà phê sữa dịu · Thơm ngậy", price: 35000, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80", status: "active", stock: 62, initialStock: 100, unit: "ly", alertThreshold: 15 },
  { id: "latte", category: "Cà phê", name: "Caffe Latte", note: "Êm mượt · Sữa tươi thanh trùng", price: 39000, image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=80", status: "active", stock: 48, initialStock: 80, unit: "ly", alertThreshold: 10 },
  { id: "matcha", category: "Trà", name: "Matcha Latte Nhật", note: "Bột trà Uji Kyoto · Ít ngọt", price: 39000, image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&auto=format&fit=crop&q=80", status: "active", stock: 40, initialStock: 60, unit: "ly", alertThreshold: 10 },
  { id: "peach", category: "Trà", name: "Trà Đào Cam Sả", note: "Thanh mát · Đào giòn sần sật", price: 39000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=80", status: "active", stock: 35, initialStock: 60, unit: "ly", alertThreshold: 10 },
  { id: "lotus", category: "Trà", name: "Trà Sen Vàng Kem Sữa", note: "Hạt sen bùi · Lớp foam mặn dịu", price: 42000, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80", status: "active", stock: 28, initialStock: 50, unit: "ly", alertThreshold: 10 },
  { id: "orange", category: "Trái cây", name: "Cam Ép Tươi Mới", note: "Cam sành nguyên chất 100%", price: 45000, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop&q=80", status: "active", stock: 22, initialStock: 40, unit: "ly", alertThreshold: 8 },
  { id: "avocado", category: "Trái cây", name: "Sinh Tố Bơ Sáp", note: "Bơ tươi Đắk Lắk · Sánh béo", price: 49000, image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&auto=format&fit=crop&q=80", status: "active", stock: 18, initialStock: 35, unit: "ly", alertThreshold: 8 },
  { id: "croissant", category: "Bánh", name: "Croissant Bơ Nướng", note: "Vỏ ngàn lớp giòn rụm thơm bơ", price: 32000, image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&auto=format&fit=crop&q=80", status: "active", stock: 12, initialStock: 30, unit: "cái", alertThreshold: 5 },
  { id: "sandwich", category: "Bánh", name: "Bánh Mì Gà Xé Nấm", note: "Nóng giòn · Đủ dinh dưỡng bữa sáng", price: 45000, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80", status: "active", stock: 8, initialStock: 25, unit: "phần", alertThreshold: 5 },
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
    usedCount: 0,
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
    usedCount: 0,
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
    usedCount: 0,
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
    usedCount: 0,
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
    usedCount: 0,
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
    return parsed as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Tự động dọn dẹp sạch sẽ 100% hóa đơn cũ trên trình duyệt để khởi động từ con số 0
if (typeof window !== "undefined") {
  try {
    const CLEAN_KEY = "sachplus_clean_zero_orders_v2";
    if (localStorage.getItem(CLEAN_KEY) !== "true") {
      localStorage.setItem(KEYS.orders, JSON.stringify([]));
      localStorage.setItem(KEYS.cafeOrders, JSON.stringify([]));
      localStorage.setItem(CLEAN_KEY, "true");
    }
  } catch {}
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
    } else if (e.key === KEYS.wallet || e.key.startsWith(KEYS.wallet) || e.key.startsWith(KEYS.transactions)) {
      window.dispatchEvent(new CustomEvent("sachplus:wallet-updated"));
    } else if (e.key === KEYS.cafeOrders) {
      window.dispatchEvent(new CustomEvent("sachplus:cafe-order-created"));
    } else if (e.key === KEYS.complaints) {
      window.dispatchEvent(new CustomEvent("sachplus:complaint-submitted"));
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
  const items = safeGet<CafeMenuItem[]>(KEYS.cafeMenu, DEFAULT_CAFE_MENU);
  return items.map((item) => {
    const def = DEFAULT_CAFE_MENU.find((d) => d.id === item.id);
    return {
      ...item,
      stock: typeof item.stock === "number" ? item.stock : (def?.stock ?? 50),
      initialStock: typeof item.initialStock === "number" ? item.initialStock : (def?.initialStock ?? 60),
      unit: item.unit || def?.unit || "ly",
      alertThreshold: typeof item.alertThreshold === "number" ? item.alertThreshold : (def?.alertThreshold ?? 10),
    };
  });
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

export function deleteCafeMenuItem(id: string): CafeMenuItem[] {
  const current = getCafeMenu();
  const updated = current.filter((c) => c.id !== id);
  saveCafeMenu(updated);
  return updated;
}

export function adjustCafeStock(id: string, delta: number, reason?: string): { success: boolean; item?: CafeMenuItem; message: string } {
  const current = getCafeMenu();
  const found = current.find((c) => c.id === id);
  if (!found) {
    return { success: false, message: "Không tìm thấy món trong menu." };
  }
  const newStock = Math.max(0, found.stock + delta);
  const updated = current.map((c) => (c.id === id ? { ...c, stock: newStock } : c));
  saveCafeMenu(updated);
  const actionText = delta >= 0 ? `Nhập thêm ${delta}` : `Xuất bớt ${Math.abs(delta)}`;
  const reasonText = reason ? ` (${reason})` : "";
  return {
    success: true,
    item: { ...found, stock: newStock },
    message: `Đã ${actionText} ${found.unit || "ly"} cho món "${found.name}"${reasonText}. Tồn kho hiện tại: ${newStock} ${found.unit || "ly"}.`,
  };
}

export function setCafeStock(id: string, stock: number): { success: boolean; item?: CafeMenuItem; message: string } {
  const current = getCafeMenu();
  const found = current.find((c) => c.id === id);
  if (!found) {
    return { success: false, message: "Không tìm thấy món trong menu." };
  }
  const newStock = Math.max(0, stock);
  const updated = current.map((c) => (c.id === id ? { ...c, stock: newStock } : c));
  saveCafeMenu(updated);
  return {
    success: true,
    item: { ...found, stock: newStock },
    message: `Đã cập nhật tồn kho món "${found.name}" thành ${newStock} ${found.unit || "ly"}.`,
  };
}

export interface ProductMetrics {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  totalUnitsSold: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
  stock: number;
  unit: string;
  alertThreshold: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
}

export function getProductMetrics(itemId: string): ProductMetrics {
  const menu = getCafeMenu();
  const item = menu.find((c) => c.id === itemId || c.name.toLowerCase() === itemId.toLowerCase());
  const cafeOrders = getCafeOrders();
  const laundryOrders = getLaundryOrders();

  let unitsSold = 0;
  let orderCount = 0;
  const customers = new Set<string>();
  let revenue = 0;

  const itemNameLower = item ? item.name.toLowerCase() : itemId.toLowerCase();
  const itemIdLower = item ? item.id.toLowerCase() : itemId.toLowerCase();

  // 1. Quét qua toàn bộ đơn đặt tại quầy Café
  cafeOrders.forEach((order) => {
    let orderMatched = false;
    order.items?.forEach((it) => {
      const match =
        it.id?.toLowerCase() === itemIdLower ||
        it.name?.toLowerCase() === itemNameLower ||
        it.name?.toLowerCase().includes(itemNameLower);
      if (match) {
        const qty = it.quantity || 1;
        unitsSold += qty;
        revenue += (it.price || item?.price || 0) * qty;
        orderMatched = true;
      }
    });
    if (orderMatched) {
      orderCount++;
      if (order.customerName) {
        customers.add(order.customerName.trim().toLowerCase());
      }
    }
  });

  // 2. Quét qua các đơn giặt sấy có chọn thêm đồ uống (cafeItems)
  laundryOrders.forEach((lo) => {
    let loMatched = false;
    lo.cafeItems?.forEach((ci) => {
      const match =
        ci.toLowerCase().includes(itemNameLower) ||
        (item && itemNameLower.includes(ci.toLowerCase()));
      if (match) {
        unitsSold += 1;
        revenue += item ? item.price : 35000;
        loMatched = true;
      }
    });
    if (loMatched) {
      orderCount++;
      const custId = lo.customerPhone || lo.customerName || "Khách cư dân";
      customers.add(custId.trim().toLowerCase());
    }
  });

  const stock = item?.stock ?? 0;
  const threshold = item?.alertThreshold ?? 10;
  let stockStatus: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
  if (stock <= 0) {
    stockStatus = "out_of_stock";
  } else if (stock <= threshold) {
    stockStatus = "low_stock";
  }

  return {
    itemId: item?.id || itemId,
    itemName: item?.name || itemId,
    category: item?.category || "Khác",
    price: item?.price || 0,
    totalUnitsSold: unitsSold,
    totalOrders: orderCount,
    totalCustomers: customers.size,
    revenue,
    stock,
    unit: item?.unit || "ly",
    alertThreshold: threshold,
    stockStatus,
  };
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

export const DEFAULT_LAUNDRY_ORDERS: LaundryOrder[] = [];

export function getLaundryOrders(): LaundryOrder[] {
  const orders = safeGet<LaundryOrder[]>(KEYS.orders, DEFAULT_LAUNDRY_ORDERS);
  const sanitized = orders.filter((o) => !["SP-882194", "SP-881920", "SP-879410"].includes(o.id));
  if (sanitized.length !== orders.length && typeof window !== "undefined") {
    try {
      localStorage.setItem(KEYS.orders, JSON.stringify(sanitized));
    } catch {}
  }
  return sanitized;
}

export function createLaundryOrder(input: {
  service: LaundryService;
  userId?: string;
  pickupDate?: string;
  pickupTime?: string;
  journey?: string;
  total?: number;
  paymentMethod?: "Ví Sạch+" | "COD" | "VietQR" | "Tại quầy";
  paymentStatus?: "Đã thanh toán" | "Chờ thanh toán" | "Đã hoàn tiền";
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
    userId: input.userId,
    service: input.service,
    pickupDate,
    pickupTime: input.pickupTime || "Tại quầy Shophouse SH-08",
    journey: input.journey ?? "Lấy tại nhà → giao tận nhà",
    status: input.status ?? "Đã đặt",
    total: calculatedTotal,
    paymentMethod: input.paymentMethod || "COD",
    paymentStatus: input.paymentStatus || (input.paymentMethod === "Ví Sạch+" ? "Đã thanh toán" : "Chờ thanh toán"),
    weight: input.weight,
    express: input.express,
    machineId: input.machineId,
    qrCode: `${id}-VINHOMES-SGPARK`,
    cafeItems: input.cafeItems,
    voucherCode: input.voucherCode,
    discountAmount: input.discountAmount,
    customerName: input.customerName || "Cư dân",
    customerPhone: input.customerPhone ? input.customerPhone.trim() : "",
    customerAddress: input.customerAddress ? input.customerAddress.trim() : SYSTEM_CONFIG.address,
    createdAt: new Date().toISOString(),
  };

  if (input.voucherCode) {
    incrementVoucherUsage(input.voucherCode);
  }

  // Khấu trừ tồn kho và tự động chuyển phiếu pha chế sang quầy Barista
  if (input.cafeItems && input.cafeItems.length > 0) {
    const menu = getCafeMenu();
    let menuChanged = false;
    const cafeItemsList: { id: string; name: string; quantity: number; price: number }[] = [];
    const updatedMenu = menu.map((menuItem) => {
      const match = input.cafeItems?.some(
        (ci) =>
          ci.toLowerCase().includes(menuItem.name.toLowerCase()) ||
          menuItem.name.toLowerCase().includes(ci.toLowerCase())
      );
      if (match) {
        menuChanged = true;
        cafeItemsList.push({
          id: menuItem.id,
          name: menuItem.name,
          quantity: 1,
          price: menuItem.price,
        });
        return {
          ...menuItem,
          stock: Math.max(0, menuItem.stock - 1),
        };
      }
      return menuItem;
    });
    if (menuChanged) {
      saveCafeMenu(updatedMenu);
    }

    // Tự động tạo đơn phiếu pha chế sang Sạch+ Café Lầu 1
    try {
      createCafeOrder({
        id: `CF-LINK-${id.replace("SP-", "")}`,
        items: cafeItemsList.length > 0 ? cafeItemsList : input.cafeItems.map(name => ({ id: "addon", name, quantity: 1, price: 35000 })),
        subtotal: input.cafeTotal || 0,
        discount: 0,
        total: input.cafeTotal || 0,
        mode: `Kèm đơn giặt #${id}`,
        customerName: input.customerName || "Cư dân",
        note: `Phục vụ kèm đơn giặt #${id} (Giao: ${input.customerAddress || "Nội khu"})`,
      });
    } catch {}
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
      message: `Đơn hàng đã được tiệm tiếp nhận và đưa vào chu trình giặt tiệt trùng. Không thể tự hủy đơn. Quý khách vui lòng liên hệ Hotline ${SYSTEM_CONFIG.hotlineDisplay} để được hỗ trợ khẩn cấp.`,
    };
  }

  let refundMsg = "";
  let nextPaymentStatus = order.paymentStatus;
  // Tự động hoàn tiền 100% nếu đơn đã thanh toán bằng Ví Sạch+
  if (order.paymentMethod === "Ví Sạch+" && order.paymentStatus === "Đã thanh toán" && order.total > 0) {
    addWalletBalance(order.total, order.userId);
    addTransaction(
      {
        type: "Hoàn tiền",
        amount: order.total,
        note: `Hoàn tiền 100% đơn hủy #${order.id}`,
      },
      order.userId
    );
    nextPaymentStatus = "Đã hoàn tiền";
    refundMsg = ` Đã tự động hoàn trả ${formatVnd(order.total)} vào Ví Sạch+.`;
  }

  // Tự động giải phóng máy giặt/sấy nếu có máy đang được gán
  const machines = getMachines();
  let machineChanged = false;
  const updatedMachines = machines.map((m) => {
    if (m.assignedOrder === orderId || (order.machineId && m.id === order.machineId)) {
      machineChanged = true;
      return {
        ...m,
        status: "Trống",
        note: "Sẵn sàng nhận đơn mới",
        state: "idle" as const,
        assignedOrder: undefined,
      };
    }
    return m;
  });
  if (machineChanged) {
    saveMachines(updatedMachines);
  }

  const updated = orders.map((o) =>
    o.id === orderId
      ? {
          ...o,
          status: "Hủy đơn" as LaundryStatus,
          paymentStatus: nextPaymentStatus,
          machineId: undefined,
          machineTimer: undefined,
        }
      : o
  );
  safeSet(KEYS.orders, updated);
  emit("sachplus:order-updated", { orderId, status: "Hủy đơn", reason, cancelledByRole });
  return {
    success: true,
    message: `Đã hủy đơn #${orderId} thành công.${refundMsg}`,
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

export function deductWalletBalance(
  amount: number,
  userId?: string,
  orderId?: string,
  note?: string
): { success: boolean; newBalance: number; message: string } {
  const current = getWalletBalance(userId);
  if (current < amount) {
    return {
      success: false,
      newBalance: current,
      message: `Số dư Ví Sạch+ không đủ (${formatVnd(current)} < ${formatVnd(amount)}). Vui lòng nạp thêm tiền.`,
    };
  }
  const next = current - amount;
  safeSet(walletKey(userId), next);
  addTransaction(
    {
      type: "Thanh toán",
      amount: -amount,
      note: note || (orderId ? `Thanh toán đơn hàng #${orderId}` : `Thanh toán dịch vụ Sạch+`),
    },
    userId
  );
  emit("sachplus:wallet-updated", next);
  return {
    success: true,
    newBalance: next,
    message: `Đã thanh toán thành công ${formatVnd(amount)} từ Ví Sạch+. Số dư còn lại: ${formatVnd(next)}.`,
  };
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
  const vouchers = safeGet<VoucherItem[]>(KEYS.vouchers, DEFAULT_VOUCHERS);
  const orders = getLaundryOrders();
  let needsSync = false;

  const normalized = vouchers.map((v) => {
    // 100% tính toán động từ đơn hàng thực tế đã áp dụng mã này (hoàn toàn không dùng số ảo như 142, 389...)
    const realUses = orders.filter(
      (o) => o.voucherCode && o.voucherCode.trim().toUpperCase() === v.code.toUpperCase()
    ).length;

    if (v.usedCount !== realUses) {
      needsSync = true;
    }

    return {
      ...v,
      usedCount: realUses,
    };
  });

  // Tự động ghi đè localStorage để dọn dẹp số liệu cũ (142, 389...) đã bị lưu trước đó trong trình duyệt
  if (needsSync && typeof window !== "undefined") {
    try {
      localStorage.setItem(KEYS.vouchers, JSON.stringify(normalized));
    } catch {}
  }

  return normalized;
}

export function saveVouchers(items: VoucherItem[]) {
  const orders = getLaundryOrders();
  const cleaned = items.map((v) => ({
    ...v,
    usedCount: orders.filter(
      (o) => o.voucherCode && o.voucherCode.trim().toUpperCase() === v.code.toUpperCase()
    ).length,
  }));
  safeSet(KEYS.vouchers, cleaned);
  emit("sachplus:vouchers-updated", cleaned);
}

export function deleteVoucher(id: string): VoucherItem[] {
  const vouchers = getVouchers();
  const updated = vouchers.filter((v) => v.id !== id);
  saveVouchers(updated);
  return updated;
}

export function incrementVoucherUsage(code?: string) {
  // getVouchers() tự động tính toán trực tiếp từ orders theo thời gian thực
  emit("sachplus:vouchers-updated", code);
}

export function registerDynamicVoucher(
  voucher: Partial<VoucherItem> & { code: string; discountValue: number }
) {
  const vouchers = getVouchers();
  const cleanCode = voucher.code.toUpperCase();
  if (!vouchers.some((v) => v.code.toUpperCase() === cleanCode)) {
    const newVoucher: VoucherItem = {
      id: `vch-dyn-${Date.now().toString().slice(-6)}`,
      code: cleanCode,
      title: voucher.title || `ƯU ĐÃI ${cleanCode}`,
      description: voucher.description || `Giảm ${voucher.discountValue}% hóa đơn`,
      discountType: voucher.discountType || "percent",
      discountValue: voucher.discountValue,
      maxDiscount: voucher.maxDiscount || 30000,
      minOrderValue: voucher.minOrderValue || 50000,
      startDate: voucher.startDate || "2026-01-01",
      endDate: voucher.endDate || "2026-12-31",
      activeDays: voucher.activeDays || "all",
      timeSlot: voucher.timeSlot || "all_day",
      usageLimit: voucher.usageLimit || 1000,
      usedCount: 0,
      isActive: true,
    };
    saveVouchers([newVoucher, ...vouchers]);
    return newVoucher;
  }
  return vouchers.find((v) => v.code.toUpperCase() === cleanCode);
}

export function validateVoucher(
  code: string,
  orderValue: number,
  refDate: Date = new Date(),
  targetTimeSlot?: string,
  targetDateStr?: string
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

  // Check date range (local time or target date)
  let todayStr: string;
  let dayOfWeek: number;

  if (targetDateStr) {
    todayStr = normalizeDate(targetDateStr);
    const parsedTarget = new Date(targetDateStr);
    dayOfWeek = isNaN(parsedTarget.getDay()) ? refDate.getDay() : parsedTarget.getDay();
  } else {
    const y = refDate.getFullYear();
    const m = String(refDate.getMonth() + 1).padStart(2, "0");
    const d = String(refDate.getDate()).padStart(2, "0");
    todayStr = `${y}-${m}-${d}`;
    dayOfWeek = refDate.getDay();
  }

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

  // Check day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  if (found.activeDays === "weekdays" && isWeekend) {
    return { valid: false, message: `Mã ưu đãi "${found.code}" chỉ áp dụng từ Thứ 2 đến Thứ 6.`, discountAmount: 0, voucher: found };
  }
  if (found.activeDays === "weekends" && !isWeekend) {
    return { valid: false, message: `Mã ưu đãi "${found.code}" chỉ áp dụng vào Thứ 7 và Chủ Nhật.`, discountAmount: 0, voucher: found };
  }

  // Check time slot / golden hour
  if (found.timeSlot === "custom" && found.timeStart && found.timeEnd) {
    let currentTime: string;
    if (targetTimeSlot) {
      currentTime = targetTimeSlot.split(/[–-]/)[0].trim();
    } else {
      const currentHours = String(refDate.getHours()).padStart(2, "0");
      const currentMins = String(refDate.getMinutes()).padStart(2, "0");
      currentTime = `${currentHours}:${currentMins}`;
    }
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
// CAFÉ ORDERS & REAL INVENTORY SYNC — Read/Write
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

export const DEFAULT_CAFE_ORDERS: CafeOrder[] = [];

export function getCafeOrders(): CafeOrder[] {
  const orders = safeGet<CafeOrder[]>(KEYS.cafeOrders, DEFAULT_CAFE_ORDERS);
  const sanitized = orders.filter(
    (o) => !["CF-8821", "CF-8819", "CF-8815", "CF-8810", "CF-8805", "CF-8798"].includes(o.id)
  );
  if (sanitized.length !== orders.length && typeof window !== "undefined") {
    try {
      localStorage.setItem(KEYS.cafeOrders, JSON.stringify(sanitized));
    } catch {}
  }
  return sanitized;
}

export function createCafeOrder(input: Omit<CafeOrder, "id" | "createdAt"> & { id?: string }) {
  const id = input.id || `CF-${Math.floor(1000 + Math.random() * 9000)}`;
  const order: CafeOrder = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  };

  // 1. Tự động khấu trừ tồn kho sản phẩm
  const currentMenu = getCafeMenu();
  let menuUpdated = false;
  const updatedMenu = currentMenu.map((menuItem) => {
    const matched = input.items.find(
      (it) => it.id === menuItem.id || it.name.toLowerCase() === menuItem.name.toLowerCase()
    );
    if (matched) {
      menuUpdated = true;
      const qty = matched.quantity || 1;
      return {
        ...menuItem,
        stock: Math.max(0, menuItem.stock - qty),
      };
    }
    return menuItem;
  });

  if (menuUpdated) {
    saveCafeMenu(updatedMenu);
  }

  // 2. Lưu đơn hàng
  const existing = getCafeOrders();
  safeSet(KEYS.cafeOrders, [order, ...existing]);
  emit("sachplus:cafe-order-created", order);
  return order;
}
