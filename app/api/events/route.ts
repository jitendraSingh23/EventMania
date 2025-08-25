import { auth } from "@/auth";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations/event";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    // Convert date and time strings to ISO DateTime
    const dateTime = new Date(`${data.date}T${data.time}:00`);

    const event = await db.event.create({
      data: {
        ...data,
        date: dateTime,  // Use the formatted DateTime
        organizerId: session.user.id,
        externalLinks: data.externalLinks || null,
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Event creation error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
