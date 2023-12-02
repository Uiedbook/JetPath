// src/app.ts
import { opendir } from "node:fs/promises";
import { createServer } from "node:http";

// src/cor.ts
function corsHooker(_options) {
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
    options.allowMethods = options.allowMethods.join(
      ","
    );
  }
  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }
  options.keepHeadersOnError = options.keepHeadersOnError === void 0 || !!options.keepHeadersOnError;
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
      ctx.statusCode = 204;
    }
  };
}

// src/app.ts
import { URLSearchParams } from "node:url";
import path from "node:path";
import { cwd } from "node:process";
var avoidErr = (cb) => {
  try {
    cb();
    return true;
  } catch (error) {
    return false;
  }
};
var getRutime = () => {
  const bun = avoidErr(() => Bun);
  const deno = avoidErr(() => Deno);
  const node = !bun && !deno;
  return { bun, deno, node };
};
var runtime = getRutime();
var JetPath_server = { listen(port) {
} };
if (runtime.node) {
  JetPath_server = createServer((x, y) => {
    JetPath_app(x, y);
  });
}
if (runtime.deno) {
  JetPath_server = {
    listen(port) {
      Deno.serve({ port }, JetPath_app);
    }
  };
}
if (runtime.bun) {
  JetPath_server = {
    listen(port) {
      Bun.serve({ port, fetch: JetPath_app });
    }
  };
}
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
var JetPathErrors = class extends Error {
  constructor(message = "done") {
    super(message);
  }
};
var errDone = new JetPathErrors();
var _JetPath_app_config = {
  cors: void 0,
  set(opt, val) {
    if (opt === "cors" && val) {
      this.cors = corsHooker({
        exposeHeaders: "",
        allowMethods: "",
        allowHeaders: "",
        maxAge: "",
        keepHeadersOnError: true,
        secureContext: false,
        privateNetworkAccess: void 0,
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
var createCTX = (req) => ({
  request: req,
  body: null,
  app: {},
  statusCode: 200,
  method: req.method,
  reply(data) {
    let contentType;
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
    this._4 = true;
    throw errDone;
  },
  redirect(url) {
    this.statusCode = 301;
    this._2["Location"] = url;
    this._1 = void 0;
    this._4 = true;
    throw errDone;
  },
  throw(code = 404, message = "Not Found") {
    if (!this._4) {
      switch (typeof code) {
        case "number":
          this.statusCode = code;
          if (typeof message === "object") {
            this._2["Content-Type"] = "application/json";
            this._1 = JSON.stringify(message);
          } else {
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
          this._1 = JSON.stringify(message);
          break;
      }
    }
    throw errDone;
  },
  get(field) {
    if (field) {
      return this.request.headers[field];
    }
    return void 0;
  },
  set(field, value) {
    if (field && value) {
      this._2[field] = value;
    }
  },
  pass(field, value) {
    if (field && value) {
      this.app[field] = value;
    }
  },
  pipe(stream, ContentDisposition) {
    this._2["Content-Disposition"] = ContentDisposition;
    this._3 = stream;
    this._4 = true;
  },
  json() {
    if (this.body) {
      return this.body;
    }
    if (!runtime.node) {
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
  },
  text() {
    if (this.body) {
      return this.body;
    }
    if (!runtime.node) {
      return this.request.text();
    }
    return new Promise((r) => {
      let body = "";
      this.request.on("data", (data) => {
        body += data.toString();
      });
      this.request.on("end", () => {
        this.body = body;
        r(body);
      });
    });
  },
  // https://github.com/mscdex/busboy
  // files() {
  //  npm i busboy
  // return new Promise<any>((r) => {
  // if (req.method === "POST") {
  //   const bb = busboy({ headers: req.headers });
  //   bb.on("file", (name, file, info) => {
  //     const saveTo = path.join(os.tmpdir(), `busboy-upload-${random()}`);
  //     file.pipe(fs.createWriteStream(saveTo));
  //   });
  //   bb.on("close", () => {
  //     res.writeHead(200, { Connection: "close" });
  //     res.end(`That's all folks!`);
  //   });
  //   req.pipe(bb);
  //   return;
  // }
  // });
  // },
  //? load
  _1: void 0,
  //? header of response
  _2: {},
  //? stream
  _3: void 0,
  //? succes  state
  _4: false,
  params: {},
  search: {}
});
var createResponse = (res, ctx) => {
  if (!runtime.node) {
    if (ctx?.statusCode === 301 && ctx._2["Location"]) {
      return Response.redirect(ctx._2["Location"]);
    }
    return new Response(ctx?._1 || "Not found!", {
      status: ctx?.statusCode || 404,
      headers: ctx?._2 || {}
    });
  }
  res.writeHead(
    ctx?.statusCode || 404,
    ctx?._2 || { "Content-Type": "text/plain" }
  );
  res.end(ctx?._1 || "Not found!");
  return void 0;
};
var JetPath_app = async (req, res) => {
  let routesParams = {};
  let searchParams = {};
  let r = checker(req.method, req.url);
  if (r) {
    const ctx = createCTX(req);
    if (r.length > 1) {
      [r, routesParams, searchParams] = r;
      ctx.params = routesParams;
      ctx.search = searchParams;
    }
    try {
      _JetPath_hooks["PRE"] && await _JetPath_hooks["PRE"]?.(ctx);
      await r(ctx);
      _JetPath_hooks["POST"] && await _JetPath_hooks["POST"](ctx);
      if (_JetPath_app_config.cors) {
        _JetPath_app_config.cors(ctx);
      }
      !ctx._1 && ctx._3 && ctx._3.pipe(res);
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
  path2 = path2.split("$");
  path2 = path2.join("/:");
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS)/.test(method)) {
    return [method, path2];
  }
  return;
};
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
    if (!path2.includes(":")) {
      continue;
    }
    const urlFixtures = url.split("/");
    const pathFixtures = path2.split("/");
    if (url.endsWith("/")) {
      urlFixtures.pop();
    }
    let fixturesX = 0;
    let fixturesY = 0;
    if (pathFixtures.length === urlFixtures.length) {
      for (let i = 0; i < pathFixtures.length; i++) {
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
        for (let i = 0; i < pathFixtures.length; i++) {
          if (pathFixtures[i].includes(":")) {
            routesParams[pathFixtures[i].split(":")[1]] = urlFixtures[i];
          }
        }
        return [routes[path2], routesParams];
      }
    }
  }
  return;
};

// src/index.ts
var JetPath = class {
  constructor(options) {
    this.options = options || { printRoutes: true };
    this.server = JetPath_server;
  }
  async listen() {
    const port = this.options?.port || 8080;
    for (const [k, v] of Object.entries(this.options || {})) {
      _JetPath_app_config.set(k, v);
    }
    if (_JetPath_app_config["printRoutes"]) {
      console.log("JetPath: compiling paths...");
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
    console.log(`
JetPath app listening on port ${port}...`);
    JetPath_server.listen(this.options?.port || 8080);
  }
};
export {
  JetPath
};
