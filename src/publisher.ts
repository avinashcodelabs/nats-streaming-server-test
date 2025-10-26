import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "movie night",
    price: 100,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published!!");
  });
});
