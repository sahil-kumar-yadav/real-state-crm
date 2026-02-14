import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, paginatedResponse } from "@/lib/api-response";
import { calculateCommission } from "@/lib/utils";

// GET - Fetch all commissions
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const agentId = searchParams.get("agentId");

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by agent if not admin
    if (user.role !== "ADMIN") {
      where.agentId = user.id;
    } else if (agentId) {
      where.agentId = agentId;
    }

    if (status) {
      where.status = status;
    }

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          agent: { select: { id: true, firstName: true, lastName: true } },
          property: { select: { id: true, title: true, price: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.commission.count({ where }),
    ]);

    return NextResponse.json(
      paginatedResponse(
        commissions,
        total,
        page,
        limit,
        "Commissions fetched successfully"
      )
    );
  } catch (error) {
    console.error("Get commissions error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch commissions";
    
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
      errorResponse("Failed to fetch commissions", 500),
      { status: 500 }
    );
  }
}

// POST - Create a new commission
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthFromRequest(request);
    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        errorResponse("Only admins can create commissions", 403),
        { status: 403 }
      );
    }

    const body = await request.json();
    const { agentId, propertyId, percentage } = body;

    if (!agentId || !propertyId || !percentage) {
      return NextResponse.json(
        errorResponse("Missing required fields", 400),
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        errorResponse("Property not found", 404),
        { status: 404 }
      );
    }

    // Calculate commission
    const commissionAmount = calculateCommission(property.price, percentage);

    const commission = await prisma.commission.create({
      data: {
        agentId,
        propertyId,
        percentage,
        propertyPrice: property.price,
        commissionAmount,
      },
      include: {
        agent: { select: { id: true, firstName: true, lastName: true } },
        property: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(
      successResponse(commission, "Commission created successfully", 201),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create commission error:", error);
    return NextResponse.json(
      errorResponse("Failed to create commission", 500),
      { status: 500 }
    );
  }
}