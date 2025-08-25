export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold">Event Not Found</h2>
      <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
    </div>
  );
}
