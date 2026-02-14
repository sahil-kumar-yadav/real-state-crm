import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import StatCard from "@/app/components/dashboard/StatCard";
import { ArrowUpRight, Home, Users, DollarSign, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  // Fetch statistics based on user role
  const isAdmin = session.user.role === "ADMIN";

  let stats = {
    properties: 0,
    activeLeads: 0,
    visitsScheduled: 0,
    revenue: 0,
  };

  if (isAdmin) {
    // Admin sees all statistics
    const [properties, activeLeads, visitData, commissionData] = await Promise.all([
      prisma.property.count({ where: { status: "AVAILABLE" } }),
      prisma.lead.count({ where: { status: "INTERESTED" } }),
      prisma.propertyVisit.findMany({
        where: { status: "SCHEDULED" },
        select: { id: true },
      }),
      prisma.commission.findMany({
        where: { status: "PENDING" },
        select: { commissionAmount: true },
      }),
    ]);

    const totalRevenue = commissionData.reduce(
      (sum, c) => sum + c.commissionAmount,
      0
    );

    stats = {
      properties,
      activeLeads,
      visitsScheduled: visitData.length,
      revenue: totalRevenue,
    };
  } else {
    // Agent sees their own statistics
    const [properties, activeLeads, visitData, commissionData] = await Promise.all([
      prisma.property.count({
        where: { agentId: session.user.id, status: "AVAILABLE" },
      }),
      prisma.lead.count({
        where: { assignedAgentId: session.user.id, status: "INTERESTED" },
      }),
      prisma.propertyVisit.findMany({
        where: {
          assignedAgentId: session.user.id,
          status: "SCHEDULED",
        },
        select: { id: true },
      }),
      prisma.commission.findMany({
        where: {
          agentId: session.user.id,
          status: "PENDING",
        },
        select: { commissionAmount: true },
      }),
    ]);

    const totalRevenue = commissionData.reduce(
      (sum, c) => sum + c.commissionAmount,
      0
    );

    stats = {
      properties,
      activeLeads,
      visitsScheduled: visitData.length,
      revenue: totalRevenue,
    };
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your real estate business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Available Properties"
          value={stats.properties}
          icon={<Home className="h-6 w-6" />}
          color="blue"
          trend={"+12%"}
        />
        <StatCard
          title="Active Leads"
          value={stats.activeLeads}
          icon={<Users className="h-6 w-6" />}
          color="green"
          trend={"+8%"}
        />
        <StatCard
          title="Scheduled Visits"
          value={stats.visitsScheduled}
          icon={<CheckCircle className="h-6 w-6" />}
          color="purple"
          trend={"+5%"}
        />
        <StatCard
          title="Pending Revenue"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign className="h-6 w-6" />}
          color="amber"
          trend={"+23%"}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div className="card">
          <div className="flex-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
            <a href="/dashboard/leads" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Loading recent leads...
            </p>
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="card">
          <div className="flex-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Visits</h2>
            <a href="/dashboard/visits" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Loading upcoming visits...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
