'use client';
import { Scanner} from '@yudiel/react-qr-scanner';

type QrScannerComponentProps = {
  onDecode: (result: string) => void;
  onError: (error: Error) => void;
};

export default function QrScannerComponent({ onDecode, onError }: QrScannerComponentProps) {
  return (
    <Scanner
      onDecode={onDecode}
      onError={onError}
      constraints={{
        facingMode: 'environment'
      }}
    />
  );
}
