// src/primitives/functions.ts
import {opendir} from "node:fs/promises";
import {URLSearchParams} from "node:url";
import path from "node:path";
import {cwd} from "node:process";
import {createServer} from "node:http";
function corsHook(_options) {
  const options = {
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    origin: "*",
    secureContext: false,
    keepHeadersOnError: false,
    allowHeaders: []
  };
  for (const key in _options) {
    if (_options.hasOwnProperty(key)) {
      options[key] = _options[key];
    }
  }
  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(",");
  }
  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }
  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;
  return function cors(ctx) {
    let credentials = options.credentials;
    const headersSet = {};
    function set(key, value) {
      ctx.set(key, value);
      headersSet[key] = value;
    }
    if (ctx.method !== "OPTIONS") {
      set("Access-Control-Allow-Origin", options.origin);
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
      if (!ctx.get("Access-Control-Request-Method")) {
        return;
      }
      ctx.set("Access-Control-Allow-Origin", options.origin);
      if (credentials === true) {
        ctx.set("Access-Control-Allow-Credentials", "true");
      }
      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", options.maxAge);
      }
      if (options.privateNetworkAccess && ctx.get("Access-Control-Request-Private-Network")) {
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
async function getHandlers(source, print) {
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
          if (typeof params !== "string" && _JetPath_paths[params[0]]) {
            _JetPath_paths[params[0]][params[1]] = module[p];
          } else {
            if (_JetPath_hooks[params] === false) {
              _JetPath_hooks[params] = module[p];
            } else {
              if (params === "DECORATOR") {
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
    if (dirent.isDirectory() && dirent.name !== "node_modules" && dirent.name !== ".git") {
      await getHandlers(source + "/" + dirent.name, print);
    }
  }
}
var UTILS = {
  ae(cb) {
    try {
      cb();
      return true;
    } catch (error) {
      return false;
    }
  },
  set() {
    const bun = UTILS.ae(() => Bun);
    const deno = UTILS.ae(() => Deno);
    this.runtime = { bun, deno, node: !bun && !deno };
  },
  runtime: null,
  decorators: {},
  server() {
    if (UTILS.runtime["node"]) {
      return createServer((x, y) => {
        JetPath_app(x, y);
      });
    }
    if (UTILS.runtime["deno"]) {
      return {
        listen(port) {
          Deno.serve({ port }, JetPath_app);
        }
      };
    }
    if (UTILS.runtime["bun"]) {
      return {
        listen(port) {
          Bun.serve({ port, fetch: JetPath_app });
        }
      };
    }
  }
};
UTILS.set();
var _JetPath_paths = {
  GET: {},
  POST: {},
  HEAD: {},
  PUT: {},
  PATCH: {},
  DELETE: {},
  OPTIONS: {}
};
var _JetPath_hooks = {
  PRE: false,
  POST: false,
  ERROR: false
};

class JetPathErrors extends Error {
  constructor(message = "done") {
    super(message);
  }
}
var errDone = new JetPathErrors;
var _JetPath_app_config = {
  cors: false,
  set(opt, val) {
    if (opt === "cors" && val) {
      this.cors = corsHook({
        exposeHeaders: "",
        allowMethods: "",
        allowHeaders: "",
        maxAge: "",
        keepHeadersOnError: true,
        secureContext: false,
        privateNetworkAccess: undefined,
        ...typeof val === "object" ? val : {}
      });
      if (Array.isArray(val["allowMethods"])) {
        _JetPath_paths = {};
        for (const med of val["allowMethods"]) {
          _JetPath_paths[med.toUpperCase()] = {};
        }
      }
      return;
    }
    this[opt] = val;
  }
};
var createCTX = (req, decorationObject = {}) => ({
  ...decorationObject,
  app: {},
  request: req,
  code: 200,
  method: req.method,
  reply(data, contentType) {
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
    throw errDone;
  },
  redirect(url) {
    this.code = 301;
    if (!this._2) {
      this._2 = {};
    }
    this._2["Location"] = url;
    this._1 = undefined;
    this._4 = true;
    throw errDone;
  },
  throw(code = 404, message = "Not Found") {
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
  get(field) {
    if (field) {
      return this.request.headers[field];
    }
    return;
  },
  set(field, value) {
    if (!this._2) {
      this._2 = {};
    }
    if (field && value) {
      this._2[field] = value;
    }
  },
  pipe(stream, ContentType, name) {
    if (!this._2) {
      this._2 = {};
    }
    this._2["Content-Disposition"] = `inline;filename="${name || "unnamed.bin"}"`;
    this._2["Content-Type"] = ContentType;
    if (!UTILS.runtime["node"]) {
      return this.reply(stream, ContentType);
    }
    this._3 = stream;
    this._4 = true;
    throw errDone;
  },
  json() {
    if (this.body) {
      return this.body;
    }
    if (!UTILS.runtime["node"]) {
      return this.request.json();
    }
    return new Promise((r) => {
      let body = "";
      this.request.on("data", (data) => {
        body += data.toString();
      });
      this.request.on("end", () => {
        try {
          this.body = JSON.parse(body);
        } catch (error) {
        }
        r(this.body);
      });
    });
  }
});
var createResponse = (res, ctx) => {
  if (!UTILS.runtime["node"]) {
    if (ctx?.code === 301 && ctx._2?.["Location"]) {
      return Response.redirect(ctx._2?.["Location"]);
    }
    return new Response(ctx?._1 || "Not found!", {
      status: ctx?.code || 404,
      headers: ctx?._2 || {}
    });
  }
  if (ctx?._3) {
    res.setHeader("Content-Type", (ctx?._2 || {})["Content-Type"] || "text/plain");
    ctx._3.pipe(res);
    return;
  }
  res.writeHead(ctx?.code || 404, ctx?._2 || { "Content-Type": "text/plain" });
  res.end(ctx?._1 || "Not found!");
  return;
};
var JetPath_app = async (req, res) => {
  let routesParams = {};
  let searchParams = {};
  let r = checker(req.method, req.url);
  if (r) {
    const ctx = createCTX(req, UTILS.decorators);
    if (r.length > 1) {
      [r, routesParams, searchParams] = r;
      ctx.params = routesParams;
      ctx.search = searchParams;
    }
    try {
      _JetPath_hooks["PRE"] && await _JetPath_hooks["PRE"](ctx);
      await r(ctx);
      _JetPath_hooks["POST"] && await _JetPath_hooks["POST"](ctx);
      _JetPath_app_config["cors"] && _JetPath_app_config.cors(ctx);
      return createResponse(res, ctx);
    } catch (error) {
      if (error instanceof JetPathErrors) {
        if (_JetPath_app_config.cors) {
          _JetPath_app_config.cors(ctx);
        }
        return createResponse(res, ctx);
      } else {
        try {
          _JetPath_hooks["ERROR"] && await _JetPath_hooks["ERROR"](ctx, error);
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(res, ctx);
        } catch (error2) {
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          return createResponse(res, ctx);
        }
      }
    }
  } else {
    if (_JetPath_app_config.cors || req.method === "OPTIONS") {
      const ctx = createCTX(req);
      _JetPath_app_config.cors(ctx);
      return createResponse(res, ctx);
    }
    return createResponse(res);
  }
};
var Handlerspath = (path2) => {
  if (path2.includes("hook__")) {
    return path2.split("hook__")[1];
  }
  path2 = path2.split("_");
  const method = path2.shift();
  path2 = "/" + path2.join("/");
  path2 = path2.split("$$");
  path2 = path2.join("/?");
  path2 = path2.split("$0");
  path2 = path2.join("/*");
  path2 = path2.split("$");
  path2 = path2.join("/:");
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS)/.test(method)) {
    return [method, path2];
  }
  return;
};
var checker = (method, url) => {
  const routes = _JetPath_paths[method];
  if (url[0] !== "/") {
    url = url.slice(url.indexOf("/", 7));
  }
  if (routes[url]) {
    return routes[url];
  }
  if (typeof routes === "function") {
    routes();
    return;
  }
  if (routes[url + "/"]) {
    return routes[url];
  }
  if (url.includes("/?")) {
    const sraw = [...new URLSearchParams(url).entries()];
    const search = {};
    for (const idx in sraw) {
      search[sraw[idx][0].includes("?") ? sraw[idx][0].split("?")[1] : sraw[idx][0]] = sraw[idx][1];
    }
    return [routes[url.split("/?")[0] + "/?"], , search];
  }
  for (const path2 in routes) {
    if (path2.includes(":")) {
      const urlFixtures = url.split("/");
      const pathFixtures = path2.split("/");
      if (url.endsWith("/")) {
        urlFixtures.pop();
      }
      let fixturesX = 0;
      let fixturesY = 0;
      if (pathFixtures.length === urlFixtures.length) {
        for (let i = 0;i < pathFixtures.length; i++) {
          if (pathFixtures[i].includes(":")) {
            fixturesY++;
            continue;
          }
          if (urlFixtures[i] === pathFixtures[i]) {
            fixturesX++;
          }
        }
        if (fixturesX + fixturesY === pathFixtures.length) {
          const routesParams = {};
          for (let i = 0;i < pathFixtures.length; i++) {
            if (pathFixtures[i].includes(":")) {
              routesParams[pathFixtures[i].split(":")[1]] = urlFixtures[i];
            }
          }
          return [routes[path2], routesParams];
        }
      }
    }
    if (path2.includes("*")) {
      const p = path2.slice(0, -1);
      if (url.startsWith(p)) {
        return [routes[path2], { extraPath: url.slice(p.length) }];
      }
    }
  }
  return;
};

// src/index.ts
class JetPath {
  options;
  server;
  listening = false;
  constructor(options) {
    this.options = options || { printRoutes: true };
    this.server = UTILS.server();
  }
  decorate(decorations) {
    if (this.listening) {
      throw new Error("Your app is listening new decorations can't be added.");
    }
    if (typeof decorations !== "object") {
      throw new Error("could not add decorations to ctx");
    }
    UTILS.decorators = Object.assign(UTILS.decorators, decorations);
  }
  async listen() {
    const port = this.options?.port || 8080;
    for (const [k, v] of Object.entries(this.options || {})) {
      _JetPath_app_config.set(k, v);
    }
    if (typeof this.options !== "object" || this.options.printRoutes !== false) {
      console.log("JetPath: compiling...");
      await getHandlers(this.options?.source, true);
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k];
        if (r && Object.keys(r).length) {
          console.log("\n" + k + ": routes");
          for (const p in r) {
            console.log("'" + p + "'");
          }
        }
      }
    } else {
      await getHandlers(this.options?.source, false);
    }
    this.listening = true;
    console.log(`\nListening on http://localhost:${port}/`);
    this.server.listen(this.options?.port || 8080);
  }
}
export {
  JetPath
};
