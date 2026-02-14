"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [backdoorLoading, setBackdoorLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdoorLogin = async (role: "ADMIN" | "AGENT" | "CLIENT") => {
    setBackdoorLoading(true);

    try {
      const response = await fetch("/api/auth/backdoor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Backdoor login failed");
      } else {
        toast.success(`Logged in as ${role}!`);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setBackdoorLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex-center mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 mx-auto shadow-xl shadow-blue-500/50">
            <span className="text-3xl font-bold text-white">RE</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">RealCRM</h1>
          <p className="text-blue-100 font-medium">Professional Property Management</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-base w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-base w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-semibold rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-6">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Create one now
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 border border-blue-200/50">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">📝 Demo Credentials</p>
            <div className="space-y-2 text-xs text-blue-800">
              <p><span className="font-semibold">Admin:</span> admin@recrm.com / password123</p>
              <p><span className="font-semibold">Agent:</span> agent1@recrm.com / password123</p>
            </div>
          </div>

          {/* Backdoor (Development Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-200/50">
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                🔓 <span>Quick Login (Dev Only)</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleBackdoorLogin("ADMIN")}
                  disabled={backdoorLoading}
                  className="text-xs font-semibold bg-gradient-to-br from-amber-500 to-orange-600 text-white px-3 py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {backdoorLoading ? "..." : "Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => handleBackdoorLogin("AGENT")}
                  disabled={backdoorLoading}
                  className="text-xs font-semibold bg-gradient-to-br from-amber-500 to-orange-600 text-white px-3 py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {backdoorLoading ? "..." : "Agent"}
                </button>
                <button
                  type="button"
                  onClick={() => handleBackdoorLogin("CLIENT")}
                  disabled={backdoorLoading}
                  className="text-xs font-semibold bg-gradient-to-br from-amber-500 to-orange-600 text-white px-3 py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {backdoorLoading ? "..." : "Client"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-xs mt-8">
          © 2026 RealCRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}