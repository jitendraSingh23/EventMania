import { auth } from "@/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { JoinEventButton } from "@/components/events/JoinEventButton";
import { ShareEventDialog } from "@/components/events/ShareEventDialog";

async function getEvent(eventId: string, userId?: string) {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { tickets: true }
        },
        tickets: userId ? {
          where: { userId },
          select: { id: true }
        } : false
      },
    });

    if (!event) return null;

    return {
      ...event,
      hasUserTicket: event.tickets?.length > 0,
      availableSeats: event.totalSeats - event._count.tickets,
      externalLinks: event.externalLinks ? JSON.parse(event.externalLinks as string) : []
    };
  } catch (error) {
    return null;
  }
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const event = await getEvent(params.id, session?.user?.id);

  if (!event) {
    notFound();
  }

  const isOrganizer = session?.user?.id === event.organizerId;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-8">
        {/* Banner Image First */}
        <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-muted">
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details Box - Full Width */}
        <div className="p-6 bg-muted/50 rounded-lg space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{event.name}</h1>
              <Badge variant="outline" className="text-base">
                {event.category}
              </Badge>
            </div>
            <ShareEventDialog eventId={event.id} eventName={event.name} />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {format(event.date, 'MMMM d, yyyy')} at {event.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{event.totalSeats} seats</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created by</p>
              <p className="font-medium">{event.organizer.name}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* About Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About</h2>
              <p className="leading-7">{event.description}</p>
            </div>

            <Separator />

            {/* Rules Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Rules & Guidelines</h2>
              <div className="prose prose-stone max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-base">
                  {event.rules}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Card */}
          <div>
            <div className="sticky top-6 rounded-xl border bg-gradient-to-b from-white to-gray-50/50 p-6 shadow-lg space-y-6 backdrop-blur">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Ticket Price</p>
                  <Badge variant="secondary">{event.status}</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹{event.price}</span>
                  <span className="text-muted-foreground">/person</span>
                </div>
              </div>

              {!isOrganizer && (
                <div className="space-y-4">
                  <JoinEventButton 
                    eventId={event.id}
                    name={event.name}
                    price={event.price}
                    availableSeats={event.availableSeats}
                    hasTicket={event.hasUserTicket}
                  />
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available Seats</span>
                      <span className="font-medium text-blue-600">
                        {event.availableSeats} / {event.totalSeats}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {event.externalLinks?.length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    External Links
                  </h4>
                  <div className="grid gap-2">
                    {event.externalLinks.map((link: { type: string; url: string }, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-muted-foreground hover:text-blue-600 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span className="font-medium">{link.type}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
