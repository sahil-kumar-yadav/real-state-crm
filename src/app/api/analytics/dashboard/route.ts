import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        errorResponse("Only admins can access analytics", 403),
        { status: 403 }
      );
    }

    // Fetch dashboard statistics
    const [
      totalProperties,
      availableProperties,
      activeLeads,
      closedLeads,
      totalVisits,
      completedVisits,
      pendingCommissions,
      paidCommissions,
      agents,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "AVAILABLE" } }),
      prisma.lead.count({ where: { status: "INTERESTED" } }),
      prisma.lead.count({ where: { status: "CLOSED_WON" } }),
      prisma.propertyVisit.count(),
      prisma.propertyVisit.count({ where: { status: "COMPLETED" } }),
      prisma.commission.findMany({ where: { status: "PENDING" } }),
      prisma.commission.findMany({ where: { status: "PAID" } }),
      prisma.user.findMany({
        where: { role: "AGENT" },
        include: {
          agentDetails: true,
          agentProperties: { select: { id: true } },
          agentLeads: { select: { id: true } },
          agentCommissions: {
            where: { status: "PAID" },
            select: { commissionAmount: true },
          },
        },
      }),
    ]);

    const pendingCommissionAmount = pendingCommissions.reduce(
      (sum: number, c: any) => sum + (c.commissionAmount ?? 0),
      0
    );
    const paidCommissionAmount = paidCommissions.reduce(
      (sum: number, c: any) => sum + (c.commissionAmount ?? 0),
      0
    );

    // Calculate agent performance
    const agentPerformance = agents.map((agent: any) => ({
      id: agent.id,
      name: `${agent.firstName} ${agent.lastName}`,
      properties: agent.agentProperties.length,
      leads: agent.agentLeads.length,
      commissionEarned: agent.agentCommissions.reduce(
        (sum: number, c: any) => sum + (c.commissionAmount ?? 0),
        0
      ),
      status: agent.agentDetails?.status || "INACTIVE",
    }));

    const analytics = {
      overview: {
        totalProperties,
        availableProperties,
        activeLeads,
        closedLeads,
        conversionRate:
          closedLeads > 0 ? ((closedLeads / (closedLeads + activeLeads)) * 100).toFixed(2) : "0.00",
      },
      visits: {
        total: totalVisits,
        completed: completedVisits,
        pending: totalVisits - completedVisits,
        completionRate:
          totalVisits > 0 ? ((completedVisits / totalVisits) * 100).toFixed(2) : "0.00",
      },
      commissions: {
        pending: {
          count: pendingCommissions.length,
          amount: pendingCommissionAmount,
        },
        paid: {
          count: paidCommissions.length,
          amount: paidCommissionAmount,
        },
        total: {
          count: pendingCommissions.length + paidCommissions.length,
          amount: pendingCommissionAmount + paidCommissionAmount,
        },
      },
      agents: {
        total: agents.length,
        performance: agentPerformance,
      },
    };

    return NextResponse.json(
      successResponse(analytics, "Analytics retrieved successfully")
    );
  } catch (error) {
    console.error("Analytics error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch analytics";
    
    // If database connection error, return 503 Service Unavailable
    if (
      message.includes("connect") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND") ||
      message.includes("Connection refused")
    ) {
      return NextResponse.json(
        errorResponse("Database connection unavailable. Using fallback data.", 503),
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      errorResponse("Failed to fetch analytics", 500),
      { status: 500 }
    );
  }
}