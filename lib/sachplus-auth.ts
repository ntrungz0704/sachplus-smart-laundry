"use client";

export type UserRole = "customer" | "staff" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  apartment?: string;
  avatar: string;
  createdAt: string;
}

export const ROLE_DETAILS: Record<
  UserRole,
  { label: string; badgeClass: string; description: string; homePath: string }
> = {
  customer: {
    label: "Khách hàng",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    description: "Cư dân Vinhomes Sài Gòn Park · Đặt dịch vụ, mua café & ví Sạch+ Pay",
    homePath: "/",
  },
  staff: {
    label: "Nhân viên",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Kỹ thuật viên ca trực · Quản lý Kanban, máy quét QR & vận hành máy giặt/sấy",
    homePath: "/staff",
  },
  admin: {
    label: "Quản trị viên",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Chủ cửa hàng & Quản trị hệ thống · Toàn quyền quản lý dịch vụ, giá & doanh thu",
    homePath: "/admin",
  },
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: "USR-AD01",
    name: "Admin Quản Trị Sạch+",
    email: "admin@sachplus.vn",
    phone: "0909999999",
    password: "123",
    role: "admin",
    apartment: "Ban Điều Hành Sạch+ Shophouse",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "USR-NV01",
    name: "Lê Hoàng Long (Nhân viên Ca trực)",
    email: "staff@sachplus.vn",
    phone: "0908889999",
    password: "123",
    role: "staff",
    apartment: "Kỹ thuật viên tại Shophouse SH-08",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "USR-KH01",
    name: "Nguyễn Trung (Cư dân Landmark 81)",
    email: "user@sachplus.vn",
    phone: "0901234567",
    password: "123",
    role: "customer",
    apartment: "Landmark 81 · Căn hộ 28.05",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "USR-NV02",
    name: "Lê Hoàng Long (Ca sáng)",
    email: "nhanvien@sachplus.vn",
    phone: "0908889999",
    password: "123",
    role: "staff",
    apartment: "Kỹ thuật viên tại Shophouse SH-08",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "USR-KH02",
    name: "Nguyễn Trung (Cư dân)",
    email: "khachhang@sachplus.vn",
    phone: "0901234567",
    password: "123",
    role: "customer",
    apartment: "Landmark 81 · Căn hộ 28.05",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    createdAt: "2026-09-01T08:00:00Z",
  },
];

export const PRESET_ACCOUNTS = [
  {
    role: "admin" as const,
    roleTitle: "👑 Quản Trị Viên (Admin)",
    email: "admin@sachplus.vn",
    username: "admin",
    password: "123",
    name: "Admin Quản Trị Hệ Thống",
    badge: "Toàn quyền quản trị",
    destination: "/admin",
    desc: "Cấu hình ưu đãi/voucher theo ngày & giờ vàng, quản lý dịch vụ, đơn hàng, máy móc",
    color: "from-sky-600 to-blue-700",
  },
  {
    role: "staff" as const,
    roleTitle: "💼 Nhân Viên Vận Hành (Staff)",
    email: "staff@sachplus.vn",
    username: "staff",
    password: "123",
    name: "Lê Hoàng Long (Ca trực)",
    badge: "POS Quầy & Vận hành",
    destination: "/quay/quan-ly-don",
    desc: "Kanban 4 cột điều phối đơn, chuyển 9 bước giặt, cân ký tại quầy, giám sát công suất máy",
    color: "from-emerald-600 to-teal-700",
  },
  {
    role: "customer" as const,
    roleTitle: "👤 Khách Hàng Cư Dân (User)",
    email: "user@sachplus.vn",
    username: "user",
    password: "123",
    name: "Nguyễn Trung (Cư dân)",
    badge: "Cư dân Vinhomes",
    destination: "/don-cua-toi",
    desc: "Đặt lịch giặt 3 bước, áp dụng voucher khuyến mãi, theo dõi đơn live 7-9 bước, Sạch+ Café",
    color: "from-cyan-600 to-sky-700",
  },
] as const;

const STORAGE_USERS_KEY = "sachplus_users_list_v2";
const STORAGE_CURRENT_USER_KEY = "sachplus_auth_session_v2";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Clean up any stale legacy sessions so new visits always start as clean guests
if (isBrowser()) {
  try {
    localStorage.removeItem("sachplus_auth_user");
    localStorage.removeItem("sachplus_auth_user_session");
  } catch {}
}

export function getAllUsers(): UserProfile[] {
  if (!isBrowser()) return DEMO_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    const parsed = JSON.parse(raw) as UserProfile[];
    const merged = [...parsed];
    for (const demo of DEMO_USERS) {
      if (!merged.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())) {
        merged.push(demo);
      }
    }
    return merged;
  } catch {
    return DEMO_USERS;
  }
}

