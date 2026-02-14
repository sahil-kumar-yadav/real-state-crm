"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || "Login failed");
      } else if (result?.ok) {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 text-center">
            <div className="flex-center mb-4 h-12 w-12 rounded-lg bg-blue-600 mx-auto">
              <span className="text-2xl font-bold text-white">RE</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Real Estate CRM</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input-base mt-1 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-base mt-1 w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-xs font-semibold text-gray-700">Demo Credentials:</p>
            <p className="mt-1 text-xs text-gray-600">
              <strong>Admin:</strong> admin@recrm.com / password123
            </p>
            <p className="text-xs text-gray-600">
              <strong>Agent:</strong> agent@recrm.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}