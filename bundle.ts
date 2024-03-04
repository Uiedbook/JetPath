import { spawn } from "child_process";
import { readFile, writeFile } from "fs/promises";
const build = Bun.spawn(["./pack"]);
console.log(build);

// build.on("close", async () => {
//   const html = await readFile("src/primitives/view.html", {
//     encoding: "utf-8",
//   });
//   const code = await readFile("dist/index.js", {
//     encoding: "utf-8",
//   });
//   await writeFile("dist/index.js", code.replace("{{view}}", html));
// });
