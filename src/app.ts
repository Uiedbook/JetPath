import { opendir } from "node:fs/promises";
import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { AppCTXType, methods } from "./types";
import { Stream } from "node:stream";
import { corsHooker } from "./cor";
import { URLSearchParams } from "node:url";
import path from "node:path";
import { cwd } from "node:process";

// import { dirname } from "path";
// import { fileURLToPath } from "url";
// const _dirname = dirname(fileURLToPath(import.meta.url));

export let _JetPath_paths: Record<
  methods,
  Record<string, (ctx: AppCTXType) => void | Promise<void>>
> = {
  GET: {},
  POST: {},
  HEAD: {},
  PUT: {},
  PATCH: {},
  DELETE: {},
  OPTIONS: undefined as any,
};
export const _JetPath_hooks: Record<
  string,
  (ctx: AppCTXType) => void | Promise<void>
> = {
  PRE: true as any,
  POST: true as any,
  ERROR: true as any,
};
const doneError = new Error("done");
export const _JetPath_app_config = {
  cors: undefined as unknown as (ctx: AppCTXType) => boolean,
  set(this: any, opt: string, val: any) {
    if (opt === "cors" && val) {
      this.cors = corsHooker({
        exposeHeaders: "",
        allowMethods: "",
        allowHeaders: "",
        maxAge: "",
        keepHeadersOnError: undefined,
        origin: function (arg0: any) {
          throw new Error("Function not implemented.");
        },
        credentials: function (arg0: any) {
          throw new Error("Function not implemented.");
        },
        secureContext: false,
        privateNetworkAccess: undefined,
        ...(typeof val === "object" ? val : {}),
      }) as any;
      if (Array.isArray(val["allowMethods"])) {
        _JetPath_paths = {} as any;
        for (const med of val["allowMethods"]) {
          _JetPath_paths[med.toUpperCase() as "GET"] = {};
        }
      }
      return;
    }
    this[opt] = val;
  },
};

function createCTX(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) {
  let load: unknown,
    code = 200;
  const ctx: AppCTXType = {
    request: req,
    body: null,
    reply(data: unknown) {
      let contentType = "text/plain";
      switch (typeof data) {
        case "string":
          contentType = "text/plain";
          load = data;
          break;
        case "object":
          if (data === null) {
            contentType = "text/plain";
            load = "null";
          } else if (Array.isArray(data)) {
            contentType = "application/json";
            load = JSON.stringify(data);
          } else {
            contentType = "application/json";
            load = JSON.stringify(data);
          }
          break;
        case "boolean":
          contentType = "text/plain";
          load = data.toString();
          break;
        case "number":
          contentType = "text/plain";
          load = data.toString();
          break;
        default:
          contentType = "text/plain";
          load = (data as any).toString();
          break;
      }
      res.writeHead(code, { "Content-Type": contentType });
      throw doneError;
    },
    redirect(url: string) {
      res.writeHead(301, { Location: url });
      load = undefined;
      throw doneError;
    },
    throw(code: number = 404, message: string = "Not FOund") {
      res.writeHead(code, { "Content-Type": "text/plain" });
      res.statusCode = code;
      load = String(message);
      throw doneError;
    },
    code(statusCode?: number) {
      if (statusCode) {
        code = statusCode;
        res.statusCode = statusCode;
      }
      return code;
    },
    method: req.method!,
    get(field: string) {
      if (field) {
        return req.headers[field] as string;
      }
      return undefined;
    },
    set(field: string, value: string) {
      if (field && value) {
        res.setHeader(field, value);
      }
    },
    pipe(stream: Stream, ContentDisposition: string) {
      res.setHeader("Content-Disposition", ContentDisposition);
      stream.pipe(res);
    },
    json() {
      return new Promise<Record<string, any>>((r) => {
        let body = "";
        req.on("data", (data: { toString: () => string }) => {
          body += data.toString();
        });
        req.on("end", () => {
          const data = JSON.parse(body || "{}");
          this.body = data;
          r(data);
        });
      });
    },
    text() {
      return new Promise<string>((r) => {
        let body = "";
        req.on("data", (data: { toString: () => string }) => {
          body += data.toString();
        });
        req.on("end", () => {
          r(body);
        });
      });
    },
    _() {
      return load;
    },
    params: undefined as any,
    search: undefined as any,
  };
  return ctx;
}

