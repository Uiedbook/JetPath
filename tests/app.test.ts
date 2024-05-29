import { JetPath } from "../dist/index.js";

// const app = new JetPath({ source: "tests" });
const app = new JetPath({
  documentation: {
    name: "PetShop API Doc",
    info: `
    PetShop API Documentation
    This doc provides you with a simple read and write Api to The PetShop API
    `,
    logo: "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp",
  },
  source: "tests",
  displayRoutes: "UI",
  publicPath: { dir: "./src", route: "/assest" },
  port: 9000,
});
import { WebSocketServer } from "ws";

// Spinning the HTTP server and the WebSocket server.
const server = app.server;
// const wss = new WebSocketServer({ server });

// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);
//   ws.on("message", function message(data) {
//     console.log("received: %s", data);
//   });
//   ws.send("something");
// });
app.listen();
