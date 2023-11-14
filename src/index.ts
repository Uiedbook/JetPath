import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  getHandlers,
  JetPath_app,
} from "./app.js";
import { allowedMethods } from "./types.js";

export default class JetPath {
  options: any;
  server: any;
  constructor(options?: {
    source?: string;
    credentials?: any;
    printRoutes?: boolean;
    port?: number;
    cors?:
      | {
          allowMethods?: allowedMethods;
          secureContext?: boolean;
          allowHeaders?: string[];
          exposeHeaders?: string[];
          keepHeadersOnError?: boolean;
          maxAge?: string;
          credentials?: boolean;
          privateNetworkAccess?: any;
          origin?: string;
        }
      | boolean;
  }) {
    this.options = options;
    this.server = JetPath_app;
  }
  async listen() {
    const port = this.options?.port || 8080;
    // ? setting http routes automatically
    // ? seeting up app configs
    for (const [k, v] of Object.entries(this.options || {})) {
      _JetPath_app_config.set(k, v);
    }

    if (
      _JetPath_app_config["printRoutes" as keyof typeof _JetPath_app_config]
    ) {
      console.log("JetPath: compiling paths ... ");
      await getHandlers(this.options?.source!);
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      console.log(_JetPath_paths);
    } else {
      await getHandlers(this.options?.source!);
    }
    console.log(`JetPath app listening on port ${port}`);
    JetPath_app.on("error", (e) => {
      if ((e as any).code === "EADDRINUSE") {
        console.log("Address in use, retrying...");
        setTimeout(() => {
          JetPath_app.close();
          JetPath_app.listen(port);
        }, 1000);
      }
    });
    JetPath_app.listen(this.options?.port || 8080);
  }
}

//? exports
export type { AppCTXType } from "./types";
