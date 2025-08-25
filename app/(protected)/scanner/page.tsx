'use client';
import { useState, Suspense } from 'react';
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scanner } from "@/components/scanner/Scanner";

interface TicketInfo {
  status: 'claimed' | 'already_claimed';
  ticket: {
    user: { name: string; email: string; };
    event: { name: string; };
    claimedAt?: Date;
  };
}

export default function ScannerPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [error, setError] = useState('');

  const handleDecode = async (result: string) => {
    if (isVerifying) return;
    
    try {
      setIsVerifying(true);
      setError('');
      
      const response = await fetch('/api/tickets/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: result }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setTicketInfo(data);
      toast.success(
        data.status === 'claimed' 
          ? 'Ticket successfully verified!' 
          : 'Ticket already claimed'
      );
    } catch (error) {
      setError(error.message);
      toast.error('Failed to verify ticket');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleError = (error: string) => {
    setError(error);
    toast.error('Scanner error');
  };

  const resetScanner = () => {
    setTicketInfo(null);
    setError('');
    setIsVerifying(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scan Ticket</h1>
      <div className="max-w-lg mx-auto space-y-6">
        {!ticketInfo && (
          <Suspense fallback={<div>Loading scanner...</div>}>
            <Scanner
              onDecode={handleDecode}
              onError={handleError}
              isVerifying={isVerifying}
            />
          </Suspense>
        )}

        {ticketInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{ticketInfo.ticket.event.name}</span>
                <span className={`text-sm ${
                  ticketInfo.status === 'claimed' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {ticketInfo.status === 'claimed' ? 'Just Verified' : 'Already Claimed'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Holder</p>
                <p className="font-medium">{ticketInfo.ticket.user.name}</p>
                <p className="text-sm text-muted-foreground">{ticketInfo.ticket.user.email}</p>
              </div>
              {ticketInfo.ticket.claimedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Claimed At</p>
                  <p className="font-medium">
                    {format(new Date(ticketInfo.ticket.claimedAt), 'PPp')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {ticketInfo && (
          <Button 
            onClick={resetScanner}
            className="w-full"
          >
            Scan Another Ticket
          </Button>
        )}
      </div>
    </div>
  );
}
