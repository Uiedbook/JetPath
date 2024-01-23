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
  Bun.spawn(["./pack"]);
}
export {};