export const JetPath_app = createServer(
  async (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage> & {
      req: IncomingMessage;
    }
  ) => {
    let routesParams: Record<string, string> = {};
    let searchParams: Record<string, string> = {};
    let r = checker(req.method as methods, req.url!);
    if (r) {
      const ctx = createCTX(req, res);
      if (r.length > 1) {
        [r, routesParams, searchParams] = r as unknown as any[];
        ctx.params = routesParams;
        ctx.search = searchParams;
      }
      try {
        //? pre-request hooks here
        await _JetPath_hooks["PRE"]?.(ctx);
        //? router
        await (r as any)(ctx);
        //? post-request hooks here
        _JetPath_hooks["POST"] && (await (_JetPath_hooks["POST"] as any)(ctx));
        // ? cors header
        if (_JetPath_app_config.cors) {
          _JetPath_app_config.cors(ctx);
        }
        res.end(ctx._());
      } catch (error) {
        //? report error to error hook
        if (String(error).includes("done")) {
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          res.end(ctx._());
        } else {
          try {
            await (_JetPath_hooks["ERROR"] as any)?.(ctx, error);
            if (_JetPath_app_config.cors) {
              _JetPath_app_config.cors(ctx);
            }
            res.end(ctx._());
          } catch (error) {
            res.end(ctx._());
            res.end(ctx._());
          }
        }
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found!");
    }
  }
);

const Handlerspath = (path: any) => {
  if ((path as string).includes("hook__")) {
    return (path as string).split("hook__")[1];
  }
  //? adding /(s) in place
  path = path.split("_");
  const method = path.shift();
  path = "/" + path.join("/");
  //? adding ?(s) in place
  path = path.split("$$");
  path = path.join("/?");
  //? adding :(s) in place
  path = path.split("$");
  path = path.join("/:");
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS)/.test(method)) {
    //? adding methods in place
    return [method, path] as [methods, string];
  }
  return;
};

export async function getHandlers(source: string) {
  source = source || (cwd().split("/").pop() as string);
  const dir = await opendir(source);
  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.endsWith(".js")) {
      const module = await import(path.resolve(source + "/" + dirent.name));
      for (const p in module) {
        const params = Handlerspath(p);
        if (params) {
          if (
            typeof params !== "string" &&
            _JetPath_paths[params[0] as methods]
          ) {
            _JetPath_paths[params[0] as methods][params[1]] = module[p];
          } else {
            if (_JetPath_hooks[params as string]) {
              _JetPath_hooks[params as string] = module[p];
            }
          }
        }
      }
    }
    if (
      dirent.isDirectory() &&
      dirent.name !== "node_modules" &&
      dirent.name !== ".git"
    ) {
      await getHandlers(source + "/" + dirent.name);
    }
  }
}

const checker = (method: methods, url: string) => {
  const routes = _JetPath_paths[method];
  if (routes[url]) {
    return routes[url];
  }
  if (typeof routes === "function") {
    (routes as Function)();
    return;
  }
  //? check for extra / in the route
  if (routes[url + "/"]) {
    return routes[url];
  }
  //? check for search in the route
  if (url.includes("/?")) {
    const sraw = [...new URLSearchParams(url).entries()];
    const search: Record<string, string> = {};
    for (const idx in sraw) {
      search[
        sraw[idx][0].includes("?") ? sraw[idx][0].split("?")[1] : sraw[idx][0]
      ] = sraw[idx][1];
    }
    return [routes[url.split("/?")[0] + "/?"], , search];
  }

  //? place holder route check
  for (const path in routes) {
    if (!path.includes(":")) {
      continue;
    }
    const urlFixtures = url.split("/");
    const pathFixtures = path.split("/");
    //? check for extra / in the route by normalize before checking
    if (url.endsWith("/")) {
      urlFixtures.pop();
    }
    let fixturesX = 0;
    let fixturesY = 0;
    //? length check of / (backslash)
    if (pathFixtures.length === urlFixtures.length) {
      for (let i = 0; i < pathFixtures.length; i++) {
        //? let's jump place holders in the path since we can't determine from them
        //? we increment that we skipped a position because we need the count later
        if (pathFixtures[i].includes(":")) {
          fixturesY++;
          continue;
        }
        //? if it is part of the path then let increment a value for it
        //? we will need it later
        if (urlFixtures[i] === pathFixtures[i]) {
          fixturesX++;
        }
      }
      //? if after the checks it all our count are equal then we got it correctly
      if (fixturesX + fixturesY === pathFixtures.length) {
        const routesParams: Record<string, string> = {};
        for (let i = 0; i < pathFixtures.length; i++) {
          if (pathFixtures[i].includes(":")) {
            routesParams[pathFixtures[i].split(":")[1]] = urlFixtures[i];
          }
        }
        return [routes[path], routesParams];
      }
    }
  }
  return;
};
