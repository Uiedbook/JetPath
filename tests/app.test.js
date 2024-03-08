import { JetPath } from "../dist/index.js";
// const app = new JetPath({ source: "tests" });
const app = new JetPath({
  documentation: {
    name: "PetShop API Doc",
    info: `
    PetShop API Documentation

    This doc provides you with a simple read and write Api to The PetShop API
    `,
    logo: "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp",
  },
  // source: "tests",
  displayRoutes: "UI",
  publicPath: { dir: "./src", route: "/assest" },
  port: 9000,
});
app.listen();
