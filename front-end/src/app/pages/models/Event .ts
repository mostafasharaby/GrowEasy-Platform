export interface Event {
    id: number;
    name: string;
    description: string;
    category: string;
    eventDate: string;
    venue: string;
    price: number;
    imageUrl: string;
    availableTickets: number;
    createdAt: string;
    modifiedAt?: string | null;
  }