import { EventCard } from "./EventCard";
import { Event } from "@/types/event";

// Mock data - replace with actual data fetching
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Annual tech conference",
    date: new Date("2024-03-15"),
    location: "San Francisco, CA",
    price: 299,
    category: "tech",
    organizer: { name: "Tech Events Inc", id: "org1" },
    availableSeats: 500,
  },
  // Add more mock events as needed
];

export function EventGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
