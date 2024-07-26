import { JetPath, JetPlugin } from "../dist/index.js";

// const app = new JetPath({ port: 1432, APIdisplay: "UI" });
const app = new JetPath({
  apiDoc: {
    name: "PetShop API Doc",
    info: `
    PetShop API Documentation
    This doc provides you with a simple read and write Api to The PetShop API
    `,
    logo: "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp",
  },
  source: "tests",
  // APIdisplay: "UI",
  APIdisplay: "HTTP",
  static: { dir: "./src", route: "/assest" },
  port: 9000,
  globalHeaders: {
    "X-PET-TOKEN": " xxxxxxxxxxxxxxx",
  },
});

const pluginExample = new JetPlugin({
  executor() {
    return {
      hello() {
        console.log("hello world");
      },
      accessCTX() {
        console.log(this /*= ctx*/);
      },
    };
  },
});

app.use(pluginExample);

app.listen();
