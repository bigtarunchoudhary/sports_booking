import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Secure demonstration validation
    if (email === "admin@playspot.com" && password === "admin") {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie
      response.cookies.set("playspot_admin_auth", "true", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 2, // 2 hours
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid email address or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
