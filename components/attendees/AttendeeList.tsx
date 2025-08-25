'use client';

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: string;
  name: string;
  date: Date;
  tickets: Array<{
    id: string;
    claimed: boolean;
    user: {
      name: string;
      email: string;
    };
  }>;
}

export function AttendeeList({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');

  const selectedEvent = events.find(event => event.id === selectedEventId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Attendee List</CardTitle>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name} ({new Date(event.date).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ticket ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEvent?.tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.user.name}</TableCell>
                <TableCell>{ticket.user.email}</TableCell>
                <TableCell>
                  <Badge variant={ticket.claimed ? "secondary" : "success"}>
                    {ticket.claimed ? "Used" : "Valid"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {ticket.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
