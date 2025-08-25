interface TicketTemplateProps {
  ticket: {
    id: string;
    event: {
      name: string;
      date: Date;
    };
    user: {
      name: string;
    };
  };
  qrValue: string;
}

export function TicketTemplate({ ticket, qrValue }: TicketTemplateProps) {
  return (
    <div className="w-[400px] h-[500px] bg-zinc-900 text-white p-8 flex flex-col items-center justify-between rounded-xl">
      <div className="w-full text-center space-y-2">
        <h2 className="text-xl font-medium">{ticket.user.name}</h2>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <img src={qrValue} alt="QR Code" className="w-48 h-48" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm text-zinc-400">Purchased on {new Date(ticket.event.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
