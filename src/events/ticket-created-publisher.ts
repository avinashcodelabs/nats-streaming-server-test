import { Publisher } from "./publisher.js";
import { Subjects } from "./subjects.js";
import { TicketCreateEvent } from "./ticket-create-event.js";

class TicketCreatedPublisher extends Publisher<TicketCreateEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export { TicketCreatedPublisher };
