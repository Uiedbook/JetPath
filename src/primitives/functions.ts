// compartible node imports
import { opendir } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { createServer } from "node:http";
// type imports
import { type IncomingMessage, type ServerResponse } from "node:http";
import {
  type HTTPBody,
  type JetFunc,
  type allowedMethods,
  type jetOptions,
  type methods,
} from "./types.js";
import { Context, Log, type JetPlugin } from "./classes.js";

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
}): (ctx: Context) => void {
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

    if (ctx.request!.method !== "OPTIONS") {
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
      // options.allowHeaders &&
      //   ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
    } else {
      //? Preflight Request
      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", options.maxAge);
      }
      if (options.privateNetworkAccess) {
        ctx.get("Access-Control-Request-Private-Network") &&
          ctx.set("Access-Control-Allow-Private-Network", "true");
      }
      if (options.allowMethods) {
        ctx.set(
          "Access-Control-Allow-Methods",
          options.allowMethods as unknown as string
        );
      }
      // if (options.secureContext) {
      //   ctx.set("Cross-Origin-Opener-Policy", "same-origin");
      //   ctx.set("Cross-Origin-Embedder-Policy", "require-corp");
      // }
      // ! pre compute the joins here
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
      ctx.code = 204;
    }
  };
}

export const UTILS = {
  // wsFuncs: [],
  ctxPool: [] as Context[],
  hooks: {},
  ae(cb: { (): any; (): any; (): void }) {
    try {
      cb();
      return true;
    } catch (error) {
      return false;
    }
  },
  set() {
    const bun = UTILS.ae(() => Bun);
    // @ts-expect-error
    const deno = UTILS.ae(() => Deno);
    this.runtime = { bun, deno, node: !bun && !deno };
  },
  runtime: null as unknown as Record<string, boolean>,
  // validators: {} as Record<string, JetSchema>,
  server(plugs: JetPlugin[]): { listen: any; edge: boolean } | void {
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
          // @ts-expect-error
          serverelse = Deno.serve({ port: port }, JetPath_app);
        },
        edge: false,
      };
    }
    if (UTILS.runtime["bun"]) {
      server = {
        listen(port: number) {
          serverelse = Bun.serve({
            port,
            // @ts-expect-error
            fetch: JetPath_app,
          });
        },
        edge: false,
      };
    }
    //! likely on the edge
    //! let's see what the plugins has to say

    const decorations: Record<string, any> = {};

    // ? yes a plugin can bring it's own server
    const edgePluginIdx = plugs.findIndex((plug) => plug.hasServer);

    if (edgePluginIdx > -1) {
      const edgePlugin = plugs.splice(edgePluginIdx, 1)[0];
      if (edgePlugin !== undefined && edgePlugin.hasServer) {
        const decs = edgePlugin._setup({
          server: (!UTILS.runtime["node"] ? serverelse! : server!) as any,
          runtime: UTILS.runtime as any,
          routesObject: _JetPath_paths,
          JetPath_app: JetPath_app as any,
        });
        Object.assign(decorations, decs);
        //? setting the jet server from the plugin
        if (edgePlugin.JetPathServer) {
          server = edgePlugin.JetPathServer;
          server.edge = true;
        }
      }
    }

    //? compile plugins
    for (let i = 0; i < plugs.length; i++) {
      const decs = plugs[i]._setup({
        server: !UTILS.runtime["node"] ? serverelse! : server!,
        runtime: UTILS.runtime as any,
        routesObject: _JetPath_paths,
        JetPath_app: JetPath_app as any,
      });
      Object.assign(decorations, decs);
    }
    // ? adding ctx plugin bindings
    for (const key in decorations) {
      if (!(UTILS.hooks as any)[key]) {
        (UTILS.hooks as any)[key] = decorations[key];
      }
    }
    if (!server) {
      const edgeserver = plugs.find(
        (plug) => plug.JetPathServer
      )?.JetPathServer;
      if (edgeserver !== undefined) {
        server = edgeserver;
      }
    }
    return server!;
  },
};
// ? setting up the runtime check
UTILS.set();

