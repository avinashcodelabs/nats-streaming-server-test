import type { Message } from "node-nats-streaming";
import { Listener } from "./listener";
import { TicketCreateEvent } from "./ticket-create-event";
import { Subjects } from "./subjects";

class TicketCreatedListener extends Listener<TicketCreateEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreateEvent["data"], msg: Message) {
    console.log("Event data: ", data);
    msg.ack();
  }
}

export { TicketCreatedListener };
