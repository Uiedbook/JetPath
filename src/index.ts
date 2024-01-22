import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  getHandlers,
  UTILS,
} from "./primitives/functions";
import {
  type allowedMethods,
  type AppCTXType,
  type methods,
} from "./primitives/types.js";

export class JetPath {
  private options: any;
  private server: any;
  listening: boolean = false;
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
    this.server = UTILS.server();
  }
  decorate(decorations: Record<string, (ctx: AppCTXType) => void>) {
    if (this.listening) {
      throw new Error("Your app is listening new decorations can't be added.");
    }
    if (typeof decorations !== "object") {
      throw new Error("could not add decorations to ctx");
    }
    UTILS.decorators = Object.assign(UTILS.decorators, decorations);
  }
  async listen() {
    const port = this.options?.port || 8080;
    // ? setting http routes automatically
    // ? seeting up app configs
    for (const [k, v] of Object.entries(this.options || {})) {
      _JetPath_app_config.set(k, v);
    }

    if (
      typeof this.options !== "object" ||
      this.options.printRoutes !== false
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
    this.listening = true;
    console.log(`\nListening on http://localhost:${port}/`);
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { AppCTXType } from "./primitives/types";
