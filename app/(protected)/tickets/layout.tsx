import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function getTickets(userId: string) {
  return await db.ticket.findMany({
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
}

export default async function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const tickets = await getTickets(session.user.id);

  return (
    <div>
      {children}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.INITIAL_TICKETS = ${JSON.stringify(tickets)}`
        }}
      />
    </div>
  );
}
