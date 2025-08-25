'use client';

import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { initializePayPalButton } from "@/lib/payment";
import Script from "next/script";
import { toast } from "sonner";

interface JoinEventButtonProps {
  eventId: string;
  name: string;
  price: number;
  organizerEmail: string;
  availableSeats: number;
  hasTicket: boolean;
}

export function JoinEventButton({ 
  eventId, 
  name, 
  price, 
  organizerEmail,
  availableSeats, 
  hasTicket 
}: JoinEventButtonProps) {
  const paypalButtonRef = useRef<HTMLDivElement>(null);

  const handleSuccess = async (details: any) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId,
          paymentId: details.id,
          paymentDetails: details
        })
      });

      if (!response.ok) throw new Error();
      window.location.reload();
    } catch {
      toast.error("Failed to confirm ticket");
    }
  };

  useEffect(() => {
    if (paypalButtonRef.current) {
      initializePayPalButton(
        paypalButtonRef.current,
        price,
        organizerEmail,
        handleSuccess
      );
    }
  }, [price, organizerEmail]);

  if (hasTicket) {
    return <Button disabled className="w-full">Already Joined</Button>;
  }

  return (
    <>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"
        strategy="lazyOnload"
      />
      <div ref={paypalButtonRef} />
    </>
  );
}
