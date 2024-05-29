import { AppCTX, JetSchema } from "./dist";
const a = Bun.serve({
  fetch() {
    return new Response("hello world");
  },
});

console.log(a);
