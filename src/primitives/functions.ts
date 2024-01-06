// compartible node imports
import { opendir } from "node:fs/promises";
import { URLSearchParams } from "node:url";
import path from "node:path";
import { cwd } from "node:process";
import { createServer } from "node:http";
// type imports
import { IncomingMessage, ServerResponse } from "node:http";
import { AppCTXType, allowedMethods, methods } from "../types";

/**
 * an inbuilt CORS post hook
 *
 * @param {Object} [_options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 *  - {Boolean} secureContext `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` headers.', default is false
 *    @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
 *  - {Boolean} privateNetworkAccess handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`, default to false
 *    @see https://wicg.github.io/private-network-access/
 * @return {Function} cors post hook
 * @public
 */

export function corsHook(_options: {
  exposeHeaders?: string[];
  allowMethods?: allowedMethods;
  allowHeaders: string[];
  keepHeadersOnError?: boolean;
  maxAge?: string;
  credentials?: boolean;
  secureContext?: boolean;
  privateNetworkAccess?: any;
  origin?: string;
}): Function {
  const options: typeof _options = {
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    origin: "*",
    secureContext: false,
    keepHeadersOnError: false,
    allowHeaders: [],
  };

  for (const key in _options) {
    if (_options.hasOwnProperty(key)) {
      options[key as keyof typeof _options] =
        _options[key as keyof typeof _options];
    }
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(
      ","
    ) as unknown as methods[];
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.keepHeadersOnError =
    options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return function cors(ctx: AppCTXType) {
    let credentials = options.credentials;
    const headersSet: Record<string, string> = {};

    function set(key: string, value: string) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== "OPTIONS") {
      //? Simple Cross-Origin Request, Actual Request, and Redirects
      set("Access-Control-Allow-Origin", options.origin!);

      //? Add Vary header to indicate response varies based on the Origin header
      set("Vary", "Origin");
      if (credentials === true) {
        set("Access-Control-Allow-Credentials", "true");
      }

      if (options.exposeHeaders) {
        set("Access-Control-Expose-Headers", options.exposeHeaders.join(","));
      }

      if (options.secureContext) {
        set("Cross-Origin-Opener-Policy", "same-origin");
        set("Cross-Origin-Embedder-Policy", "require-corp");
      }
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
    } else {
      //? Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get("Access-Control-Request-Method")) {
        // this not preflight request, ignore it
        return;
      }

      ctx.set("Access-Control-Allow-Origin", options.origin!);

      if (credentials === true) {
        ctx.set("Access-Control-Allow-Credentials", "true");
      }

      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", options.maxAge);
      }

      if (
        options.privateNetworkAccess &&
        ctx.get("Access-Control-Request-Private-Network")
      ) {
        ctx.set("Access-Control-Allow-Private-Network", "true");
      }

      if (options.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", options.allowMethods.join(","));
      }

      if (options.secureContext) {
        set("Cross-Origin-Opener-Policy", "same-origin");
        set("Cross-Origin-Embedder-Policy", "require-corp");
      }

      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
      ctx.code = 204;
    }
  };
}

export const UTILS = {
  ae(cb: { (): any; (): any; (): void }) {
    try {
      cb();
      return true;
    } catch (error) {
      return false;
    }
  },
  set() {
    // @ts-ignore
    const bun = UTILS.ae(() => Bun);
    // @ts-ignore
    const deno = UTILS.ae(() => Deno);
    this.runtime = { bun, deno, node: !bun && !deno };
  },
  runtime: null as unknown as Record<string, boolean>,
  decorators: {},
  server(): { listen: any } | void {
    if (UTILS.runtime.node) {
      return createServer((x, y) => {
        JetPath_app(x, y);
      });
    }
    if (UTILS.runtime.deno) {
      return {
        listen(port: number) {
          // @ts-ignore
          Deno.serve({ port: port }, JetPath_app);
        },
      };
    }
    if (UTILS.runtime.bun) {
      return {
        listen(port: number) {
          // @ts-ignore
          Bun.serve({ port, fetch: JetPath_app });
        },
      };
    }
  },
};
// ? setting up the runtime check
UTILS.set();

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
  PRE: false as any,
  POST: false as any,
  ERROR: false as any,
};

class JetPathErrors extends Error {
  constructor(message: string = "done") {
    super(message);
  }
}

const errDone = new JetPathErrors();

