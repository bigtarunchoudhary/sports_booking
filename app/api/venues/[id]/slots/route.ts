import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;

  const slots = await prisma.slot.findMany({
    where: { venueId: Number(id) },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(slots);
}

export async function POST(request: Request, { params }: Context) {
  const { id } = await params;

  try {
    const body = await request.json();

    if (!body.time || body.price === undefined) {
      return NextResponse.json(
        { error: "Time and price are required" },
        { status: 400 }
      );
    }

    const slot = await prisma.slot.create({
      data: {
        venueId: Number(id),
        time: body.time,
        price: Number(body.price),
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create slot" },
      { status: 500 }
    );
  }
}