import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertyVisitSchema } from "@/lib/validations";
import { errorResponse, successResponse, paginatedResponse } from "@/lib/api-response";

// GET - Fetch all property visits
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    // Filter by assigned agent if not admin
    if (session.user.role !== "ADMIN") {
      where.assignedAgentId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    if (agentId && session.user.role === "ADMIN") {
      where.assignedAgentId = agentId;
    }

    const [visits, total] = await Promise.all([
      prisma.propertyVisit.findMany({
        where,
        include: {
          lead: { select: { id: true, firstName: true, lastName: true, phone: true } },
          property: { select: { id: true, title: true, address: true } },
          assignedAgent: { select: { id: true, firstName: true, lastName: true } },
        },
        skip,
        take: limit,
        orderBy: { scheduledAt: "desc" },
      }),
      prisma.propertyVisit.count({ where }),
    ]);

    return NextResponse.json(
      paginatedResponse(visits, total, page, limit, "Visits fetched successfully")
    );
  } catch (error) {
    console.error("Get visits error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch visits", 500),
      { status: 500 }
    );
  }
}

// POST - Create a new property visit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = propertyVisitSchema.parse(body);

    // Verify lead and property exist
    const [lead, property] = await Promise.all([
      prisma.lead.findUnique({ where: { id: validatedData.leadId } }),
      prisma.property.findUnique({ where: { id: validatedData.propertyId } }),
    ]);

    if (!lead || !property) {
      return NextResponse.json(
        errorResponse("Lead or property not found", 404),
        { status: 404 }
      );
    }

    const visit = await prisma.propertyVisit.create({
      data: validatedData,
      include: {
        lead: { select: { id: true, firstName: true, lastName: true } },
        property: { select: { id: true, title: true } },
        assignedAgent: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(
      successResponse(visit, "Visit scheduled successfully", 201),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create visit error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        errorResponse(error.errors[0].message, 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse("Failed to schedule visit", 500),
      { status: 500 }
    );
  }
}