import { formatDate } from "@/lib/utils";
import { Event } from "@prisma/client";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

type EventWithOrganizer = Event & {
  organizer: { name: string | null };
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()} ...`;
}

export function EventCard({ event }: { event: EventWithOrganizer }) {
  return (
    <Link 
      href={`/events/${event.id}`}
      className="group block bg-white rounded-lg overflow-hidden border transition-all hover:shadow-md max-w-sm mx-auto"
    >
      {/* Smaller image container */}
      <div className="aspect-[2/1] overflow-hidden max-h-[160px]">
        <img
          src={event.bannerUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Title and Price */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">
            {event.name}
          </h3>
          <span className="text-green-600 font-medium whitespace-nowrap">
            ₹{event.price}
          </span>
        </div>

        {/* Description with custom truncation */}
        <p className="text-sm text-muted-foreground h-10 overflow-hidden">
          {truncateText(event.description, 40)}
        </p>

        {/* Date and Location */}
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
