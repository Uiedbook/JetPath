import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  getHandlers,
  UTILS,
} from "./app.js";
import { allowedMethods, methods } from "./types.js";

export class JetPath {
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
    this.options = options || { printRoutes: true };
    UTILS.server().then((s) => {
      this.server = s;
    });
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
      console.log("JetPath: compiling...");
      await getHandlers(this.options?.source!, true);
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k as methods] as any;
        if (r && Object.keys(r).length) {
          console.log("\n" + k + ": routes");
          for (const p in r) {
            console.log("'" + p + "'");
          }
        }
      }
    } else {
      await getHandlers(this.options?.source!, false);
    }
    console.log(`\nListening on http://localhost:${port}/`);
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { AppCTXType } from "./types";
