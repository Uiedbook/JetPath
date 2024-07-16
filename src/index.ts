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
import { JetPlugin, Log } from "./primitives/classes.js";

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
          // @ts-expect-error
          decodeURI(ctx.params?.["extraPath"] || "").split("?")[0];
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
      _JetPath_paths["GET"][this.options.static.route + "/*"].config = {
        method: "GET",
        path: this.options.static.route + "/*",
      };
    }

    //? setting up api viewer
    if (this.options?.APIdisplay !== undefined) {
      Log.info("Compiling...");
      const startTime = performance.now();
      // ? Load all jetpath functions described in user code
      const errorsCount = await getHandlers(this.options?.source!, true);
      const endTime = performance.now();
      Log.info("Done.");
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
        Log.success(
          `visit http://localhost:${this.options?.port || 8080}${
            this.options?.apiDoc?.path || "/api-doc"
          } to see the displayed routes in UI`
        );
      }
      // ? render API in a .HTTP file
      if (this.options?.APIdisplay === "HTTP") {
        await writeFile("api-doc.http", compiledAPI);
        Log.success(
          `Check http file ./api-doc.http to test the routes Visual Studio rest client extension`
        );
      }
      Log.info(
        `Parsed ${handlersCount} handlers in ${Math.round(
          endTime - startTime
        )} milliseconds`
      );
      if (errorsCount) {
        Log.error(
          `\nReport: ${errorsCount} files was not loaded due to errors: please resolve!`
        );
      }
    } else {
      // ? Load all jetpath functions described in user code
      const errorsCount = await getHandlers(this.options?.source!, false);
      if (errorsCount) {
        Log.error(
          `\nReport: ${errorsCount} files was not loaded due to errors: please resolve!`
        );
      }
    }
    Log.success(`Listening on http://localhost:${this.options?.port || 8080}`);
    // ? start server
    this.listening = true;
    this.server.listen(this.options?.port || 8080);
  }
}

//? exports
export type { Context, JetFunc } from "./primitives/types.js";
export { JetPlugin } from "./primitives/classes.js";
