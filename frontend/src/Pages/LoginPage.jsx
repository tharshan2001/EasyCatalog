import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import useAuthStore from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.password);
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-sm border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-sky-500/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="text-sky-500 w-6 h-6" />
          </div>
          <h2 className="text-3xl font-serif text-sky-900">Admin Portal</h2>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-2.5 border border-slate-100 rounded-sm focus:ring-0 focus:border-sky-400 bg-slate-50/50 text-slate-900 placeholder-slate-300 transition-all outline-none text-sm"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-11 pr-12 py-2.5 border border-slate-100 rounded-sm focus:ring-0 focus:border-sky-400 bg-slate-50/50 text-slate-900 placeholder-slate-300 transition-all outline-none text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-sky-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[10px] italic text-center uppercase tracking-tighter">
              {error}
            </div>
          )}

          {/* Minimal Button Implementation */}
          <div className="flex justify-center pt-10">
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center px-8 py-2.5 border border-sky-200 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm text-sky-600 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && (
                <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 flex flex-col items-center">
            <div className="h-px w-8 bg-slate-100 mb-4"></div>
            <p className="text-[9px] text-slate-300 uppercase tracking-[0.4em] font-medium text-center">
              Secure Cloud Access
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;