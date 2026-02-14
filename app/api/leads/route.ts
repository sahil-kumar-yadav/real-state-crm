import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { errorResponse, successResponse, paginatedResponse } from "@/lib/api-response";

// GET - Fetch all leads
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
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const source = searchParams.get("source");

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by assigned agent if not admin
    if (session.user.role !== "ADMIN") {
      where.assignedAgentId = session.user.id;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedAgent: { select: { id: true, firstName: true, lastName: true } },
          interestedProperty: {
            select: { id: true, title: true, type: true, price: true },
          },
          activities: { take: 1, orderBy: { createdAt: "desc" } },
          propertyVisits: { take: 1, orderBy: { scheduledAt: "desc" } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json(
      paginatedResponse(leads, total, page, limit, "Leads fetched successfully")
    );
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch leads", 500),
      { status: 500 }
    );
  }
}

// POST - Create a new lead
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
    const validatedData = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        assignedAgentId: session.user.role === "ADMIN" ? undefined : session.user.id,
      },
      include: {
        assignedAgent: { select: { id: true, firstName: true, lastName: true } },
        interestedProperty: true,
      },
    });

    return NextResponse.json(
      successResponse(lead, "Lead created successfully", 201),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create lead error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        errorResponse(error.errors[0].message, 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse("Failed to create lead", 500),
      { status: 500 }
    );
  }
}
