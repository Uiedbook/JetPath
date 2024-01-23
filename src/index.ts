import { readFileSync } from "fs";
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
import { html } from "./primitives/html";

export class JetPath {
  private options: any;
  private server: any;
  listening: boolean = false;
  constructor(options?: {
    source?: string;
    credentials?: any;
    displayRoutes?: boolean | "UI";
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
    this.options = options || { displayRoutes: true };
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
      this.options.displayRoutes !== false
    ) {
      let c = 0,
        t = "";
      console.log("JetPath: compiling...");
      const startTime = performance.now();
      await getHandlers(this.options?.source!, true);
      const endTime = performance.now();
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k as methods];
        if (r && Object.keys(r).length) {
          // console.log(`\n ${r} ${k} HTTP/1.1`);
          for (const p in r) {
            const api = `\n
${k} http://localhost:${port}${p} HTTP/1.1

###`;
            if (this.options.displayRoutes === "UI") {
              t += api;
            } else {
              console.log(api);
            }
            c += 1;
          }
        }
      }
      if (this.options.displayRoutes === "UI") {
        _JetPath_paths["GET"]["/JetPath/ui"] = (ctx) => {
          ctx.reply(html.replace("'{JETPATH}'", `\`${t}\``), "text/html");
        };
        console.log(
          `visit http://localhost:${port}/JetPath/ui to see the displayed routes in UI`
        );
      }

      console.log(
        `\n Parsed ${c} handlers in ${Math.round(
          endTime - startTime
        )} milliseconds`
      );
    } else {
      await getHandlers(this.options?.source!, false);
    }
    this.listening = true;
    console.log(`\nListening on http://localhost:${port}/`);
    this.server.listen(port);
  }
}

//? exports
export type { AppCTXType } from "./primitives/types";
