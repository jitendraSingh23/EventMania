import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { CalendarDays, Users, Ticket, DollarSign } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TicketSalesChart } from "@/components/dashboard/charts/TicketSalesChart";

async function getDashboardData(userId: string) {
  const totalEvents = await db.event.count({
    where: { organizerId: userId }
  });

  const totalAttendees = await db.ticket.count({
    where: {
      event: { organizerId: userId }
    }
  });

  // Get events with ticket counts
  const events = await db.event.findMany({
    where: { organizerId: userId },
    select: {
      id: true,
      price: true,
      _count: {
        select: { tickets: true }
      }
    }
  });

  // Calculate total revenue from event prices * ticket counts
  const totalRevenue = events.reduce((sum, event) => 
    sum + (event.price * event._count.tickets), 0
  );

  const recentEvents = await db.event.findMany({
    where: { organizerId: userId },
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      date: true,
      status: true,
      price: true,
      _count: {
        select: { tickets: true }
      }
    }
  });

  const chartEvents = await db.event.findMany({
    where: { organizerId: userId },
    select: {
      name: true,
      _count: {
        select: { tickets: true }
      },
      price: true,
    },
    take: 5,
    orderBy: { date: 'desc' },
  });

  return {
    stats: [
      { title: "Total Events", value: totalEvents.toString(), icon: CalendarDays },
      { title: "Total Attendees", value: totalAttendees.toString(), icon: Users },
      { title: "Total Sales", value: events.reduce((acc, event) => acc + event._count.tickets, 0).toString(), icon: Ticket },
      { title: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    ],
    recentEvents: recentEvents.map(event => ({
      id: event.id,
      name: event.name,
      date: event.date,
      tickets: event._count.tickets,
      sales: `$${(event.price * event._count.tickets).toFixed(2)}`,
      status: event.status
    })),
    chartEvents: chartEvents.map(event => ({
      name: event.name,
      tickets: event._count.tickets,
      sales: `$${(event.price * event._count.tickets).toFixed(2)}`,
    }))
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const { stats, recentEvents, chartEvents } = await getDashboardData(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button asChild>
          <Link href="/events/create">Create New Event</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1">
        <TicketSalesChart events={chartEvents} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tickets Sold</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.tickets}</TableCell>
                  <TableCell>{event.sales}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
