import { readFile, writeFile } from "fs/promises";
const build = Bun.spawn(["./pack"]);
await build.exited;
const html = await readFile("src/primitives/api-doc.html", {
  encoding: "utf-8",
});
const code = await readFile("dist/index.js", {
  encoding: "utf-8",
});
await writeFile("dist/index.js", code.replace("{{view}}", html));
console.log("JetPath is compiled!");
