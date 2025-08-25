'use client';

import { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

interface QrScannerProps {
  onDecode: (result: string) => void;
  onError: (error: Error) => void;
}

export function QrScanner({ onDecode, onError }: QrScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const scanQRCode = () => {
      const video = webcamRef.current;
      if (!video) return;

      const imageSrc = video.getScreenshot();
      if (!imageSrc) return;

      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          onDecode(code.data);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      };
    };

    intervalRef.current = setInterval(scanQRCode, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onDecode]);

  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'environment',
          width: 300,
          height: 300,
          aspectRatio: 1,
        }}
        className="rounded-lg w-full h-full object-cover"
      />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
        {/* Scanner corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
      </div>
    </div>
  );
}
