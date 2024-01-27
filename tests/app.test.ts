import { JetPath } from "../dist/index.js";

// const app = new JetPath({ source: "tests" });
const app = new JetPath({ source: "tests", displayRoutes: "UI" });
app.listen();
