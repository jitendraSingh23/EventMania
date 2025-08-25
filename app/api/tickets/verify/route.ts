import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { ticketId } = await req.json();
    if (!ticketId) {
      return new NextResponse("Ticket ID is required", { status: 400 });
    }

    // First check if ticket exists and get related data
    const ticket = await db.ticket.findUnique({
      where: { 
        id: ticketId 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        event: {
          select: {
            organizerId: true,
            name: true,
          }
        }
      }
    });

    if (!ticket) {
      return new NextResponse("Ticket not found", { status: 404 });
    }

    // Verify organizer
    if (ticket.event.organizerId !== session.user.id) {
      return new NextResponse("Not authorized to verify this ticket", { status: 403 });
    }

    // If already claimed, return early
    if (ticket.claimed) {
      return NextResponse.json({
        status: 'already_claimed',
        ticket,
        claimedAt: ticket.claimedAt,
      });
    }

    // Update ticket to claimed status
    const updatedTicket = await db.ticket.update({
      where: { 
        id: ticketId,
        // Add additional check to prevent race conditions
        claimed: false,
      },
      data: {
        claimed: true,
        claimedAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        event: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      status: 'claimed',
      ticket: updatedTicket
    });

  } catch (error) {
    console.error('Ticket verification error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error", 
      { status: 500 }
    );
  }
}
