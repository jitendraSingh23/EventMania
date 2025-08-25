export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  category: string;
  imageUrl?: string;
  organizer: {
    name: string;
    id: string;
  };
  availableSeats: number;
};
