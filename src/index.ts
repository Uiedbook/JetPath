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
import { type jetOptions, type methods } from "./primitives/types.js";
import { JetPlugin } from "./primitives/classes.js";

export class JetPath {
  public server: any;
  private listening: boolean = false;
  private options: jetOptions;
  private plugs: JetPlugin[] = [];
  constructor(options?: jetOptions) {
    this.options = options || {
      APIdisplay: "UI",
    };
    // ? setting up app configs
    for (const [k, v] of Object.entries(this.options)) {
      _JetPath_app_config.set(k, v);
    }
    if (!options?.cors) {
      _JetPath_app_config.set("cors", true);
    }
  }
  use(plugin: JetPlugin): void {
    if (this.listening) {
      throw new Error("Your app is listening new plugins can't be added.");
    }
    if (plugin instanceof JetPlugin) {
      this.plugs.push(plugin);
    } else {
      console.log(plugin);
      throw Error("invalid Jetpath plugin");
    }
  }
  async listen(): Promise<void> {
    // ? kickoff server
    this.server = UTILS.server(this.plugs);
    // ? {-view-} here is replaced at build time to html
    let UI = `{{view}}`;
    // ? setting up static server
    if (this.options?.static?.route && this.options?.static?.dir) {
      _JetPath_paths["GET"][this.options.static.route + "/*"] = async (ctx) => {
        const fileName =
          this.options?.static?.dir +
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
          return ctx.sendStream(fileName, contentType!);
        } else {
          return ctx.throw();
        }
      };
    }

    //? settingup api viewer
    if (
      typeof this.options !== "object" ||
      this.options?.APIdisplay !== false
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
              this.options?.APIdisplay === "UI"
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
            if (this.options.APIdisplay) {
              t += api;
            } else {
              console.log(api);
            }
            c += 1;
          }
        }
      }

      if (this.options?.APIdisplay === "UI") {
        UI = compileUI(UI, this.options, t);
        _JetPath_paths["GET"][this.options?.apiDoc?.path || "/api-doc"] = (
          ctx
        ) => {
          ctx.send(UI, "text/html");
        };
        console.log(
          `visit http://localhost:${this.options?.port || 8080}${
            this.options?.apiDoc?.path || "/api-doc"
          } to see the displayed routes in UI`
        );
      }
      if (this.options?.APIdisplay === "HTTP") {
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
    // ? listening
    this.listening = true;
    console.log(
      `\nListening on http://localhost:${this.options?.port || 8080}/`
    );
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { Context, JetSchema } from "./primitives/types.js";
export { JetPlugin } from "./primitives/classes.js";
