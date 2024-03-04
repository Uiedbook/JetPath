uploading files with JetPath

## Node

```js
// install

// npm i ws

// usage
import { WebSocketServer } from 'ws';
import http from 'node:http';
import { JetPath } from "jetpath";
const app = new JetPath({ source: "tests" });

POST_socket(ctx) {
// Spinning the HTTP server and the WebSocket server.
const server = app.server;
const wsServer = new WebSocketServer({ server });
const port = 8000;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
}
```

## Bun

```js
// usage
POST_websocket(ctx) {
  // upgrade the request to a WebSocket
  if (server.upgrade(req)) {
    return; // do not return a Response
  }
  return    {
    //? https://bun.sh/docs/api/websockets
    message(ws, message) {}, // a message is received
    open(ws) {}, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
}
```

## Deno

```js
// usage
POST_socket(ctx) {
    const {
      response,
      socket,
    } = Deno.upgradeWebSocket(ctx.request);
    socket.onmessage = (m) => {
      console.log("Echoing: %s", m.data);
      socket.send(m.data);
    };
    socket.onclose = () => console.log("Client has disconnected");
    ctx.send("done!")
}
```
