// compartible node imports
import { opendir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { createServer } from "node:http";
// type imports
import { IncomingMessage, ServerResponse } from "node:http";
import {
  type Context,
  type JetSchema,
  type allowedMethods,
  type jetOptions,
  type methods,
} from "./types.js";
import { Stream } from "node:stream";
import { createReadStream } from "node:fs";
import { Log, type JetPlugin } from "./classes.js";

/**
 * an inbuilt CORS post hook
 *
 * @param {Object} [options]
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

export function corsHook(options: {
  exposeHeaders?: string[];
  allowMethods?: allowedMethods;
  allowHeaders: string[];
  keepHeadersOnError?: boolean;
  maxAge?: string;
  credentials?: boolean;
  secureContext?: boolean;
  privateNetworkAccess?: any;
  origin: string[];
}): Function {
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

  return function cors(ctx: Context) {
    //? Add Vary header to indicate response varies based on the Origin header
    ctx.set("Vary", "Origin");
    if (options.credentials === true) {
      ctx.set("Access-Control-Allow-Credentials", "true");
    } else {
      //? Simple Cross-Origin Request, Actual Request, and Redirects
      ctx.set("Access-Control-Allow-Origin", options.origin!.join(","));
    }
    if (ctx.request.method !== "OPTIONS") {
      // if (options.exposeHeaders) {
      //   ctx.set(
      //     "Access-Control-Expose-Headers",
      //     options.exposeHeaders.join(",")
      //   );
      // }

      // if (options.secureContext) {
      //   ctx.set("Cross-Origin-Opener-Policy", "unsafe-none");
      //   ctx.set("Cross-Origin-Embedder-Policy", "unsafe-none");
      // }
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
    } else {
      //? Preflight Request

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
        ctx.set("Cross-Origin-Opener-Policy", "same-origin");
        ctx.set("Cross-Origin-Embedder-Policy", "require-corp");
      }

      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
      ctx.code = 204;
    }
  };
}

export const UTILS = {
  wsFuncs: [],
  ctx: {
    app: { body: null },
    request: null as any,
    code: 200,
    send(data: unknown, contentType: string) {
      let ctype;
      switch (typeof data) {
        case "string":
          ctype = "text/plain";
          this._1 = data;
          break;
        case "object":
          ctype = "application/json";
          this._1 = JSON.stringify(data);
          break;
        default:
          ctype = "text/plain";
          this._1 = String(data);
          break;
      }
      if (contentType) {
        ctype = contentType;
      }
      if (!this._2) {
        this._2 = {};
      }
      this._2["Content-Type"] = ctype;
      this._4 = true;
      if (!this._5) throw _DONE;
      this._5();
      return undefined as never;
    },
    redirect(url: string) {
      this.code = 301;
      if (!this._2) {
        this._2 = {};
      }
      this._2["Location"] = url;
      this._1 = undefined;
      this._4 = true;
      if (!this._5) throw _DONE;
      this._5();
      return undefined as never;
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
      if (!this._5) throw _DONE;
      this._5();
      return undefined as never;
    },

    get(field: string) {
      if (field) {
        if (UTILS.runtime["node"]) {
          return this.request.headers[field] as string;
        }
        return (this.request as unknown as Request).headers.get(
          field
        ) as string;
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

    eject() {
      throw _OFF;
    },

    sendStream(stream: Stream | string, ContentType: string) {
      if (!this._2) {
        this._2 = {};
      }
      this._2["Content-Disposition"] = `inline;filename="unnamed.bin"`;
      this._2["Content-Type"] = ContentType;
      if (typeof stream === "string") {
        this._2["Content-Disposition"] = `inline;filename="${stream.split("/").at(-1) || "unnamed.bin"
          }"`;
        if (UTILS.runtime["bun"]) {
          // @ts-ignore
          stream = Bun.file(stream);
        } else {
          stream = createReadStream(stream);
        }
      }
      this._3 = stream as Stream;
      this._4 = true;
      if (!this._5) throw _DONE;
      this._5();
      return undefined as never;
    },
    // TODO: make this working
    // sendReponse(response: Response) {
    //   this._1 = response;
    //   this._4 = true;
    //   if (!this._5) throw _RES;
    //   this._5();
    //   return undefined as never;
    // },

    json<Type = Record<string, any>>(): Promise<Type> {
      // TODO:  calling this function twice cause an request hang in nodejs
      if (!UTILS.runtime["node"]) {
        try {
          return (this.request as unknown as Request).json();
        } catch (error) {
          return {} as Promise<Type>;
        }
      }
      return new Promise<Type>((r) => {
        let body = "";
        this.request.on("data", (data: { toString: () => string }) => {
          body += data.toString();
        });
        this.request.on("end", () => {
          try {
            r(JSON.parse(body));
          } catch (error) {
            r({} as Promise<Type>);
          }
        });
      });
    },

    params: {},
    search: {},
    path: "/",
    //? load
    _1: undefined as any,
    // ? header of response
    _2: {} as any,
    // //? stream
    _3: undefined as any,
    //? used to know if the request has ended
    _4: false,
    //? used to know if the request has been offloaded
    _5: false as any,
    //? response
    // _6: false,
  },
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
  validators: {} as Record<string, JetSchema>,
  server(plugs: JetPlugin[]): { listen: any } | void {
    let server;
    let serverelse;
    if (UTILS.runtime["node"]) {
      server = createServer((x: any, y: any) => {
        JetPath_app(x, y);
      });
    }
    if (UTILS.runtime["deno"]) {
      server = {
        listen(port: number) {
          // @ts-ignore
          serverelse = Deno.serve({ port: port }, JetPath_app);
        },
      };
    }
    if (UTILS.runtime["bun"]) {
      server = {
        listen(port: number) {
          // @ts-ignore
          serverelse = Bun.serve({
            port,
            fetch: JetPath_app,
            // TODO make this working with plugins
            // websocket: () => {
            // UTILS.wsFuncs;
            // },
          });
        },
      };
    }
    for (let i = 0; i < plugs.length; i++) {
      const decorations = plugs[i]._setup({
        server: (!UTILS.runtime["node"] ? serverelse! : server!) as any,
        runtime: UTILS.runtime as any,
        routesObject: _JetPath_paths,
      });
      if (typeof decorations === "object") {
        for (const key in decorations) {
          if (!(UTILS.ctx.app as any)[key]) {
            (UTILS.ctx.app as any)[key] = decorations[key].bind(UTILS.ctx);
          }
        }
      }
    }
    return server!;
  },
};
// ? setting up the runtime check
UTILS.set();

export let _JetPath_paths: Record<
  methods,
  Record<string, (ctx: Context) => void | Promise<void>>
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
  (ctx: Context) => void | Promise<void>
> = {};

class JetPathErrors extends Error {
  constructor(message: string) {
    super(message);
  }
}

const _DONE = new JetPathErrors("done");
const _OFF = new JetPathErrors("off");
// const _RES = new JetPathErrors("respond");

export const _JetPath_app_config = {
  cors: false as unknown as (ctx: Context) => void,
  set(this: any, opt: string, val: any) {
    if (opt === "cors" && val !== false) {
      this.cors = corsHook({
        exposeHeaders: [],
        allowMethods: [],
        allowHeaders: ["*"],
        maxAge: "",
        keepHeadersOnError: true,
        secureContext: false,
        privateNetworkAccess: false,
        origin: ["*"],
        credentials: undefined,
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

const createCTX = (req: IncomingMessage): Context => {
  const ctx: Context = Object.create(UTILS.ctx);
  ctx.request = req;
  return ctx;
};

const createResponse = (
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
  ctx: Context,
  four04?: boolean
) => {
  //? add cors headers
  _JetPath_app_config.cors(ctx);
  if (!UTILS.runtime["node"]) {
    if (ctx?.code === 301 && ctx._2?.["Location"]) {
      return Response.redirect(ctx._2?.["Location"]);
    }
    if (ctx?._3) {
      return new Response(ctx?._3 as unknown as BodyInit, {
        status: 200,
        headers: ctx?._2,
      });
    }
    return new Response(ctx?._1 || (four04 ? "Not found" : undefined), {
      status: ctx?.code || 404,
      headers: ctx?._2,
    });
  }
  if (ctx?._3) {
    res.writeHead(ctx?.code, ctx?._2 || { "Content-Type": "text/plain" });
    return ctx._3.pipe(res);
  }
  res.writeHead(ctx?.code, ctx?._2 || { "Content-Type": "text/plain" });
  res.end(ctx?._1 || (four04 ? "Not found" : undefined));
};

const JetPath_app = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  const paseredR = URLPARSER(req.method as methods, req.url!);
  let off = false;
  let ctx;
  if (paseredR) {
    ctx = createCTX(req);
    const r = paseredR[0];
    ctx.params = paseredR[1] as any;
    ctx.search = paseredR[2] as any;
    ctx.path = paseredR[3] as any;
    try {
      //? pre-request hooks here
      await _JetPath_hooks["PRE"]?.(ctx);
      //? route handler call
      await (r as any)(ctx);
      //? post-request hooks here
      await _JetPath_hooks["POST"]?.(ctx);
      return createResponse(res, ctx);
    } catch (error) {
      if (error instanceof JetPathErrors) {
        if (error.message !== "off") {
          return createResponse(res, ctx);
        } else {
          off = true;
        }
      } else {
        //? report error to error hook
        try {
          // @ts-ignore
          await _JetPath_hooks["ERROR"]?.(ctx, error);
          //! if expose headers on error is set
          //! false remove this line so the last return will take effect;
          return createResponse(res, ctx);
        } catch (error) {
          return createResponse(res, ctx);
        }
      }
    }
  }
  if (!off) {
    return createResponse(res, createCTX(req), true);
  } else {
    return new Promise((r) => {
      // @ts-ignore
      ctx!._5 = () => {
        r(createResponse(res, ctx!, true));
      };
    });
  }
};

const Handlerspath = (path: any) => {
  if ((path as string).includes("hook__")) {
    //? hooks in place
    return (path as string).split("hook__")[1];
  }
  //? adding /(s) in place
  path = path.split("_");
  const method = path.shift();
  path = "/" + path.join("/");
  //? adding ?(s) in place
  path = path.split("$$");
  path = path.join("/?");
  //? adding * in place
  path = path.split("$0");
  path = path.join("/*");
  //? adding :(s) in place
  path = path.split("$");
  path = path.join("/:");
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS|BODY)/.test(method)) {
    //? adding methods in place
    return [method, path] as [methods, string];
  }
  return;
};
const getModule = async (src: string, name: string) => {
  try {
    const mod = await import(path.resolve(src + "/" + name));
    return mod;
  } catch (error) {
    if (name.includes(".jet.js")) {
      Log.error(
        "An error occured in the file " + src + "/" + name + " \n" + String(error) + " \n"
      );
    }
    return;
  }
};
export async function getHandlers(source: string, print: boolean, errorsCount = 0) {
  source = source || cwd();
  source = path.resolve(cwd(), source);
  const dir = await opendir(source);
  for await (const dirent of dir) {
    if (dirent.isFile() && dirent.name.endsWith(".jet.js")) {
      if (print) {
        Log.info("Loading routes at " + source + "/" + dirent.name);
      }
      try {
        const module = await getModule(source, dirent.name);
        if (module) {

          for (const p in module) {
            const params = Handlerspath(p);
            if (params) {
              // ! BODY parser
              if ((params[0] as any) === "BODY") {
                const validator = module[p];
                if (typeof validator === "object") {
                  UTILS.validators[params[1]] = validator as JetSchema;
                  validator.validate = (data: any = {}) =>
                    validate(validator, data);
                }
              } else {
                // ! HTTP handler
                if (
                  typeof params !== "string" &&
                  _JetPath_paths[params[0] as methods]
                ) {
                  _JetPath_paths[params[0] as methods][params[1]] = module[p];
                } else {
                  if ("POST-PRE-ERROR".includes(params as string)) {
                    _JetPath_hooks[params as string] = module[p];
                  }
                }
              }
            }
          }
        } else {
          // record errors
          errorsCount = errorsCount + 1
        }
      } catch (error) {
        if (dirent.name.endsWith(".jet.js")) {
          Log.error(
            "An error occured in the file " + dirent.name + " \n" + String(error) + " \n"
          );
        }
      }
    }
    if (
      dirent.isDirectory() &&
      dirent.name !== "node_modules" &&
      dirent.name !== ".git"
    ) {
      await getHandlers(source + "/" + dirent.name, print, errorsCount);
    }
  }
  return errorsCount
}

export function validate(schema: JetSchema, data: any) {
  const out: Record<string, any> = {};
  let errout: string = "";
  if (!data) throw new Error("invalid data => " + data);
  if (!schema) throw new Error("invalid schema => " + schema);
  for (const [prop, value] of Object.entries(schema.body || {})) {
    const { err, type, nullable, RegExp, validator } = value;
    if (!data[prop] && nullable) {
      continue;
    }
    if (data[prop] === undefined && !nullable) {
      errout = err || `${prop} is required`;
      continue;
    }
    if (validator) {
      const v = validator(data[prop]) as any;
      if (v !== true) {
        errout = err || typeof v === "string" ? v : `${prop} must is invalid`;
      }
      continue;
    }
    if (typeof RegExp === "object" && !RegExp.test(data[prop])) {
      errout = err || `${prop} must is invalid`;
      continue;
    }

    out[prop] = data[prop];

    if (type) {
      if (typeof type === "function") {
        if (typeof type(data[prop]) !== typeof type()) {
          if (err) {
            errout = err;
          } else {
            errout = `${prop} type is invalid '${data[prop]}' `;
          }
          continue;
        }
        out[prop] = type(data[prop]);
      }
      if (typeof type === "string" && type !== typeof data[prop]) {
        if (type !== "file") {
          errout = err || `${prop} type is invalid '${data[prop]}' `;
        }
      }
      //
      continue;
    }
  }
  if (errout) throw new Error(errout);
  return out;
}

const URLPARSER = (method: methods, url: string) => {
  const routes = _JetPath_paths[method];
  if (!UTILS.runtime["node"]) {
    url = url.slice(url.indexOf("/", 7));
  }
  if (routes[url]) {
    return [routes[url], {}, {}, url];
  }
  const search: Record<string, string> = {},
    params: Record<string, string> = {};
  let path: string | undefined, handler: Function | undefined;
  //? place holder & * route checks
  for (const pathR in routes) {
    // ? /* check
    if (pathR.includes("*")) {
      const Ried = pathR.slice(0, pathR.length - 1);
      if (url.includes(Ried)) {
        (params as any).extraPath = url.slice(Ried.length);
        path = pathR;
        //? set path and handler
        handler = routes[path];
        break;
      }
    }
    // ? placeholder /: check
    if (pathR.includes(":")) {
      const urlFixtures = url.split("/");
      const pathFixtures = pathR.split("/");
      let fixtures = 0;
      for (let i = 0; i < pathFixtures.length; i++) {
        //? let's jump place holders in the pathR since we can't determine from them
        //? we increment that we skipped a position because we need the count later
        if (pathFixtures[i].includes(":")) {
          fixtures++;
          continue;
        }
        //? if it is part of the pathR then let increment a value for it
        //? we will need it later
        if (urlFixtures[i] === pathFixtures[i]) {
          fixtures++;
        }
      }
      //? if after the checks it all our count are equal then we got it correctly
      if (fixtures === pathFixtures.length) {
        for (let i = 0; i < pathFixtures.length; i++) {
          const px = pathFixtures[i];
          if (px.includes(":")) {
            params[px.split(":")[1]] = urlFixtures[i];
          }
        }
        path = pathR;
        //? set path and handler
        handler = routes[path];
        break;
      }
    }
  }
  //? check for search in the route
  if (url.includes("/?")) {
    path = url.split("/?")[0] + "/?";
    const sraw = url.slice(path.length).split("=");
    for (let s = 0; s < sraw.length; s = s + 2) {
      search[sraw[s]] = sraw[s + 1];
    }
    if (routes[path]) {
      handler = routes[path];
    }
  }
  if (handler) {
    return [handler, params, search, path];
  }
};

export const compileUI = (UI: string, options: any, api: string) => {
  // ? global headers
  const globalHeaders = JSON.stringify(
    options?.globalHeaders || {
      Authorization: "Bearer ****",
    }
  );
  return UI.replace("'{JETPATH}'", `\`${api}\``)
    .replaceAll("{JETPATHGH}", `${globalHeaders}`)
    .replaceAll("{NAME}", options?.documentation?.name || "JethPath API Doc")
    .replaceAll("JETPATHCOLOR", options?.documentation?.color || "#007bff")
    .replaceAll(
      "{LOGO}",
      options?.documentation?.logo ||
      "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp"
    )
    .replaceAll(
      "{INFO}",
      options?.documentation?.info || "This is a JethPath api preview."
    );
};

// TODO: SORT THE API
export const compileAPI = (options: jetOptions): [number, string] => {
  let handlersCount = 0;
  let compiledAPIArray: string[] = [];
  let compiledRoutes: string[] = [];
  // ? global headers
  const globalHeaders = options?.globalHeaders || {};
  // ? loop through apis
  for (const method in _JetPath_paths) {
    // ? Retrieve api info;
    const routesOfMethod = _JetPath_paths[method as methods];
    if (routesOfMethod && Object.keys(routesOfMethod).length) {
      for (const route in routesOfMethod) {
        // ? Retrieve api BODY object
        const validator = UTILS.validators[route] || {};
        // ? Retrieve api body definitions
        const body = validator?.body || {};
        // ? Retrieve api headers definitions
        const inialHeader = {};
        Object.assign(inialHeader, validator?.headers || {}, globalHeaders);
        const headers = [];
        // ? parse headers
        for (const name in inialHeader) {
          headers.push(name + ":" + inialHeader[name as keyof typeof inialHeader]);
        }
        // ? parse body
        const bodyData: Record<string, any> = {};
        if (body) {
          for (const keyOfBody in body) {
            bodyData[keyOfBody] =
              (body[keyOfBody as keyof typeof body] as any)?.defaultValue ||
              (body[keyOfBody as keyof typeof body] as any)?.inputType ||
              "text";
          }
        }
        // ? combine api infos into .http formart
        const api = `\n
${method} ${options?.APIdisplay === "UI"
            ? "[--host--]"
            : "http://localhost:" + (options?.port || 8080)
          }${route} HTTP/1.1
${headers.length ? headers.join("\n") : ""}\n
${validator && (validator.method === method && method !== "GET" ? method : "") ? JSON.stringify(bodyData) : ""}\n${validator && (validator.method === method ? method : "") && validator?.["info"]
            ? "#" + validator?.["info"] + "-JETE"
            : ""
          }
###`;
        // ? combine api(s) 
        const low = sorted_insert(compiledRoutes, route);
        compiledRoutes.splice(low, 0, route);
        compiledAPIArray.splice(low, 0, api);
        // ? increment handler count
        handlersCount += 1;
      }
    }
  }
  // sort and join here

  const compileAPIString = compiledAPIArray.join("");
  return [handlersCount, compileAPIString];
};




const sorted_insert = (paths: string[], path: string): number => {
  let low = 0;
  let high = paths.length - 1;
  for (; low <= high;) {
    const mid = Math.floor((low + high) / 2);
    const current = paths[mid];
    if (current < path) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
};