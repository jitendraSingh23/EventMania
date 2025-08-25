'use client';

import { useEffect, useRef } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

interface ScannerProps {
  onDecode: (result: string) => void;
  onError: (error: string) => void;
  isVerifying: boolean;
}

export function Scanner({ onDecode, onError, isVerifying }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const reader = new BrowserQRCodeReader();
        scannerRef.current = reader;
        
        const controls = await reader.decodeFromVideoElement(
          videoRef.current!,
          (result) => {
            if (result && !isVerifying && mounted) {
              onDecode(result.getText());
            }
          }
        );
        controlsRef.current = controls;
      } catch (error) {
        if (mounted) {
          onError('Camera initialization failed');
        }
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      // Stop video tracks
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      // Clean up scanner
      if (controlsRef.current) {
        try {
          controlsRef.current.stop();
        } catch (error) {
          console.error('Error stopping scanner:', error);
        }
      }
    };
  }, [onDecode, onError, isVerifying]);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-[300px] rounded-lg object-cover"
        playsInline
        muted
        autoPlay
      />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
    </div>
  );
}
