import { Subjects } from "./subjects";

interface TicketCreateEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

export { TicketCreateEvent };
