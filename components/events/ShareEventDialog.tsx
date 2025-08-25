'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Copy } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';

interface ShareEventDialogProps {
  eventId: string;
  eventName: string;
}

export function ShareEventDialog({ eventId, eventName }: ShareEventDialogProps) {
  const [eventUrl, setEventUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setEventUrl(`${window.location.origin}/events/${eventId}`);
    setIsMobile(/Android|iPhone/i.test(navigator.userAgent));
  }, [eventId]);

  const shareButtons = [
    {
      Button: TwitterShareButton,
      Icon: TwitterIcon,
      name: 'Twitter',
      props: {
        url: eventUrl,
        title: `Check out ${eventName}`,
        hashtags: ['events']
      }
    },
    {
      name: 'WhatsApp',
      Icon: WhatsappIcon,
      isCustom: true,
      url: `${isMobile ? 'whatsapp://send' : 'https://wa.me/'}/?text=${encodeURIComponent(`Check out ${eventName}: ${eventUrl}`)}`
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    toast.success('Link copied to clipboard!');
  };

  if (!eventUrl) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
            <input 
              type="text" 
              value={eventUrl} 
              readOnly 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            />
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {shareButtons.map((btn) => (
              <div key={btn.name}>
                {btn.isCustom ? (
                  <a
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors w-full"
                  >
                    <btn.Icon size={16} round />
                    <span>{btn.name}</span>
                  </a>
                ) : (
                  <btn.Button url={eventUrl} {...btn.props} className="w-full !p-0">
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors w-full">
                      <btn.Icon size={16} round />
                      <span>{btn.name}</span>
                    </div>
                  </btn.Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
