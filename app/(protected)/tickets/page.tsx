import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TicketTabs } from "@/components/tickets/TicketTabs";

async function getTickets(userId: string) {
  const tickets = await db.ticket.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          date: true,
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return tickets;
}

export default async function TicketsPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const tickets = await getTickets(session.user.id);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>
      <TicketTabs initialTickets={tickets} />
    </div>
  );
}
