To run nats server
nats-streaming-server-test > kubectl apply -f nats-depl.yaml

- Since nats steaming server is running inside k8s pod, use port-forward to directly connect to it, temporarily
- Streaming server
  kubectl port-forward nats-depl-6468fdb94d-cqk24 4222:4222

Monitoring server
kubectl port-forward nats-depl-6468fdb94d-cqk24 8222:8222

Monitoring URLs.
http://localhost:8222/streaming/clientsz
http://localhost:8222/streaming
http://localhost:8222

Use below command to run the app,
-- npm run publish
-- npm run listen

try typing 'watch' on the publish terminal to send the events.
