import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = NextResponse.redirect(new URL("/admin/login", req.url), 303);
    
    // Clear the HTTP-only cookie by setting its maxAge to 0
    response.cookies.set("playspot_admin_auth", "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/admin/login", req.url), 303);
  }
}
