import mime from "mime/lite";

import { access, writeFile } from "node:fs/promises";
import {
  _JetPath_app_config,
  _JetPath_hooks,
  _JetPath_paths,
  compileAPI,
  compileUI,
  getHandlers,
  UTILS,
} from "./primitives/functions.js";
import { type jetOptions } from "./primitives/types.js";
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

    //? setting up api viewer
    if (
      typeof this.options !== "object" ||
      this.options?.APIdisplay !== false
    ) {
      console.log("JetPath: compiling...");
      const startTime = performance.now();
      // ? Load all jetpath functions described in user code
      await getHandlers(this.options?.source!, true);
      const endTime = performance.now();
      console.log("JetPath: done.");
      //? compile API
      const [handlersCount, compiledAPI] = compileAPI(this.options);
      // ? render API in UI
      if (this.options?.APIdisplay === "UI") {
        UI = compileUI(UI, this.options, compiledAPI);
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
      // ? render API in a .HTTP file
      if (this.options?.APIdisplay === "HTTP") {
        await writeFile("api-doc.http", compiledAPI);
        console.log(
          `Check ./api-doc.http to test the routes Visual Studio rest client extension`
        );
      }
      console.log(
        `\n Parsed ${handlersCount} handlers in ${Math.round(
          endTime - startTime
        )} milliseconds`
      );
    } else {
      // ? Load all jetpath functions described in user code
      await getHandlers(this.options?.source!, false);
    }
    console.log(
      `\nListening on http://localhost:${this.options?.port || 8080}/`
    );
    // ? start server
    this.listening = true;
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { Context, JetSchema } from "./primitives/types.js";
export { JetPlugin } from "./primitives/classes.js";
