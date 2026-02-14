import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";
import { errorResponse, successResponse } from "@/lib/api-response";

// GET - Fetch a single property
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const propertyId = params.id;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        agent: { select: { id: true, firstName: true, lastName: true } },
        images: true,
        leads: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
        propertyVisits: {
          select: {
            id: true,
            scheduledAt: true,
            status: true,
            lead: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { scheduledAt: "desc" },
        },
        _count: {
          select: { leads: true, propertyVisits: true },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        errorResponse("Property not found", 404),
        { status: 404 }
      );
    }

    // Check authorization - only admin or assigned agent can view
    if (user.role !== "ADMIN" && property.agentId !== user.id) {
      return NextResponse.json(
        errorResponse("Forbidden", 403),
        { status: 403 }
      );
    }

    return NextResponse.json(
      successResponse(property, "Property fetched successfully")
    );
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch property", 500),
      { status: 500 }
    );
  }
}

// PUT - Update a property
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const propertyId = params.id;
    const body = await request.json();

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { agentId: true },
    });

    if (!property) {
      return NextResponse.json(
        errorResponse("Property not found", 404),
        { status: 404 }
      );
    }

    // Check authorization
    if (user.role !== "ADMIN" && property.agentId !== user.id) {
      return NextResponse.json(
        errorResponse("Forbidden", 403),
        { status: 403 }
      );
    }

    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price.toString()) : undefined,
        agentId: user.role === "ADMIN" ? body.agentId : undefined,
      },
      include: {
        agent: { select: { id: true, firstName: true, lastName: true } },
        images: true,
      },
    });

    return NextResponse.json(
      successResponse(updatedProperty, "Property updated successfully")
    );
  } catch (error: any) {
    console.error("Update property error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        errorResponse(error.errors[0].message, 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse("Failed to update property", 500),
      { status: 500 }
    );
  }
}

// DELETE - Delete a property
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        errorResponse("Only admins can delete properties", 403),
        { status: 403 }
      );
    }

    const propertyId = params.id;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        errorResponse("Property not found", 404),
        { status: 404 }
      );
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return NextResponse.json(
      successResponse(null, "Property deleted successfully")
    );
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json(
      errorResponse("Failed to delete property", 500),
      { status: 500 }
    );
  }
}
