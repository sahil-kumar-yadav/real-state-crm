"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiMenu as Menu,
    FiX as X,
    FiHome as Home,
    FiServer as Building,
    FiUsers as Users,
    FiCalendar as Calendar,
    FiDollarSign as DollarSign,
    FiBarChart2 as BarChart3,
    FiLogOut as LogOut,
    FiSettings as Settings,
} from "react-icons/fi";
import type { JWTPayload } from "@/lib/auth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<JWTPayload | null>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    // Get current user from JWT
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await fetch("/api/auth/me");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user || null);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    const isAdmin = user?.role === "ADMIN";

    const menuItems = [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Properties", href: "/dashboard/properties", icon: Building },
        { label: "Leads", href: "/dashboard/leads", icon: Users },
        { label: "Visits", href: "/dashboard/visits", icon: Calendar },
        { label: "Commissions", href: "/dashboard/commissions", icon: DollarSign },
        ...(isAdmin
            ? [{ label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }]
            : []),
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                toast.success("Logged out successfully");
                router.push("/auth/login");
            } else {
                toast.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred");
        }
    };

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-screen">
                    {/* Header */}
                    <div className="flex-between px-6 py-6 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className="flex-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                                <span className="text-lg font-bold text-white">RE</span>
                            </div>
                            <div>
                                <span className="font-bold text-white text-lg">RealCRM</span>
                                <p className="text-xs text-blue-200">Property Management</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                            : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{item.label}</span>
                                    {active && <div className="ml-auto h-2 w-2 rounded-full bg-white"></div>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-slate-700/50 bg-slate-800/50 p-4 space-y-4">
                        <div className="rounded-lg bg-slate-700/30 p-4">
                            <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                                Account
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                                {loading ? "Loading..." : user?.firstName || "User"} {user?.lastName || ""}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                            <div className="mt-3 inline-block px-2 py-1 rounded bg-blue-600/30 text-xs font-semibold text-blue-200">
                                {user?.role || "AGENT"}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-200 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="border-b border-white/20 bg-white/70 backdrop-blur-sm shadow-sm">
                    <div className="flex-between px-6 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <Menu className="h-6 w-6 text-gray-700" />
                        </button>
                        <div className="flex-1"></div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50/50">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-semibold text-gray-700">Live</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};


export default DashboardLayout;

