import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        errorResponse("Not authenticated", 401),
        { status: 401 }
      );
    }

    return NextResponse.json(
      successResponse({ user }, "User retrieved successfully", 200),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      errorResponse("An error occurred. Please try again.", 500),
      { status: 500 }
    );
  }
}
