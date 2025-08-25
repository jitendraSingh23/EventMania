import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, eventId } = await req.json();

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status === 'captured') {
      // Create ticket
      const ticket = await db.ticket.create({
        data: {
          eventId,
          userId: payment.notes.userId,
        }
      });

      // Transfer money to organizer (90% of the amount)
      const transferAmount = Math.floor(payment.amount * 0.9);
      await razorpay.transfers.create({
        account: payment.notes.organizerId, // Razorpay account ID of organizer
        amount: transferAmount,
        currency: "INR",
        notes: {
          eventId: payment.notes.eventId,
          ticketId: ticket.id,
        }
      });

      return NextResponse.json({ success: true, ticketId: ticket.id });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
