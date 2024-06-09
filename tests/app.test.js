import { JetPath } from "../dist/index.js";
import { busboyjet } from "./plug.js";
// const app = new JetPath({ source: "tests" });
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
    APIdisplay: "UI",
    // APIdisplay: "HTTP",
    static: { dir: "./src", route: "/assest" },
    port: 9000,
    globalHeaders: {
        "x-cf-token": "xxxxxxxxxxxxxxx",
    },
});
app.use(busboyjet);
app.listen();
