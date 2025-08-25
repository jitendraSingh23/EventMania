'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";

interface UPIPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventName: string;
  amount: number;
  upiId: string;
}

export function UPIPaymentDialog({
  isOpen,
  onClose,
  onSuccess,
  eventName,
  amount,
  upiId,
}: UPIPaymentDialogProps) {
  const [qrCode, setQrCode] = useState<string>("");

  const generateUPILink = () => {
    const upiURL = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(eventName)}&am=${amount}&cu=INR`;
    QRCode.toDataURL(upiURL).then(setQrCode);
  };

  useState(() => {
    if (isOpen) {
      generateUPILink();
    }
  }, [isOpen]);

  const handlePaymentSuccess = () => {
    toast.success("Payment successful!");
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay ₹{amount} via UPI</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {qrCode && (
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCode} alt="UPI QR Code" className="w-48 h-48" />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code using any UPI app to pay
            </p>
            <p className="font-medium">UPI ID: {upiId}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handlePaymentSuccess} className="w-full">
              I have completed the payment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
