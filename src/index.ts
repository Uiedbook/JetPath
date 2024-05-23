import mime from "mime/lite";

import { access, writeFile } from "node:fs/promises";
import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  compileUI,
  getHandlers,
  UTILS,
} from "./primitives/functions.js";
import {
  type allowedMethods,
  type AppCTX,
  type methods,
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
      logo?: string;
      path?: string;
    };
    source?: string;
    credentials?: any;
    displayRoutes?: "UI" | "HTTP";
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
    this.options = options || {
      displayRoutes: true,
      documentation: { path: "/api-doc" },
    };
    // ? setting http routes automatically
    // ? setting up app configs
    for (const [k, v] of Object.entries(this.options)) {
      _JetPath_app_config.set(k, v);
    }
    if (!options?.cors) {
      _JetPath_app_config.set("cors", true);
    }
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
    if (typeof decorations === "object") {
      for (const key in decorations) {
        if (!UTILS.ctx[key as keyof AppCTX]) {
          (UTILS.ctx as unknown as Record<string, (ctx: AppCTX) => void>)[key] =
            decorations[key];
        }
      }
    }
  }
  async listen() {
    // ? {-view-} here is replaced at build time to html
    let UI = `{{view}}`;
    if (this.options?.publicPath?.route && this.options?.publicPath?.dir) {
      _JetPath_paths["GET"][this.options.publicPath.route + "/*"] = async (
        ctx
      ) => {
        const fileName =
          this.options.publicPath.dir +
          "/" +
          decodeURI(ctx.params?.["extraPath"]);
        if (fileName) {
          const contentType = mime.getType(
            fileName.split(".").at(-1) || "application/octet-stream"
          );
          try {
            await access(fileName);
          } catch (error) {
            return ctx.throw();
          }
          return ctx.pipe(fileName, contentType!);
        } else {
          return ctx.throw();
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
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k as methods];
        if (r && Object.keys(r).length) {
          for (const p in r) {
            const v = UTILS.validators[p] || {};
            const b = v?.body || {};
            const h_inial = v?.headers || {};
            const h = [];
            for (const name in h_inial) {
              h.push(name + ":" + h_inial[name]);
            }
            const j: Record<string, any> = {};
            if (b) {
              for (const ke in b) {
                j[ke] =
                  (b[ke as "info"] as any)?.defaultValue ||
                  (b[ke as "info"] as any)?.inputType ||
                  "text";
              }
            }
            const api = `\n
${k} ${
              this.options?.displayRoutes === "UI"
                ? "[--host--]"
                : "http://localhost:" + (this.options?.port || 8080)
            }${p} HTTP/1.1
${h.length ? h.join("\n") : ""}\n
${v && (v.method === k && k !== "GET" ? k : "") ? JSON.stringify(j) : ""}\n${
              v && (v.method === k ? k : "") && v?.["info"]
                ? "#" + v?.["info"] + "-JETE"
                : ""
            }
###`;
            if (this.options.displayRoutes) {
              t += api;
            } else {
              console.log(api);
            }
            c += 1;
          }
        }
      }

      if (this.options?.displayRoutes === "UI") {
        UI = compileUI(UI, this.options, t);
        _JetPath_paths["GET"][this.options?.documentation?.path] = (ctx) => {
          ctx.send(UI, "text/html");
        };
        console.log(
          `visit http://localhost:${this.options?.port || 8080}${
            this.options.documentation.path
          } see the displayed routes in UI`
        );
      }
      if (this.options?.displayRoutes === "FILE") {
        UI = compileUI(UI, this.options, t);
        await writeFile("api-doc.html", UI);
        console.log(`Open api-doc.html to view the rendered routes in UI`);
      }
      if (this.options?.displayRoutes === "HTTP") {
        await writeFile("api-doc.http", t);
        console.log(
          `Check ./api-doc.http to test the routes Visual Studio rest client extension`
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
    console.log(
      `\nListening on http://localhost:${this.options?.port || 8080}/`
    );
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { AppCTX, JetSchema } from "./primitives/types.js";
