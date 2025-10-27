import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects.js";

interface Event {}

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Publisher<T extends Event> {
  private client: Stan;
  abstract subject: T["subject"];

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("Event published to subject => " + this.subject);
        resolve();
      });
    });
  }
}

export { Publisher };
