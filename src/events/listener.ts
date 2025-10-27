import type { Stan, Message } from "node-nats-streaming";
import type { Subjects } from "./subjects.js";

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  private client: Stan;

  // queue group name is for selecting the particular(one)
  // listener whenever we have multiple, and send the event to
  // process it AND
  // by default when listener goes down, durableName registry will get
  // destroyed and all the events (failed and passed) are retried because of setDeliverAllAvailable().
  // but having queue group name will keep the durable subsrecitopn
  // re-try only failed one when listener is up.
  abstract queueGroupName: string; // Name of the channel inside streaming server
  abstract subject: T["subject"];
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait: number = 5 * 1000; // 5s

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // When listener was down, now it has come-up or first time introducing,
        // retry all the all past events,
        .setDeliverAllAvailable()
        // whenever event send, this option tells,
        // to listener to send an acknowledgement to mark,
        // that event is failed or passed
        .setManualAckMode(true)
        .setAckWait(this.ackWait) // What's time-out Server has to for acknowledgement to receive from listener
        // Registry to retry events which are not
        // Acknowledged or fulfilled
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message recevied: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}

export { Listener };
