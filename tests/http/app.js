import JetPath from "../../lib/index.js";

const app = new JetPath({
  source: "./tests/http/", // optional
  cors: true, // optional
  // port: 3000, // optional
  printRoutes: true,
});
app.listen();
