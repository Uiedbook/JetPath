import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  getHandlers,
  UTILS,
} from "./primitives/functions";
import {
  type allowedMethods,
  type AppCTX,
  type methods,
  type Schema,
} from "./primitives/types.js";

export class JetPath {
  public server: any;
  private listening: boolean = false;
  private options: any;
  constructor(options?: {
    documentation?: {
      name?: string;
      info?: string;
      color?: string;
    };
    source?: string;
    credentials?: any;
    displayRoutes?: boolean | "UI";
    port?: number;
    publicPath?: { route: string; dir: string };
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
  decorate(decorations: Record<string, (ctx: AppCTX) => void>) {
    if (this.listening) {
      throw new Error("Your app is listening new decorations can't be added.");
    }
    if (typeof decorations !== "object") {
      // console.log({ decorations });
      throw new Error("could not add decoration to ctx");
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
    if (this.options?.publicPath?.route && this.options?.publicPath?.dir) {
      _JetPath_paths["GET"][this.options.publicPath.route + "/*"] = (ctx) => {
        const fileName = ctx.params?.["extraPath"];
        if (
          fileName &&
          ("/" + fileName).includes(this.options.publicPath.dir + "/")
        ) {
          let contentType;
          switch (fileName.split(".")[1]) {
            case "js":
              contentType = "application/javascript";
              break;
            case "pdf":
              contentType = "application/pdf";
              break;
            case "json":
              contentType = "application/json";
              break;
            case "css":
              contentType = "text/css; charset=utf-8";
              break;
            case "html":
              contentType = "charset=utf-8";
              break;
            case "png":
              contentType = "image/png";
              break;
            case "avif":
              contentType = "image/avif";
              break;
            case "webp":
              contentType = "image/webp";
              break;
            case "jpg":
              contentType = "image/jpeg";
              break;
            case "svg":
              contentType = "image/svg+xml";
              break;
            case "ico":
              contentType = "image/vnd.microsoft.icon";
              break;
            default:
              contentType = "text/plain";
              break;
          }
          return ctx.pipe(fileName, contentType);
        }
      };
    }

    if (
      typeof this.options !== "object" ||
      this.options?.displayRoutes !== false
    ) {
      let c = 0,
        t = "";
      console.log("JetPath: compiling...");
      const startTime = performance.now();
      await getHandlers(this.options?.source!, true);
      const endTime = performance.now();
      console.log("JetPath: done.");
      // console.log(_JetPath_hooks);
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k as methods];
        if (r && Object.keys(r).length) {
          for (const p in r) {
            const b = UTILS.validators[p];
            const j: Record<string, any> = {};
            if (b) {
              for (const ke in b) {
                j[ke] = (b[ke as "BODY_info"] as any)?.inputType || "text";
              }
            }

            const api = `\n
${k} [--host--]${p} HTTP/1.1
${b && k !== "GET" ? "\n" + JSON.stringify(j) : ""}\n

# ${"lol"}
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
        _JetPath_paths["GET"]["/api-doc"] = (ctx) => {
          ctx.reply(
            `{view}`
              .replace("'{JETPATH}'", `\`${t}\``)
              .replaceAll(
                "{NAME}",
                this.options?.documentation?.name || "JethPath API Doc"
              )
              .replaceAll(
                "JETPATHCOLOR",
                this.options?.documentation?.color || "#007bff"
              )
              .replaceAll(
                "{LOGO}",
                this.options?.documentation?.color || "#007bff"
              )
              .replaceAll(
                "{INFO}",
                this.options?.documentation?.info ||
                  "This is a JethPath api preview."
              ),
            "text/html"
          );
        };
        console.log(
          `visit http://localhost:${port}/api-doc to see the displayed routes in UI`
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
export type { AppCTX, Schema } from "./primitives/types";
