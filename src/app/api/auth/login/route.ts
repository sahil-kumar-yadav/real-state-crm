import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createToken, setAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        errorResponse("Email and password are required", 400),
        { status: 400 }
      );
    }

    // Validate credentials
    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        errorResponse("Invalid email or password", 401),
        { status: 401 }
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
        },
        "Login successful",
        200
      ),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      errorResponse("An error occurred. Please try again.", 500),
      { status: 500 }
    );
  }
}
