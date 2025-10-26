import nats from "node-nats-streaming";
import type { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    // whenever event send, this option tells,
    // to listener to send an acknowledgement to mark,
    // that event is failed or passed
    .setManualAckMode(true)
    // When listener was down, now it has come-up or first time introducing,
    // retry all the all past events,
    .setDeliverAllAvailable()
    // Registry to retry events which are not
    // Acknowledged or fulfilled
    .setDurableName("some-some");

  const subscription = stan.subscribe(
    "ticket:created",
    // queue group name is for selecting the particular(one)
    // listener whenever we have multiple, and send the event to
    // process it AND
    // by default when listener goes down, durableName registry will get
    // destroyed and all the events (failed and passed) are retried because of setDeliverAllAvailable().
    // but having queue group name will keep the durable subsrecitopn
    // re-try only failed one when listener is up.
    "order-service-queue-group",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
