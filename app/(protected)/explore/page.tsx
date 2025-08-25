import { db } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { SearchAndFilters } from "@/components/explore/SearchAndFilters";

interface SearchParams {
  search?: string;
  category?: string;
  price?: string;
}

async function getEvents(params: SearchParams) {
  try {
    const where = {
      AND: [
        params.search ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { description: { contains: params.search, mode: 'insensitive' } },
          ],
        } : {},
        params.category && params.category !== "all" ? { category: params.category } : {},
        params.price && params.price !== "all" ? {
          price: {
            lte: parseInt(params.price)
          }
        } : {},
        { status: "ACTIVE" }
      ],
    };

    const events = await db.event.findMany({
      where,
      include: {
        organizer: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const events = await getEvents(searchParams);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Explore Events</h1>
        <p className="text-muted-foreground">
          Discover amazing events happening around you
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters />

      {/* Results */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No events found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
