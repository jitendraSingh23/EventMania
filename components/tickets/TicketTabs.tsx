'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "./TicketCard";

interface TicketTabsProps {
  initialTickets: any[];
}

export function TicketTabs({ initialTickets }: TicketTabsProps) {
  const [activeTab, setActiveTab] = useState('active');
  const claimedTickets = initialTickets.filter(ticket => ticket.claimed);
  const unclaimedTickets = initialTickets.filter(ticket => !ticket.claimed);

  if (!initialTickets.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tickets found</p>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="active">
          Active ({unclaimedTickets.length})
        </TabsTrigger>
        <TabsTrigger value="claimed">
          Used ({claimedTickets.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unclaimedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="claimed">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {claimedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
