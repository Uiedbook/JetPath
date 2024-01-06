import { JetPath } from "../lib/index.js";

const app = new JetPath({ port: 4000, source: "./tests" });
app.listen();

// {
//   source: "./tests/http/", // optional
//   cors: true, // optional
//   // port: 3000, // optional
//   printRoutes: true,
// }
