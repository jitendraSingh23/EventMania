'use client';

import { format } from "date-fns";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Download } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import QRCodeLib from 'qrcode';

interface TicketCardProps {
  ticket: {
    id: string;
    event: {
      id: string;
      name: string;
      date: Date;
    };
    claimed?: boolean;
    createdAt: Date;
  };
}

export function TicketCard({ ticket }: TicketCardProps) {
  const downloadTicket = async () => {
    try {
      const url = await QRCodeLib.toDataURL(ticket.id, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        }
      });
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ticket.event.name.toLowerCase().replace(/\s+/g, '-')}-ticket.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download ticket:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {ticket.event.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/events/${ticket.event.id}`}>
                  Event Info
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadTicket}>
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode
            value={ticket.id}
            size={180}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Purchased on {format(ticket.createdAt, 'PP')}
        </p>
      </CardContent>
    </Card>
  );
}
