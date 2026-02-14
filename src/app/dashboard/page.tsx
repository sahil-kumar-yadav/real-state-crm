import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import StatCard from "@/components/dashboard/StatCard";
import {
    FiArrowUpRight as ArrowUpRight,
    FiHome as Home,
    FiUsers as Users,
    FiDollarSign as DollarSign,
    FiCheckCircle as CheckCircle,
} from "react-icons/fi";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/auth/login");
    }

    const isAdmin = user.role === "ADMIN";

    let stats = {
        properties: 0,
        activeLeads: 0,
        visitsScheduled: 0,
        revenue: 0,
    };

    let dbAvailable = true;

    try {
        if (isAdmin) {
            const [properties, activeLeads, visitsCount, revenueAggregate] =
                await Promise.all([
                    prisma.property.count({
                        where: { status: "AVAILABLE" },
                    }),
                    prisma.lead.count({
                        where: { status: "INTERESTED" },
                    }),
                    prisma.propertyVisit.count({
                        where: { status: "SCHEDULED" },
                    }),
                    prisma.commission.aggregate({
                        where: { status: "PENDING" },
                        _sum: { commissionAmount: true },
                    }),
                ]);

            stats = {
                properties,
                activeLeads,
                visitsScheduled: visitsCount,
                revenue: revenueAggregate._sum.commissionAmount ?? 0,
            };
        } else {
            const [properties, activeLeads, visitsCount, revenueAggregate] =
                await Promise.all([
                    prisma.property.count({
                        where: {
                            agentId: user.id,
                            status: "AVAILABLE",
                        },
                    }),
                    prisma.lead.count({
                        where: {
                            assignedAgentId: user.id,
                            status: "INTERESTED",
                        },
                    }),
                    prisma.propertyVisit.count({
                        where: {
                            assignedAgentId: user.id,
                            status: "SCHEDULED",
                        },
                    }),
                    prisma.commission.aggregate({
                        where: {
                            agentId: user.id,
                            status: "PENDING",
                        },
                        _sum: { commissionAmount: true },
                    }),
                ]);

            stats = {
                properties,
                activeLeads,
                visitsScheduled: visitsCount,
                revenue: revenueAggregate._sum.commissionAmount ?? 0,
            };
        }
    } catch (error: any) {
        // Database not available - use mock data
        console.warn("Database not available, using mock stats");
        dbAvailable = false;
        stats = {
            properties: Math.floor(Math.random() * 50) + 10,
            activeLeads: Math.floor(Math.random() * 30) + 5,
            visitsScheduled: Math.floor(Math.random() * 20) + 3,
            revenue: Math.floor(Math.random() * 100000) + 50000,
        };
    }

    return (
        <div className="space-y-8">
            {/* Database Warning Banner */}
            {!dbAvailable && (
                <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 border border-amber-200/50 shadow-lg shadow-amber-200/20 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-2xl">⚠️</div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-amber-900">
                                Database Not Connected
                            </p>
                            <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                                Displaying mock data. To connect a real database, configure your DATABASE_URL in .env.local
                            </p>
                            <p className="text-xs text-amber-700 mt-3 font-semibold">
                                <strong>Quick Setup:</strong> Use{" "}
                                <a
                                    href="https://supabase.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-amber-900 font-bold"
                                >
                                    Supabase
                                </a>{" "}
                                (free PostgreSQL) or your local PostgreSQL instance
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            <div className="space-y-2">
                <div>
                    <h1 className="text-4xl font-bold text-gradient">
                        Welcome back, {user.firstName}! 👋
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 font-medium">
                        Here's your real estate business overview for today
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Available Properties"
                    value={stats.properties}
                    icon={<Home className="h-7 w-7" />}
                    color="blue"
                    trend="+12%"
                />
                <StatCard
                    title="Active Leads"
                    value={stats.activeLeads}
                    icon={<Users className="h-7 w-7" />}
                    color="green"
                    trend="+8%"
                />
                <StatCard
                    title="Scheduled Visits"
                    value={stats.visitsScheduled}
                    icon={<CheckCircle className="h-7 w-7" />}
                    color="purple"
                    trend="+5%"
                />
                <StatCard
                    title="Pending Revenue"
                    value={formatCurrency(stats.revenue)}
                    icon={<DollarSign className="h-7 w-7" />}
                    color="amber"
                    trend="+23%"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Leads */}
                <div className="card-gradient">
                    <div className="flex-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                📋 Recent Leads
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Latest updates from your pipeline</p>
                        </div>
                        <Link
                            href="/dashboard/leads"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all hover:shadow-lg"
                        >
                            View all
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500 italic">
                            📊 Loading recent leads...
                        </p>
                    </div>
                </div>

                {/* Upcoming Visits */}
                <div className="card-gradient">
                    <div className="flex-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                🗓️ Upcoming Visits
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Your scheduled property tours</p>
                        </div>
                        <Link
                            href="/dashboard/visits"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all hover:shadow-lg"
                        >
                            View all
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500 italic">
                            📊 Loading upcoming visits...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
