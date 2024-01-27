import { readFile, writeFile } from "fs/promises";

const res = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  watch: true,
});
if (!res.success) {
  console.log(...res.logs);
} else {
  const html = await readFile("src/primitives/view.html", {
    encoding: "utf-8",
  });
  const code = await readFile("dist/index.js", {
    encoding: "utf-8",
  });
  await writeFile("dist/index.js", code.replace("{view}", html));
  Bun.spawn(["./pack"]);
}
export {};
