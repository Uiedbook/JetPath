import { opendir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { URLSearchParams } from 'node:url';
import path from 'node:path';
import { cwd } from 'node:process';

// src/app.ts

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
    function set(key, value) {
      ctx.set(key, value);
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
      ctx.code(204);
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
  OPTIONS: void 0
};
var _JetPath_hooks = {
  PRE: true,
  POST: true,
  ERROR: true
};
var doneError = new Error("done");
var _JetPath_app_config = {
  cors: void 0,
  set(opt, val) {
    if (opt === "cors" && val) {
      this.cors = corsHooker({
        exposeHeaders: "",
        allowMethods: "",
        allowHeaders: "",
        maxAge: "",
        keepHeadersOnError: void 0,
        origin: function(arg0) {
          throw new Error("Function not implemented.");
        },
        credentials: function(arg0) {
          throw new Error("Function not implemented.");
        },
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
function createCTX(req, res) {
  let load, code = 200;
  const ctx = {
    request: req,
    body: null,
    reply(data) {
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
          load = data.toString();
          break;
      }
      res.writeHead(code, { "Content-Type": contentType });
      throw doneError;
    },
    redirect(url) {
      res.writeHead(301, { Location: url });
      load = void 0;
      throw doneError;
    },
    throw(code2 = 404, message = "Not FOund") {
      res.writeHead(code2, { "Content-Type": "text/plain" });
      res.statusCode = code2;
      load = String(message);
      throw doneError;
    },
    code(statusCode) {
      if (statusCode) {
        code = statusCode;
        res.statusCode = statusCode;
      }
      return code;
    },
    method: req.method,
    get(field) {
      if (field) {
        return req.headers[field];
      }
      return void 0;
    },
    set(field, value) {
      if (field && value) {
        res.setHeader(field, value);
      }
    },
    pipe(stream, ContentDisposition) {
      res.setHeader("Content-Disposition", ContentDisposition);
      stream.pipe(res);
    },
    json() {
      return new Promise((r) => {
        let body = "";
        req.on("data", (data) => {
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
      return new Promise((r) => {
        let body = "";
        req.on("data", (data) => {
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
    params: void 0,
    search: void 0
  };
  return ctx;
}
var JetPath_app = createServer(
  async (req, res) => {
    let routesParams = {};
    let searchParams = {};
    let r = checker(req.method, req.url);
    if (r) {
      const ctx = createCTX(req, res);
      if (r.length > 1) {
        [r, routesParams, searchParams] = r;
        ctx.params = routesParams;
        ctx.search = searchParams;
      }
      try {
        await _JetPath_hooks["PRE"]?.(ctx);
        await r(ctx);
        _JetPath_hooks["POST"] && await _JetPath_hooks["POST"](ctx);
        if (_JetPath_app_config.cors) {
          _JetPath_app_config.cors(ctx);
        }
        res.end(ctx._());
      } catch (error) {
        if (String(error).includes("done")) {
          if (_JetPath_app_config.cors) {
            _JetPath_app_config.cors(ctx);
          }
          res.end(ctx._());
        } else {
          try {
            await _JetPath_hooks["ERROR"]?.(ctx, error);
            if (_JetPath_app_config.cors) {
              _JetPath_app_config.cors(ctx);
            }
            res.end(ctx._());
          } catch (error2) {
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
async function getHandlers(source) {
  source = source || cwd().split("/").pop();
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
            if (_JetPath_hooks[params]) {
              _JetPath_hooks[params] = module[p];
            }
          }
        }
      }
    }
    if (dirent.isDirectory() && dirent.name !== "node_modules" && dirent.name !== ".git") {
      await getHandlers(source + "/" + dirent.name);
    }
  }
}
var checker = (method, url) => {
  const routes = _JetPath_paths[method];
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
    this.options = options;
    this.server = JetPath_app;
  }
  async listen() {
    const port = this.options?.port || 8080;
    for (const [k, v] of Object.entries(this.options || {})) {
      _JetPath_app_config.set(k, v);
    }
    if (_JetPath_app_config["printRoutes"]) {
      console.log("JetPath: compiling paths ... ");
      await getHandlers(this.options?.source);
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      console.log(_JetPath_paths);
    } else {
      await getHandlers(this.options?.source);
    }
    console.log(`JetPath app listening on port ${port}`);
    JetPath_app.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.log("Address in use, retrying...");
        setTimeout(() => {
          JetPath_app.close();
          JetPath_app.listen(port);
        }, 1e3);
      }
    });
    JetPath_app.listen(this.options?.port || 8080);
  }
};

export { JetPath as default };
