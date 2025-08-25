import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { redirect } from "next/navigation";

async function getEvents() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  try {
    const events = await db.event.findMany({
      where: {
        organizerId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        organizer: {
          select: {
            name: true,
          }
        },
      }
    });
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw new Error("Failed to fetch events");
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">All Events</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
