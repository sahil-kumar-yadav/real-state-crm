import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api-response";

// GET - Fetch a single lead
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const leadId = params.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedAgent: { select: { id: true, firstName: true, lastName: true } },
        interestedProperty: {
          select: { id: true, title: true, type: true, price: true },
        },
        activities: { orderBy: { createdAt: "desc" } },
        propertyVisits: { orderBy: { scheduledAt: "desc" } },
      },
    });

    if (!lead) {
      return NextResponse.json(
        errorResponse("Lead not found", 404),
        { status: 404 }
      );
    }

    // Check authorization - only admin or assigned agent can view
    if (user.role !== "ADMIN" && lead.assignedAgentId !== user.id) {
      return NextResponse.json(
        errorResponse("Forbidden", 403),
        { status: 403 }
      );
    }

    return NextResponse.json(
      successResponse(lead, "Lead fetched successfully")
    );
  } catch (error) {
    console.error("Get lead error:", error);
    return NextResponse.json(
      errorResponse("Failed to fetch lead", 500),
      { status: 500 }
    );
  }
}

// PUT - Update a lead
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user) {
      return NextResponse.json(
        errorResponse("Unauthorized", 401),
        { status: 401 }
      );
    }

    const leadId = params.id;
    const body = await request.json();

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { assignedAgentId: true },
    });

    if (!lead) {
      return NextResponse.json(
        errorResponse("Lead not found", 404),
        { status: 404 }
      );
    }

    // Check authorization
    if (user.role !== "ADMIN" && lead.assignedAgentId !== user.id) {
      return NextResponse.json(
        errorResponse("Forbidden", 403),
        { status: 403 }
      );
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...body,
        // Prevent reassignment unless admin
        assignedAgentId: user.role === "ADMIN" ? body.assignedAgentId : undefined,
      },
      include: {
        assignedAgent: { select: { id: true, firstName: true, lastName: true } },
        interestedProperty: {
          select: { id: true, title: true, type: true, price: true },
        },
      },
    });

    return NextResponse.json(
      successResponse(updatedLead, "Lead updated successfully")
    );
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      errorResponse("Failed to update lead", 500),
      { status: 500 }
    );
  }
}

// DELETE - Delete a lead
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthFromRequest(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        errorResponse("Only admins can delete leads", 403),
        { status: 403 }
      );
    }

    const leadId = params.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      return NextResponse.json(
        errorResponse("Lead not found", 404),
        { status: 404 }
      );
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });

    return NextResponse.json(
      successResponse(null, "Lead deleted successfully")
    );
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json(
      errorResponse("Failed to delete lead", 500),
      { status: 500 }
    );
  }
}