export const _JetPath_app_config = {
  cors: undefined as unknown as (ctx: AppCTXType) => void,
  set(this: any, opt: string, val: any) {
    if (opt === "cors" && val) {
      this.cors = corsHook({
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

const createCTX = (
  req: IncomingMessage,
  decorationObject: Record<string, Function> = {}
): AppCTXType => ({
  request: req,
  // body: null,
  code: 200,
  method: req.method!,
  reply(data: unknown, contentType: string) {
    switch (typeof data) {
      case "string":
        contentType = !contentType ? "text/plain" : contentType;
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
    if (!this._2) {
      this._2 = {};
      this._2["Content-Type"] = contentType;
    }
    this._4 = true;
    throw errDone;
  },
  redirect(url: string) {
    this.code = 301;
    if (!this._2) {
      this._2 = {};
      this._2["Location"] = url;
    }
    this._1 = undefined;
    this._4 = true;
    throw errDone;
  },
  throw(code: unknown = 404, message: unknown = "Not Found") {
    // ? could be a success but a wrong throw, so we check
    if (!this._2) {
      this._2 = {};
    }
    if (!this._4) {
      this.code = 400;
      switch (typeof code) {
        case "number":
          this.code = code;
          if (typeof message === "object") {
            this._2["Content-Type"] = "application/json";
            this._1 = JSON.stringify(message);
          } else if (typeof message === "string") {
            this._2["Content-Type"] = "text/plain";
            this._1 = message;
          }
          break;
        case "string":
          this._2["Content-Type"] = "text/plain";
          this._1 = code;
          break;
        case "object":
          this._2["Content-Type"] = "application/json";
          this._1 = JSON.stringify(code);
          break;
      }
    }
    this._4 = true;
    throw errDone;
  },
  get(field: string) {
    if (field) {
      return this.request.headers[field] as string;
    }
    return undefined;
  },

  set(field: string, value: string) {
    if (!this._2) {
      this._2 = {};
    }
    if (field && value) {
      this._2[field] = value;
    }
  },

  // pass(field: string, value: unknown) {
  //   if (field && value) {
  //     this.app[field] = value;
  //   }
  // },
  // pipe(stream: Stream, ContentDisposition: string) {
  //   this._2["Content-Disposition"] = ContentDisposition;
  //   this._3 = stream;
  //   this._4 = true;
  //   throw errDone;
  // },
  json<Type = Record<string, any>>(): Promise<Type> {
    if (this.body) {
      return this.body as Promise<Type>;
    }
    if (!UTILS.runtime.node) {
      return (this.request as unknown as Request).json() as Promise<Type>;
    }
    return new Promise<Type>((r) => {
      let body = "";
      this.request.on("data", (data: { toString: () => string }) => {
        body += data.toString();
      });
      this.request.on("end", () => {
        try {
          this.body = JSON.parse(body);
        } catch (error) {}
        r(this.body as Type);
      });
    });
  },
  // text(): Promise<string> {
  //   if (this.body) {
  //     return this.body as Promise<string>;
  //   }
  //   if (!UTILS.runtime.node) {
  //     return (this.request as unknown as Request).text();
  //   }
  //   return new Promise<string>((r) => {
  //     let body = "";
  //     this.request.on("data", (data: { toString: () => string }) => {
  //       body += data.toString();
  //     });
  //     this.request.on("end", () => {
  //       this.body = body;
  //       r(body);
  //     });
  //   });
  // },
  //? load
  // _1: undefined,
  //? header of response
  // _2: {},
  // //? stream
  // _3: undefined,
  //? used to know if the request has ended
  // _4: false,
  // params: {},
  // search: {},
  ...decorationObject,
});

const createResponse = (
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
  ctx?: AppCTXType
) => {
  if (!UTILS.runtime.node) {
    if (ctx?.code === 301 && ctx._2?.Location) {
      return Response.redirect(ctx._2?.Location);
    }
    return new Response(ctx?._1 || "Not found!", {
      status: ctx?.code || 404,
      headers: ctx?._2 || {},
    });
  }
  res.writeHead(ctx?.code || 404, ctx?._2 || { "Content-Type": "text/plain" });
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
    const ctx = createCTX(req, UTILS.decorators); //? no closures, more efficient
    if (r.length > 1) {
      [r, routesParams, searchParams] = r as unknown as any[];
      ctx.params = routesParams;
      ctx.search = searchParams;
    }
    try {
      //? pre-request hooks here
      _JetPath_hooks["PRE"] && (await _JetPath_hooks["PRE"]?.(ctx));
      //? router
      await (r as any)(ctx);
      //? post-request hooks here
      _JetPath_hooks["POST"] && (await _JetPath_hooks["POST"](ctx));
      // ? cors header
      if (_JetPath_app_config.cors) {
        _JetPath_app_config.cors(ctx);
      }
      // ? stream removed for a moment.
      // !ctx._1 && ctx._3 && ctx._3.pipe(res);
      return createResponse(res, ctx);
    } catch (error) {
      //? report error to error hook
      if (error instanceof JetPathErrors) {
        if (_JetPath_app_config.cors) {
          _JetPath_app_config.cors(ctx);
        }
        return createResponse(res, ctx);
      } else {
        try {
          _JetPath_hooks["ERROR"] &&
            (await (
              _JetPath_hooks["ERROR"] as (
                k: AppCTXType,
                v: unknown
              ) => Promise<any>
            )(ctx, error));
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(res, ctx);
        } catch (error) {
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(res, ctx);
        }
      }
    }
  } else {
    if (_JetPath_app_config.cors || req.method === "OPTIONS") {
      const ctx = createCTX(req); //? no closures more efficient
      _JetPath_app_config.cors(ctx);
      return createResponse(res, ctx);
    }
    return createResponse(res);
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

export async function getHandlers(source: string, print: boolean) {
  source = source || cwd();
  source = path.resolve(cwd(), source);
  if (print) {
    console.log("JetPath: " + source);
  }
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
            if ((_JetPath_hooks[params as string] as any) === false) {
              _JetPath_hooks[params as string] = module[p];
            } else {
              if (params === "DECORATOR") {
                // ! DECORATOR point
                const decorator = module[p]();
                if (typeof decorator === "object") {
                  UTILS.decorators = Object.assign(UTILS.decorators, decorator);
                }
              }
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
      await getHandlers(source + "/" + dirent.name, print);
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