export let _JetPath_paths: Record<methods, Record<string, JetFunc>> = {
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
  (ctx: Context, err?: unknown) => void | Promise<void>
> = {};

class JetPathErrors extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const _DONE = new JetPathErrors("done");
export const _OFF = new JetPathErrors("off");
// const _RES = new JetPathErrors("respond");

const createCTX = (
  req: IncomingMessage | Request,
  path: string,
  params?: Record<string, any>,
  search?: Record<string, any>
): Context => {
  if (UTILS.ctxPool.length) {
    const ctx = UTILS.ctxPool.shift()!;
    ctx._7(req as Request, path, params, search);
    return ctx;
  }
  const ctx = new Context();
  // ? add hooks to the app object
  Object.assign(ctx.app, UTILS.hooks);
  ctx._7(req as Request, path, params, search);
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
  _JetPath_hooks["cors"]?.(ctx);
  UTILS.ctxPool.push(ctx);
  // ? prepare response
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
      status: (four04 && 404) || ctx.code,
      headers: ctx?._2,
    });
  }
  if (ctx?._3) {
    res.writeHead(ctx?.code, ctx?._2);
    ctx?._3.on("error", (_err) => {
      res.statusCode;
      res.end("File not found");
    });
    return ctx._3.pipe(res);
  }
  res.writeHead(
    (four04 && 404) || ctx.code,
    ctx?._2 || { "Content-Type": "text/plain" }
  );
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
  let ctx: Context;
  if (paseredR) {
    const r = paseredR[0];
    ctx = createCTX(req, paseredR[3], paseredR[1], paseredR[2]);
    try {
      //? pre-request hooks here
      await _JetPath_hooks["PRE"]?.(ctx);
      //? route handler call
      await r(ctx as any);
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
    if (req.method === "OPTIONS") {
      return createResponse(res, createCTX(req, ""));
    }
    return createResponse(res, createCTX(req, ""), true);
  } else {
    return new Promise((r) => {
      ctx!._5 = () => {
        r(createResponse(res, ctx!));
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
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS)/.test(method)) {
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
    return String(error);
  }
};
export async function getHandlers(
  source: string,
  print: boolean,
  errorsCount: { file: string; error: string }[] | undefined = undefined
) {
  source = source || cwd();
  source = path.resolve(cwd(), source);
  const dir = await opendir(source);
  for await (const dirent of dir) {
    if (
      dirent.isFile() &&
      (dirent.name.endsWith(".jet.js") || dirent.name.endsWith(".jet.ts"))
    ) {
      if (print) {
        Log.info("Loading routes at " + source + "/" + dirent.name);
      }
      try {
        const module = await getModule(source, dirent.name);
        if (typeof module !== "string") {
          for (const p in module) {
            const params = Handlerspath(p);
            if (params) {
              // ! HTTP handler
              if (
                typeof params !== "string"
                // &&
                // _JetPath_paths[params[0] as methods]
              ) {
                // ? set the method
                module[p]!.method = params[0];
                // ? set the path
                module[p]!.path = params[1];
                _JetPath_paths[params[0] as methods][params[1]] = module[
                  p
                ] as JetFunc;
              } else {
                if ("POST-PRE-ERROR".includes(params as string)) {
                  _JetPath_hooks[params as string] = module[p];
                }
              }
            }
          }
        } else {
          // record errors
          if (dirent.name.endsWith(".jet.")) {
            if (!errorsCount) {
              errorsCount = [];
            }
            errorsCount.push({
              file: dirent.path + "/" + dirent.name,
              error: module,
            });
          }
        }
      } catch (error) {
        if (dirent.name.includes(".jet.")) {
          if (!errorsCount) {
            errorsCount = [];
          }
          errorsCount.push({
            file: dirent.path + "/" + dirent.name,
            error: String(error),
          });
        }
      }
    }
    if (
      dirent.isDirectory() &&
      dirent.name !== "node_modules" &&
      dirent.name !== ".git"
    ) {
      errorsCount = await getHandlers(
        source + "/" + dirent.name,
        print,
        errorsCount
      );
    }
  }
  return errorsCount;
}

export function validator(schema: HTTPBody<any> | undefined, data: any) {
  const out: Record<string, any> = {};
  let errout: string = "";
  if (typeof data !== "object") throw new Error("invalid data => " + data);
  for (const [prop, value] of Object.entries(schema || {})) {
    // ? extract validators
    const { err, type, required, RegExp, validator } = value;

    //? nullabilty check
    if (data[prop] === undefined || data[prop] === null) {
      //? nullabilty skip
      if (!required) {
        continue;
      } else {
        errout = err || `${prop} is required`;
        break;
      }
    }

    // ? type check
    if (typeof type === "string" && type !== typeof data[prop]) {
      if (type !== "file") {
        // bypass file type
        errout = err || `${prop} type is invalid '${data[prop]}' `;
        break;
      }
    }

    // ? regex check
    if (typeof RegExp === "object" && !RegExp.test(data[prop])) {
      errout = err || `${prop} is invalid`;
      break;
    }

    // ? custom check
    if (typeof validator === "function") {
      const v = validator(data[prop]) as any;
      if (v !== true) {
        errout = err || typeof v === "string" ? v : `${prop} must is invalid`;
        break;
      }
    }
    //? set this prop as valid
    out[prop] = data[prop];
  }
  if (errout) throw new Error(errout);
  return out;
}

/**
 *
 * @param method
 * @param url
 * @returns ? [handler, params, search, path]
 */

const URLPARSER = (
  method: methods,
  url: string
): [JetFunc, Record<string, any>, Record<string, any>, string] | undefined => {
  const routes = _JetPath_paths[method];
  if (!UTILS.runtime["node"]) {
    url = url.slice(url.indexOf("/", 7));
  }

  // if (!routes) return;

  if (routes[url]) {
    return [routes[url], {}, {}, url];
  }

  const search: Record<string, string> = {},
    params: Record<string, string> = {};
  let path: string, handler: JetFunc;
  //? place holder & * route checks
  for (const pathR in routes) {
    let breaked = false;
    // ? placeholder /: check
    if (pathR.includes(":")) {
      const urlFixtures = url.split("/");
      const pathFixtures = pathR.split("/");

      if (urlFixtures.length !== pathFixtures.length) {
        continue;
      }

      for (let i = 0; i < pathFixtures.length; i++) {
        if (
          !pathFixtures[i].includes(":") &&
          urlFixtures[i] !== pathFixtures[i]
        ) {
          breaked = true;
          break;
        }
      }
      if (breaked) {
        continue;
      }

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
  }
  //? check for search in the route
  const uio = url.indexOf("/?");

  if (uio > -1) {
    path = url.slice(0, uio + 2);
    if (url.includes("=")) {
      const sraw = url.slice(path.length).split("=");
      for (let s = 0; s < sraw.length; s = s + 2) {
        search[sraw[s]] = sraw[s + 1];
      }
    }
    if (routes[path]) {
      handler = routes[path];
    }
  }

  if (handler!) {
    return [handler, params, search, path!];
  }
};

export const compileUI = (UI: string, options: jetOptions, api: string) => {
  // ? global headers
  const globalHeaders = JSON.stringify(
    options?.globalHeaders || {
      Authorization: "Bearer ****",
    }
  );
  return UI.replace("'{JETPATH}'", `\`${api}\``)
    .replaceAll("{JETPATHGH}", `${globalHeaders}`)
    .replaceAll("{NAME}", options?.apiDoc?.name || "JethPath API Doc")
    .replaceAll("JETPATHCOLOR", options?.apiDoc?.color || "#007bff")
    .replaceAll(
      "{LOGO}",
      options?.apiDoc?.logo ||
        "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp"
    )
    .replaceAll(
      "{INFO}",
      options?.apiDoc?.info || "This is a JethPath api preview."
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
        // ? Retrieve api handler
        const validator = routesOfMethod[route];
        // ? Retrieve api body definitions
        const body = validator.body;
        // ? Retrieve api headers definitions
        const inialHeader = {};
        Object.assign(inialHeader, validator?.headers || {}, globalHeaders);
        const headers = [];
        // ? parse headers
        for (const name in inialHeader) {
          headers.push(
            name + ":" + inialHeader[name as keyof typeof inialHeader]
          );
        }
        // ? parse body
        let bodyData: Record<string, any> | undefined = undefined;
        if (body) {
          bodyData = {};
          for (const keyOfBody in body) {
            bodyData[keyOfBody] =
              (body[keyOfBody as keyof typeof body] as any)?.defaultValue ||
              (body[keyOfBody as keyof typeof body] as any)?.inputType ||
              "text";
          }
        }
        // ? combine api infos into .http formart
        const api = `\n
${method} ${
          options?.APIdisplay === "UI"
            ? "[--host--]"
            : "http://localhost:" + (options?.port || 8080)
        }${route} HTTP/1.1
${headers.length ? headers.join("\n") : ""}\n
${(body && method !== "GET" ? method : "") ? JSON.stringify(bodyData) : ""}\n${
          validator?.["info"] ? "#" + validator?.["info"] + "-JETE" : ""
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
  for (; low <= high; ) {
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
