import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  request: Request,
  { params }: Context
) {
  const { id } = await params;
  const bookingId = Number(id);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("playspot_admin_auth")?.value === "true";

    // Check 15-minute cancellation policy window (bypassed for admins)
    if (!isAdmin) {
      const now = new Date();
      const createdTime = new Date(booking.createdAt);
      const diffInMs = now.getTime() - createdTime.getTime();
      const diffInMinutes = diffInMs / (1000 * 60);

      if (diffInMinutes > 15) {
        return NextResponse.json(
          {
            error: "Cancellation window expired. Bookings can only be cancelled within 15 minutes of creation.",
          },
          { status: 400 }
        );
      }
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}