import { opendir } from "node:fs/promises";
import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { AppCTXType, methods } from "./types";
import { Stream } from "node:stream";
import { corsHooker } from "./cor";
import { URLSearchParams } from "node:url";
import path from "node:path";
import { cwd } from "node:process";

const avoidErr = (cb: { (): any; (): any; (): void }) => {
  try {
    cb();
    return true;
  } catch (error) {
    return false;
  }
};

const getRutime = () => {
  // @ts-ignore
  const bun = avoidErr(() => Bun);
  // @ts-ignore
  const deno = avoidErr(() => Deno);
  const node = !bun && !deno;
  return { bun, deno, node };
};

const runtime = getRutime();
export let JetPath_server = { listen(port: number) {} };
if (runtime.node) {
  JetPath_server = createServer((x, y) => {
    JetPath_app(x, y);
  });
  // @ts-ignore
  // JetPath_server.on("error", (e) => {
  //   if ((e as any).code === "EADDRINUSE") {
  //     console.log("Address in use, retrying...");
  //     setTimeout(() => {
  //       // @ts-ignore
  //       JetPath_server.close();
  //       // @ts-ignore
  //       JetPath_server.listen(port);
  //     }, 1000);
  //   }
  // });
}
if (runtime.deno) {
  JetPath_server = {
    listen(port) {
      // @ts-ignore
      Deno.serve({ port: port }, JetPath_app);
    },
  };
}
if (runtime.bun) {
  JetPath_server = {
    listen(port) {
      // @ts-ignore
      Bun.serve({ port, fetch: JetPath_app });
    },
  };
}

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
  OPTIONS: {},
};
export const _JetPath_hooks: Record<
  string,
  (ctx: AppCTXType) => void | Promise<void>
> = {
  PRE: true as any,
  POST: true as any,
  ERROR: true as any,
};
const errDone = new Error("done");
export const _JetPath_app_config = {
  cors: undefined as unknown as (ctx: AppCTXType) => void,
  set(this: any, opt: string, val: any) {
    if (opt === "cors" && val) {
      this.cors = corsHooker({
        exposeHeaders: "",
        allowMethods: "",
        allowHeaders: "",
        maxAge: "",
        keepHeadersOnError: true,
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

const createCTX = (req: IncomingMessage): AppCTXType => ({
  request: req,
  body: null,
  statusCode: 200,
  method: req.method!,
  reply(data: unknown, contentType = "text/plain") {
    switch (typeof data) {
      case "string":
        contentType = "text/plain";
        this._1 = data;
        break;
      case "object":
        contentType = "application/json";
        this._1 = JSON.stringify(data);
        break;
      default:
        contentType = "text/plain";
        this._1 = String(data);
        break;
    }
    this._2["Content-Type"] = contentType;
    throw errDone;
  },
  redirect(url: string) {
    this.statusCode = 301;
    this._2["Location"] = url;
    this._1 = undefined;
    throw errDone;
  },
  throw(code: number = 404, message: string = "Not Found") {
    this._2["Content-Type"] = "text/plain";
    if (typeof code === "string") {
      message = code;
      code = 400;
    }
    this.statusCode = code;
    this._1 = String(message);
    throw errDone;
  },
  get(field: string) {
    if (field) {
      return req.headers[field] as string;
    }
    return undefined;
  },

  set(field: string, value: string) {
    if (field && value) {
      this._2[field] = value;
    }
  },

  pipe(stream: Stream, ContentDisposition: string) {
    this._2["Content-Disposition"] = ContentDisposition;
    this._3 = stream;
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
  //? load
  _1: undefined,
  //? header
  _2: {},
  //? stream
  _3: undefined,
  params: {},
  search: {},
});

const createResponse = (
  ctx: AppCTXType | undefined = undefined,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  if (!runtime.node) {
    if (ctx?.statusCode === 301 && ctx._2["Location"]) {
      return Response.redirect(ctx._2["Location"]);
    }
    return new Response(ctx?._1 || "Not found!", {
      status: ctx?.statusCode || 404,
      headers: ctx?._2 || {},
    });
  }
  res.writeHead(
    ctx?.statusCode || 404,
    ctx?._2 || { "Content-Type": "text/plain" }
  );
  res.end(ctx?._1 || "Not found!");
  return undefined;
};

const JetPath_app = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  let routesParams: Record<string, string> = {};
  let searchParams: Record<string, string> = {};
  let r = checker(req.method as methods, req.url!);
  if (r) {
    const ctx = createCTX(req); //? no closures more efficient
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
      !ctx._1 && ctx._3 && ctx._3.pipe(res);
      return createResponse(ctx, res);
    } catch (error) {
      //? report error to error hook
      if (String(error).includes("done")) {
        if (_JetPath_app_config.cors) {
          _JetPath_app_config.cors(ctx);
        }
        return createResponse(ctx, res);
      } else {
        try {
          await (_JetPath_hooks["ERROR"] as any)?.(ctx, error);
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(ctx, res);
        } catch (error) {
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(ctx, res);
        }
      }
    }
  } else {
    return createResponse(undefined, res);
  }
};

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
  source = source || cwd();
  source = path.resolve(cwd(), source);
  console.log("JetPath: " + source);
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
  if (url[0] !== "/") {
    url = url.slice(url.indexOf("/", 7));
  }
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
