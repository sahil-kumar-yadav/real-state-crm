import { NextRequest, NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * BACKDOOR ROUTE FOR TESTING ONLY
 * 
 * This route allows quick authentication for testing purposes without database access.
 * REMOVE IN PRODUCTION!
 * 
 * Usage:
 * POST /api/auth/backdoor with body: { role: "ADMIN" | "AGENT" | "CLIENT" }
 */

// Test users (used when database is not available)
const TEST_USERS = {
  ADMIN: {
    id: "admin-user-1",
    email: "admin@recrm.com",
    role: "ADMIN" as const,
    firstName: "Admin",
    lastName: "User",
  },
  AGENT: {
    id: "agent-user-1",
    email: "agent1@recrm.com",
    role: "AGENT" as const,
    firstName: "John",
    lastName: "Agent",
  },
  CLIENT: {
    id: "client-user-1",
    email: "client@recrm.com",
    role: "CLIENT" as const,
    firstName: "Jane",
    lastName: "Client",
  },
};

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      errorResponse("Backdoor not available in production", 403),
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { role = "ADMIN" } = body;

    // Validate role
    if (!["ADMIN", "AGENT", "CLIENT"].includes(role)) {
      return NextResponse.json(
        errorResponse("Invalid role. Must be ADMIN, AGENT, or CLIENT", 400),
        { status: 400 }
      );
    }

    // Use test user (works without database)
    const user = TEST_USERS[role as keyof typeof TEST_USERS];

    if (!user) {
      return NextResponse.json(
        errorResponse(`No test user found for role: ${role}`, 404),
        { status: 404 }
      );
    }

    // Create JWT token
    const token = await createToken(user);

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      successResponse(
        {
          user,
          token,
          message: `Test login: ${role}`,
        },
        "Backdoor login successful",
        200
      ),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Backdoor login error:", error);
    return NextResponse.json(
      errorResponse("An error occurred. Please try again.", 500),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      errorResponse("Backdoor not available in production", 403),
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Backdoor route available in development only",
    usage: "POST /api/auth/backdoor with body: { role: 'ADMIN' | 'AGENT' | 'CLIENT' }",
    availableRoles: Object.keys(TEST_USERS),
  });
}
