"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  DEMO_USERS,
  loginUser,
  registerUser,
  switchRole,
  type UserProfile,
  type UserRole,
  ROLE_DETAILS,
} from "@/lib/sachplus-auth";
import { KeyRound, Lock, LogIn, Mail, Phone, Shield, ShieldCheck, Sparkles, User, UserPlus, Eye, EyeOff, Building } from "lucide-react";

export function AuthDialog({
  children,
  defaultTab = "login",
  onSuccess,
}: {
  children?: React.ReactNode;
  defaultTab?: "login" | "register";
  onSuccess?: (user: UserProfile) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  // Login form state
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regApartment, setRegApartment] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("customer");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPassword.trim()) {
      toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    const res = loginUser(loginId, loginPassword);
    if (res.success && res.user) {
      toast.success(res.message);
      setOpen(false);
      onSuccess?.(res.user);
    } else {
      toast.error(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = registerUser({
      name: regName,
      phone: regPhone,
      email: regEmail,
      apartment: regApartment,
      password: regPassword,
      role: regRole,
    });

    if (res.success && res.user) {
      toast.success(res.message);
      setOpen(false);
      onSuccess?.(res.user);
    } else {
      toast.error(res.message);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = switchRole(role);
    toast.success(`Đã chuyển sang tài khoản: ${user.name} (${ROLE_DETAILS[role].label})`);
    setOpen(false);
    onSuccess?.(user);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white rounded-md border border-stone-200 shadow-2xl">
        {/* Header bar */}
        <div className="bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white p-6 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-md bg-[#0284C7]/20 border border-[#0284C7]/40/40 text-[#0284C7] font-bold flex items-center justify-center text-sm">
              S+
            </span>
            <span className="text-xs tracking-wider uppercase font-semibold text-[#E0F2FE]">
              Sạch+ Vinhomes Sài Gòn Park
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white">
            Hệ Thống Xác Thực & Phân Quyền
          </DialogTitle>
          <DialogDescription className="text-[#E0F2FE]/90 text-xs mt-1">
            Đăng nhập để đặt lịch giặt, quản lý ca trực hoặc giám sát hoạt động shophouse.
          </DialogDescription>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="bg-stone-50 border-b border-stone-200 px-6 py-3.5">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#F59E0B]" /> Đăng nhập nhanh 1-chạm (3 Role):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("customer")}
              className="px-2.5 py-2 bg-white hover:bg-[#E0F2FE] border border-stone-200 hover:border-[#0284C7]/30 rounded-md text-left transition shadow-xs flex flex-col group"
            >
              <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1">
                <User size={13} className="text-[#0284C7]" /> Khách hàng
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">Cư dân đặt lịch</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("staff")}
              className="px-2.5 py-2 bg-white hover:bg-[#E0F2FE] border border-stone-200 hover:border-[#0284C7]/30 rounded-md text-left transition shadow-xs flex flex-col group"
            >
              <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#0284C7]" /> Nhân viên
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">Vận hành máy</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="px-2.5 py-2 bg-white hover:bg-[#F0F9FF] border border-stone-200 hover:border-[#0284C7]/40 rounded-md text-left transition shadow-xs flex flex-col group"
            >
              <span className="text-xs font-bold text-[#0369A1] flex items-center gap-1">
                <Shield size={13} className="text-[#0369A1]" /> Quản trị
              </span>
              <span className="text-[10px] text-stone-500 mt-0.5 leading-tight">Toàn quyền hệ thống</span>
            </button>
          </div>
        </div>

        {/* Tabs: Đăng nhập & Đăng ký */}
        <div className="p-6 pt-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 bg-stone-100 p-1 rounded-md mb-5">
              <TabsTrigger
                value="login"
                className="rounded-md text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#0284C7] data-[state=active]:shadow-sm"
              >
                <LogIn size={14} className="inline mr-1.5" /> Đăng nhập
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#0284C7] data-[state=active]:shadow-sm"
              >
                <UserPlus size={14} className="inline mr-1.5" /> Đăng ký tài khoản
              </TabsTrigger>
            </TabsList>

            {/* TAB ĐĂNG NHẬP */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Email hoặc Số điện thoại
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="VD: khachhang@sachplus.vn hoặc 0901234567"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-stone-700">Mật khẩu</label>
                    <span className="text-[11px] text-[#0284C7] hover:underline cursor-pointer">
                      Mật khẩu demo: 123
                    </span>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn size={16} /> Đăng nhập Sạch+
                </button>
              </form>
            </TabsContent>

            {/* TAB ĐĂNG KÝ */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Họ và tên *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="VD: Nguyễn Thành Trung"
                      required
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Số điện thoại *</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="090..."
                        required
                        className="w-full pl-9 pr-2.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ten@email.com"
                        className="w-full pl-9 pr-2.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Căn hộ / Địa chỉ tại Vinhomes
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={regApartment}
                      onChange={(e) => setRegApartment(e.target.value)}
                      placeholder="VD: Landmark 81 · P.2805 hoặc Shophouse SH-08"
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Vai trò tài khoản</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
                  >
                    <option value="customer">👤 Khách hàng (Cư dân sử dụng dịch vụ)</option>
                    <option value="staff">👷 Nhân viên (Vận hành & kỹ thuật)</option>
                    <option value="admin">🛡️ Quản trị viên (Chủ tiệm & Quản lý)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mật khẩu khởi tạo *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 3 ký tự..."
                      required
                      className="w-full pl-10 pr-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0284C7] hover:bg-[#0284C7] text-white font-bold rounded-md text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <UserPlus size={16} /> Hoàn tất đăng ký & Đăng nhập
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
