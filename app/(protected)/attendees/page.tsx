import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AttendeeList } from "@/components/attendees/AttendeeList";

async function getOrganizerData(userId: string) {
  const events = await db.event.findMany({
    where: { organizerId: userId },
    select: {
      id: true,
      name: true,
      date: true,
      tickets: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  return events;
}

export default async function AttendeesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const events = await getOrganizerData(session.user.id);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Event Attendees</h2>
      <AttendeeList events={events} />
    </div>
  );
}
