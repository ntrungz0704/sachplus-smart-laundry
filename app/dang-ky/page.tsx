"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { LogoMark } from "@/components/sachplus/logo";
import { registerUser, validatePassword } from "@/lib/sachplus-auth";
import { toast } from "sonner";
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [apartment, setApartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passValidation = validatePassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ Họ tên, Số điện thoại, Email và Mật khẩu.");
      return;
    }

    if (!passValidation.isValid) {
      toast.error(passValidation.errorMessage || "Mật khẩu chưa đáp ứng tiêu chuẩn bảo mật.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp. Vui lòng nhập lại.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerUser({
        name,
        phone,
        email,
        apartment,
        password,
        role: "customer",
      });
      setLoading(false);

      if (res.success) {
        toast.success("Đăng ký tài khoản thành công!");
        window.location.href = "/dat-lich";
      } else {
        toast.error(res.message);
      }
    }, 250);
  };

  return (
    <main className="min-h-screen flex flex-col bg-stone-50/80 ">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-lg mx-auto w-full">
          <div className="bg-white  rounded-md border border-stone-200/90  shadow-xl shadow-stone-900/5 overflow-hidden">
            {/* Header */}
            <div className="pt-8 pb-6 px-6 md:px-8 text-center border-b border-stone-100 ">
              <LogoMark size={54} className="mx-auto mb-3 shadow-md" />
              <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
                Đăng Ký Tài Khoản Cư Dân
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Đặc quyền giao nhận đồ tận nơi & giảm 10% Café tại Vinhomes Sài Gòn Park
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Họ và tên <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Thành Trung"
                    required
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Số điện thoại <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0901 234 567"
                    required
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Địa chỉ Email <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: nguyenthanhtrung@gmail.com"
                    required
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Căn hộ / Tòa nhà tại Vinhomes
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="VD: Tòa S2.05 · Căn hộ 12A08 hoặc Landmark 81"
                    className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    Mật khẩu <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu bảo mật..."
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">
                    Xác nhận mật khẩu <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu..."
                      required
                      className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Password Strength Meter & Security Checklist */}
              {password.length > 0 && (
                <div className="p-3.5 bg-[#E0F2FE]/60 border border-[#E2E8F0] rounded-md space-y-2.5 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1.5">
                      <ShieldCheck size={14} className={passValidation.isValid ? "text-[#0284C7]" : "text-[#0284C7]"} />
                      Độ an toàn mật khẩu:
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        passValidation.score <= 1
                          ? "text-[#DC2626]"
                          : passValidation.score === 2
                          ? "text-[#F59E0B]"
                          : passValidation.score === 3
                          ? "text-[#0284C7]"
                          : "text-[#0284C7]"
                      }`}
                    >
                      {passValidation.score <= 1
                        ? "Yếu"
                        : passValidation.score === 2
                        ? "Trung bình"
                        : passValidation.score === 3
                        ? "Khá"
                        : "Rất an toàn ✓"}
                    </span>
                  </div>

                  {/* 4-segment progress bar */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => {
                      const active = passValidation.score >= step;
                      let bg = "bg-stone-200";
                      if (active) {
                        if (passValidation.score <= 1) bg = "bg-[#DC2626]";
                        else if (passValidation.score === 2) bg = "bg-[#F59E0B]";
                        else if (passValidation.score === 3) bg = "bg-[#0284C7]";
                        else bg = "bg-[#0284C7]";
                      }
                      return <div key={step} className={`h-1.5 rounded-full transition-all ${bg}`} />;
                    })}
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1 border-t border-[#E2E8F0]/60">
                    <div className={`flex items-center gap-1.5 ${passValidation.hasMinLength ? "text-[#0284C7] font-semibold" : "text-stone-400"}`}>
                      {passValidation.hasMinLength ? <Check size={12} className="text-[#0284C7] shrink-0" /> : <X size={12} className="shrink-0" />}
                      Tối thiểu 8 ký tự
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.hasUppercase ? "text-[#0284C7] font-semibold" : "text-stone-400"}`}>
                      {passValidation.hasUppercase ? <Check size={12} className="text-[#0284C7] shrink-0" /> : <X size={12} className="shrink-0" />}
                      Ít nhất 1 chữ in HOA (A-Z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.hasLowercase ? "text-[#0284C7] font-semibold" : "text-stone-400"}`}>
                      {passValidation.hasLowercase ? <Check size={12} className="text-[#0284C7] shrink-0" /> : <X size={12} className="shrink-0" />}
                      Ít nhất 1 chữ thường (a-z)
                    </div>
                    <div className={`flex items-center gap-1.5 ${passValidation.hasNumber ? "text-[#0284C7] font-semibold" : "text-stone-400"}`}>
                      {passValidation.hasNumber ? <Check size={12} className="text-[#0284C7] shrink-0" /> : <X size={12} className="shrink-0" />}
                      Ít nhất 1 chữ số (0-9)
                    </div>
                    <div className={`flex items-center gap-1.5 sm:col-span-2 ${passValidation.hasSpecialChar ? "text-[#0284C7] font-semibold" : "text-stone-400"}`}>
                      {passValidation.hasSpecialChar ? <Check size={12} className="text-[#0284C7] shrink-0" /> : <X size={12} className="shrink-0" />}
                      Ít nhất 1 ký tự đặc biệt (@, #, $, %, !, &amp;...)
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-[#E0F2FE]/70 rounded-md border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#0284C7]">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span>
                  Tài khoản đăng ký mặc định là <b>Cư dân Vinhomes</b>. Hưởng dịch vụ giặt sấy tiêu chuẩn tiệt trùng nhiệt và ưu đãi giảm 10% Café Lầu 1.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#0369A1] text-white font-bold rounded-md text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <UserPlus size={16} /> {loading ? "Đang xử lý..." : "Đăng ký tài khoản ngay"}
              </button>

              <div className="pt-4 border-t border-stone-100  text-center">
                <p className="text-xs text-stone-500">
                  Đã có tài khoản?{" "}
                  <Link href="/dang-nhap" className="font-bold text-[#0284C7] hover:underline">
                    Đăng nhập ngay →
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
