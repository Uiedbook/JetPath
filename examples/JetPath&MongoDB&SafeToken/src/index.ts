import mongoose from "mongoose";
import dotenv from "dotenv";
import { JetPath } from "jetpath";
import { createServer } from "./database/setup.js";
dotenv.config();

const app = new JetPath({
  source: "lib",
  cors: true,
  displayRoutes: true,
});

try {
  await mongoose.connect(process.env.MONGODB_CONNECT!);
  await createServer();
  app.listen();
} catch (error) {
  console.log({ error });
  mongoose.connection.close();
  process.exit(1);
}
