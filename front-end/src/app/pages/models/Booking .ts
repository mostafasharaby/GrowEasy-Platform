export interface Booking {
    id: number;
    userId: string;
    eventId: number;
    eventName: string;
    eventDate: string;
    venue: string;
    price: number | null;
    ticketCount: number;
    status: string | null;
    bookingDate: string;
  }
 
export interface CreateBookingDTO {
    eventId: number;
    ticketCount: number;
  }