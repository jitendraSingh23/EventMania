import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { eventId } = json;

    // Check if event exists and has available seats
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    if (event._count.tickets >= event.totalSeats) {
      return new NextResponse("Event is sold out", { status: 400 });
    }

    // Create ticket
    const ticket = await db.ticket.create({
      data: {
        eventId,
        userId: session.user.id,
      },
      include: {
        event: true,
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
