import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  try {
    await prisma.venue.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Venue deleted",
    });
  } catch {
    return NextResponse.json(
      { error: "Venue not found" },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Context
) {
  const { id } = await params;
  const venueId = Number(id);

  try {
    const body = await request.json();
    const newPrice = body.price !== undefined ? Number(body.price) : undefined;

    const venue = await prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        name: body.name,
        sport: body.sport,
        location: body.location,
        price: newPrice,
        capacity: body.capacity !== undefined ? Number(body.capacity) : undefined,
        occupancy: body.occupancy !== undefined ? Number(body.occupancy) : undefined,
        latitude: body.latitude !== undefined ? Number(body.latitude) : undefined,
        longitude: body.longitude !== undefined ? Number(body.longitude) : undefined,
        description: body.description !== undefined ? body.description : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
        features: body.features !== undefined ? body.features : undefined,
        facilities: body.facilities !== undefined ? body.facilities : undefined,
      },
    });

    // Sync updated price across venue slots
    if (newPrice !== undefined && !isNaN(newPrice)) {
      await prisma.slot.updateMany({
        where: { venueId },
        data: { price: newPrice },
      });
    }

    return NextResponse.json(venue);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update venue" },
      { status: 500 }
    );
  }
}