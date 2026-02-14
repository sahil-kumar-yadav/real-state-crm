import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";
import { errorResponse, successResponse, paginatedResponse } from "@/lib/api-response";
import { canAccessProperty } from "@/lib/utils";

// GET - Fetch all properties with filters
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
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const skip = (page - 1) * limit;

    // Build query
    const where: any = {};

    // Filter by agent if not admin
    if (user.role !== "ADMIN") {
      where.agentId = user.id;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: { select: { id: true, firstName: true, lastName: true } },
          images: true,
          _count: {
            select: { leads: true, propertyVisits: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json(
      paginatedResponse(properties, total, page, limit, "Properties fetched successfully")
    );
  } catch (error) {
    console.error("Get properties error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch properties";
    
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
      errorResponse("Failed to fetch properties", 500),
      { status: 500 }
    );
  }
}

// POST - Create a new property
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    // Check if agent is the current user or user is admin
    if (user.role !== "ADMIN" && validatedData.agentId !== user.id) {
      return NextResponse.json(
        errorResponse("You can only assign properties to yourself", 403),
        { status: 403 }
      );
    }

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        price: parseFloat(validatedData.price.toString()),
      },
      include: {
        agent: { select: { id: true, firstName: true, lastName: true } },
        images: true,
      },
    });

    return NextResponse.json(
      successResponse(property, "Property created successfully", 201),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create property error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        errorResponse(error.errors[0].message, 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse("Failed to create property", 500),
      { status: 500 }
    );
  }
}