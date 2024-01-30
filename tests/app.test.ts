import { JetPath } from "../dist/index.js";

// const app = new JetPath({ source: "tests" });
const app = new JetPath({
  source: "tests",
  displayRoutes: "UI",
  publicPath: { dir: "/src", route: "/jetpath" },
});
app.listen();
