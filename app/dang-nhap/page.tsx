"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/sachplus/site-header";
import { SiteFooter } from "@/components/sachplus/site-footer";
import { LogoMark } from "@/components/sachplus/logo";
import {
  getCurrentUser,
  loginUser,
} from "@/lib/sachplus-auth";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldAlert,
} from "lucide-react";

function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [redirectPath, setRedirectPath] = useState("");
  const [requiredRole, setRequiredRole] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const red = params.get("redirect") || "";
    const role = params.get("role") || "";
    setRedirectPath(red);
    setRequiredRole(role);

    // If user is already logged in with matching required role
    const current = getCurrentUser();
    if (current && red && (role ? current.role === role : true)) {
      window.location.href = red;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error("Vui lòng nhập đầy đủ Email/Số điện thoại và mật khẩu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginUser(identifier, password);
      setLoading(false);

      if (res.success && res.user) {
        toast.success(res.message);

        // Redirect based on role or URL param
        if (redirectPath) {
          window.location.href = redirectPath;
        } else if (res.user.role === "admin") {
          window.location.href = "/admin";
        } else if (res.user.role === "staff") {
          window.location.href = "/quay/quan-ly-don";
        } else {
          window.location.href = "/don-cua-toi";
        }
      } else {
        toast.error(res.message);
      }
    }, 250);
  };

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Notice if redirected due to role restriction */}
      {requiredRole && (
        <div className="mb-5 p-3.5 bg-[#F0F9FF] border border-[#0284C7]/30 rounded-lg flex items-start gap-3 text-[#0369A1]">
          <ShieldAlert className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="block font-bold">Yêu cầu quyền truy cập</strong>
            <span>
              Phân hệ này yêu cầu tài khoản vai trò{" "}
              <b>{requiredRole === "admin" ? "Quản trị viên (Admin)" : "Nhân viên ca trực (Staff)"}</b>.
              Vui lòng đăng nhập với tài khoản tương ứng.
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200/90 shadow-xl shadow-stone-900/5 overflow-hidden">
        {/* Header */}
        <div className="pt-8 pb-6 px-6 md:px-8 text-center border-b border-stone-100">
          <LogoMark size={52} className="mx-auto mb-3 shadow-md" />
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Đăng Nhập Sạch+
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Smart Laundry & Coffee · Shophouse SH-08 Vinhomes Sài Gòn Park
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5">
              Email hoặc Số điện thoại
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@domain.com hoặc Số điện thoại"
                required
                className="w-full pl-10 pr-3.5 py-3 text-sm bg-stone-50/80 border border-stone-200 rounded-md text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => toast.info("Vui lòng liên hệ ban quản lý Shophouse SH-08 hoặc hotline 0908.889.999 để cấp lại mật khẩu.")}
                className="text-[11px] text-stone-500 hover:text-[#0284C7] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn..."
                required
                className="w-full pl-10 pr-10 py-3 text-sm bg-stone-50/80  border border-stone-200  rounded-md text-stone-900 focus:bg-white  focus:outline-none focus:ring-2 focus:ring-[#0284C7] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0284C7] cursor-pointer"
              />
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#0369A1] text-white font-bold rounded-md text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <LogIn size={16} /> {loading ? "Đang xác thực..." : "Đăng nhập ngay"}
          </button>

          <div className="pt-4 border-t border-stone-100  text-center">
            <p className="text-xs text-stone-500">
              Chưa có tài khoản cư dân?{" "}
              <Link href="/dang-ky" className="font-bold text-[#0284C7] hover:underline">
                Đăng ký tài khoản mới →
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-stone-50/80 ">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Suspense fallback={<div className="text-center py-10 text-stone-400">Đang tải trang đăng nhập...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <SiteFooter />
    </main>
  );
}
