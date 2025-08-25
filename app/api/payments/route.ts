import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { eventId } = await req.json();

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: event.price * 100, // amount in paisa
      currency: "INR",
      notes: {
        eventId: event.id,
        organizerId: event.organizerId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