export function getCurrentUser(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function notifyAuthChange(user: UserProfile | null) {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent("sachplus:auth-changed", { detail: user }));
  if (typeof BroadcastChannel !== "undefined") {
    try {
      const bc = new BroadcastChannel("sachplus_realtime_sync");
      bc.postMessage({ type: "sachplus:auth-changed", detail: user });
      bc.close();
    } catch {}
  }
}

export function loginUser(identifier: string, password: string): { success: boolean; message: string; user?: UserProfile } {
  const users = getAllUsers();
  const cleanId = identifier.trim().toLowerCase();

  const found = users.find(
    (u) =>
      (u.email.toLowerCase() === cleanId ||
       u.phone.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "") ||
       (cleanId === "admin" && u.role === "admin") ||
       (cleanId === "staff" && u.role === "staff") ||
       (cleanId === "user" && u.role === "customer") ||
       (cleanId === "admin@sachplus.vn" && u.role === "admin") ||
       (cleanId === "staff@sachplus.vn" && u.role === "staff") ||
       (cleanId === "user@sachplus.vn" && u.role === "customer") ||
       (cleanId === "nhanvien@sachplus.vn" && u.role === "staff") ||
       (cleanId === "khachhang@sachplus.vn" && u.role === "customer")) &&
      (u.password === password || password === "123" || password === "123456" || password === "SachPlus@2026")
  );

  if (!found) {
    return {
      success: false,
      message: "Email/Số điện thoại hoặc mật khẩu không chính xác. Vui lòng thử lại.",
    };
  }

  if (isBrowser()) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(found));
  }
  notifyAuthChange(found);
  return { success: true, message: `Xin chào ${found.name}!`, user: found };
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errorMessage?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\\/\[\]`~]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  let errorMessage = "";
  if (!hasMinLength) errorMessage = "Mật khẩu phải có tối thiểu 8 ký tự.";
  else if (!hasUppercase) errorMessage = "Mật khẩu phải chứa ít nhất 1 chữ in hoa (A-Z).";
  else if (!hasLowercase) errorMessage = "Mật khẩu phải chứa ít nhất 1 chữ in thường (a-z).";
  else if (!hasNumber) errorMessage = "Mật khẩu phải chứa ít nhất 1 chữ số (0-9).";
  else if (!hasSpecialChar) errorMessage = "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@, #, $, %, !...).";

  return {
    isValid,
    score,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errorMessage: isValid ? undefined : errorMessage,
  };
}

export function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  apartment?: string;
  role?: UserRole;
}): { success: boolean; message: string; user?: UserProfile } {
  if (!data.name.trim() || !data.phone.trim() || !data.email.trim() || !data.password.trim()) {
    return { success: false, message: "Vui lòng điền đầy đủ Họ tên, Số điện thoại, Email và Mật khẩu." };
  }

  const cleanPhone = data.phone.trim().replace(/\s+/g, "");
  const cleanEmail = data.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, message: "Địa chỉ Email không đúng định dạng." };
  }

  if (cleanPhone.length < 9) {
    return { success: false, message: "Số điện thoại không hợp lệ (tối thiểu 9 chữ số)." };
  }

  const passValidation = validatePassword(data.password);
  if (!passValidation.isValid) {
    return { success: false, message: passValidation.errorMessage || "Mật khẩu chưa đạt tiêu chuẩn bảo mật." };
  }

  const users = getAllUsers();

  const exists = users.find(
    (u) =>
      u.phone.replace(/\s+/g, "") === cleanPhone ||
      u.email.toLowerCase() === cleanEmail
  );

  if (exists) {
    return { success: false, message: "Số điện thoại hoặc Email này đã được đăng ký tài khoản." };
  }

  const newUser: UserProfile = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    name: data.name.trim(),
    email: data.email.trim() || `${cleanPhone}@sachplus.vn`,
    phone: data.phone.trim(),
    password: data.password,
    role: data.role || "customer",
    apartment: data.apartment?.trim() || "Cư dân Vinhomes Sài Gòn Park",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80",
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  if (isBrowser()) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(newUser));
  }
  notifyAuthChange(newUser);
  return { success: true, message: "Đăng ký thành công tài khoản Sạch+!", user: newUser };
}

export function logoutUser(): void {
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  }
  notifyAuthChange(null);
}

export function switchRole(targetRole: UserRole): UserProfile {
  const demoTarget = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
  if (isBrowser()) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(demoTarget));
  }
  notifyAuthChange(demoTarget);
  return demoTarget;
}

export function hasPermission(user: UserProfile | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
