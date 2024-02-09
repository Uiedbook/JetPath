// src/index.ts
import {access} from "node:fs/promises";

// src/primitives/functions.ts
import {opendir} from "node:fs/promises";
import {URLSearchParams} from "node:url";
import path from "node:path";
import {cwd} from "node:process";
import {createServer} from "node:http";
import {createReadStream} from "node:fs";
function corsHook(options) {
  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(",");
  }
  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }
  options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;
  return function cors(ctx) {
    ctx.set("Vary", "Origin");
    if (options.credentials === true) {
      ctx.set("Access-Control-Allow-Credentials", "true");
    } else {
      ctx.set("Access-Control-Allow-Origin", options.origin.join(","));
    }
    if (ctx.method !== "OPTIONS") {
      if (options.exposeHeaders) {
        ctx.set("Access-Control-Expose-Headers", options.exposeHeaders.join(","));
      }
      if (options.secureContext) {
        ctx.set("Cross-Origin-Opener-Policy", "unsafe-none");
        ctx.set("Cross-Origin-Embedder-Policy", "unsafe-none");
      }
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
    } else {
      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", options.maxAge);
      }
      if (options.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", options.allowMethods.join(","));
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
          if (params[0] === "BODY") {
            const validator = module[p];
            if (typeof validator === "object") {
              UTILS.validators[params[1]] = validator;
            }
          }
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
var validate = function(schema, data) {
  const out = {};
  let errout = "";
  if (!data)
    this.throw("invalid ctx.body => " + data);
  for (const [prop, value] of Object.entries(schema)) {
    if (prop === "BODY_info" || prop == "BODY_method")
      continue;
    const { err, type, nullable, RegExp, validate: validate2 } = value;
    if (!data[prop] && nullable) {
      continue;
    }
    if (!data[prop] && !nullable) {
      if (err) {
        errout = err;
      } else {
        errout = `${prop} is required`;
      }
    }
    if (validate2 && !validate2(data[prop])) {
      if (err) {
        errout = err;
      } else {
        errout = `${prop} must is invalid`;
      }
    }
    if (typeof RegExp === "object" && !RegExp.test(data[prop])) {
      if (err) {
        errout = err;
      } else {
        errout = `${prop} must is invalid`;
      }
    }
    if (typeof type === "string" && type !== typeof data[prop]) {
      if (err) {
        errout = err;
      } else {
        errout = `${prop} type is invalid '${data[prop]}' `;
      }
    }
    out[prop] = data[prop];
  }
  if (errout)
    this.throw({ detail: errout });
  return out;
};
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
  validators: {},
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
          Bun.serve({
            port,
            fetch: JetPath_app,
            websocket: _JetPath_paths?.POST?.["/websocket"]?.(undefined)
          });
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
    if (opt === "cors" && val !== false) {
      this.cors = corsHook({
        exposeHeaders: [],
        allowMethods: [],
        allowHeaders: ["Content-Type"],
        maxAge: "",
        keepHeadersOnError: true,
        secureContext: false,
        privateNetworkAccess: false,
        origin: ["*"],
        credentials: undefined,
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
    if (typeof stream === "string") {
      if (UTILS.runtime["bun"]) {
        stream = Bun.file(stream);
      } else {
        stream = createReadStream(stream);
      }
    }
    this._3 = stream;
    this._4 = true;
    throw errDone;
  },
  async json() {
    if (this.body) {
      return this.body;
    }
    if (!UTILS.runtime["node"]) {
      try {
        this.body = await this.request.json();
      } catch (error) {
      }
      return this.body;
    }
    return await new Promise((r) => {
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
  validate(data) {
    if (UTILS.validators[this.path]) {
      return validate.apply(this, [UTILS.validators[this.path], data]);
    }
    throw new Error("no validation BODY! for path " + this.path);
  },
  params: {},
  search: {},
  path: "/"
});
var createResponse = (res, ctx) => {
  _JetPath_app_config.cors(ctx);
  if (!UTILS.runtime["node"]) {
    if (ctx?.code === 301 && ctx._2?.["Location"]) {
      return Response.redirect(ctx._2?.["Location"]);
    }
    if (ctx?._3) {
      return new Response(ctx?._3, {
        status: 200,
        headers: ctx?._2
      });
    }
    return new Response(ctx?._1 || "Not found!", {
      status: ctx?.code || 404,
      headers: ctx?._2 || {}
    });
  }
  if (ctx?._3) {
    res.setHeader("Content-Type", (ctx?._2 || {})["Content-Type"] || "text/plain");
    return ctx._3.pipe(res);
  }
  res.writeHead(ctx?.code || 404, ctx?._2 || { "Content-Type": "text/plain" });
  res.end(ctx?._1 || "Not found!");
};
var JetPath_app = async (req, res) => {
  const paseredR = URLPARSER(req.method, req.url);
  if (paseredR) {
    const ctx = createCTX(req, UTILS.decorators);
    const r = paseredR[0];
    ctx.params = paseredR[1];
    ctx.search = paseredR[2];
    ctx.path = paseredR[3];
    try {
      await _JetPath_hooks?.["PRE"](ctx);
      await r(ctx);
      await _JetPath_hooks?.["POST"](ctx);
      return createResponse(res, ctx);
    } catch (error) {
      if (error instanceof JetPathErrors) {
        return createResponse(res, ctx);
      } else {
        try {
          await _JetPath_hooks["ERROR"]?.(ctx, error);
          //! if expose headers on error is
          //! false remove this line so the last return will take effect;
          return createResponse(res, ctx);
        } catch (error2) {
          return createResponse(res, ctx);
        }
      }
    }
  }
  return createResponse(res, createCTX(req));
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
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS|BODY)/.test(method)) {
    return [method, path2];
  }
  return;
};
var URLPARSER = (method, url) => {
  const routes = _JetPath_paths[method];
  if (!UTILS.runtime["node"]) {
    url = url.slice(url.indexOf("/", 7));
  }
  if (routes[url]) {
    return [routes[url], {}, {}, url];
  }
  if (url.includes("/?")) {
    const sraw = [...new URLSearchParams(url).entries()];
    const search = {};
    for (const idx in sraw) {
      search[sraw[idx][0].includes("?") ? sraw[idx][0].split("?")[1] : sraw[idx][0]] = sraw[idx][1];
    }
    const path2 = url.split("/?")[0] + "/?";
    if (routes[path2]) {
      return [routes[path2], {}, search, path2];
    }
    return;
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
          return [routes[path2], routesParams, {}, path2];
        }
      }
    }
    if (path2.includes("*")) {
      const p = path2.slice(0, -1);
      if (url.startsWith(p)) {
        return [routes[path2], { extraPath: url.slice(p.length) }, {}, path2];
      }
    }
  }
  return;
};

// src/index.ts
class JetPath {
  server;
  listening = false;
  options;
  port;
  constructor(options) {
    this.port = this.options?.port || 8080;
    this.options = options || { displayRoutes: true };
    for (const [k, v] of Object.entries(this.options)) {
      _JetPath_app_config.set(k, v);
    }
    if (!options?.cors) {
      _JetPath_app_config.set("cors", true);
    }
    this.server = UTILS.server();
  }
  decorate(decorations) {
    if (this.listening) {
      throw new Error("Your app is listening new decorations can't be added.");
    }
    if (typeof decorations !== "object") {
      throw new Error("could not add decoration to ctx");
    }
    UTILS.decorators = Object.assign(UTILS.decorators, decorations);
  }
  async listen() {
    if (this.options?.publicPath?.route && this.options?.publicPath?.dir) {
      _JetPath_paths["GET"][this.options.publicPath.route + "/*"] = async (ctx) => {
        const fileName = ctx.params?.["extraPath"];
        if (fileName && ("/" + fileName).includes(this.options.publicPath.dir + "/")) {
          let contentType;
          switch (fileName.split(".")[1]) {
            case "js":
              contentType = "application/javascript";
              break;
            case "pdf":
              contentType = "application/pdf";
              break;
            case "json":
              contentType = "application/json";
              break;
            case "css":
              contentType = "text/css; charset=utf-8";
              break;
            case "html":
              contentType = "charset=utf-8";
              break;
            case "png":
              contentType = "image/png";
              break;
            case "avif":
              contentType = "image/avif";
              break;
            case "webp":
              contentType = "image/webp";
              break;
            case "jpg":
              contentType = "image/jpeg";
              break;
            case "svg":
              contentType = "image/svg+xml";
              break;
            case "ico":
              contentType = "image/vnd.microsoft.icon";
              break;
            default:
              contentType = "text/plain";
              break;
          }
          try {
            await access(fileName);
          } catch (error) {
            return ctx.throw();
          }
          return ctx.pipe(fileName, contentType);
        } else {
          return ctx.throw();
        }
      };
    }
    if (typeof this.options !== "object" || this.options?.displayRoutes !== false) {
      let c = 0, t = "";
      console.log("JetPath: compiling...");
      const startTime = performance.now();
      await getHandlers(this.options?.source, true);
      const endTime = performance.now();
      console.log("JetPath: done.");
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k];
        if (r && Object.keys(r).length) {
          for (const p in r) {
            const b = UTILS.validators[p];
            const j = {};
            if (b) {
              for (const ke in b) {
                if (ke === "BODY_info" || ke == "BODY_method")
                  continue;
                j[ke] = b[ke]?.inputType || "text";
              }
            }
            const api = `\n
${k} [--host--]${p} HTTP/1.1
${b && (b.BODY_method === k && k !== "GET" ? k : "") ? "\n" + JSON.stringify(j) : ""}\n${b && (b.BODY_method === k && k !== "GET" ? k : "") && b?.["BODY_info"] ? "#" + b?.["BODY_info"] + "-JETE" : ""}
###`;
            if (this.options.displayRoutes === "UI") {
              t += api;
            } else {
              console.log(api);
            }
            c += 1;
          }
        }
      }
      if (this.options.displayRoutes === "UI") {
        _JetPath_paths["GET"]["/api-doc"] = (ctx) => {
          ctx.reply(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{NAME} API Preview</title>
    <link rel="shortcut icon" href="https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon.webp" type="image/webp">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://demo.voidcoders.com/htmldemo/fitgear/main-files/assets/css/animate.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"> 
    <script src="https://code.jquery.com/jquery-2.1.0.js" defer></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" defer></script>
   <!-- <link rel="stylesheet" href="index.css"> -->
   <style>
    :root {
  ---app: JETPATHCOLOR;
}

::-webkit-scrollbar {
  width: 2px !important;
  height: 2px !important;
}

::-webkit-scrollbar-thumb {
  background-color: JETPATHCOLOR !important;
  outline: 1px solid JETPATHCOLOR !important;
  border-radius: 15px !important;
}

::-webkit-scrollbar-track {
  background-color: #00000014;
}
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4 !important;
  color: #333;
}
body * {
  font-size: unset;
}
a,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  outline: none;
}

a,
a:active,
a:focus {
  color: #6f6f6f;
  text-decoration: none;
  transition-timing-function: ease-in-out;
  -ms-transition-timing-function: ease-in-out;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  -ms-transition-duration: 0.2s;
  -moz-transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s;
  -o-transition-duration: 0.2s;
}

img {
  max-width: 90%;
  height: auto;
}
body {
  background-color: grey;
}

.code {
  white-space: pre;
  font-family: Consolas, monospace;
  background-color: #ffffff;
  padding:12px;
  border-radius:8px;
  text-wrap: balance;
  overflow-wrap: break-word;
}
.code .string {
  color: #d6582b;
}
.code .number {
  color: #188c62;
}
.code .boolean,
.code .null {
  color: #0824ff;
}
.code .key {
  color: #3456b9;
}
.code-container {
  background-color: white;
}

.section-title h2 {
  font-size: 36px;
  font-weight: 700;
  background-image: -webkit-linear-gradient(-30deg, JETPATHCOLOR 0%, #91039f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 14px;
}

.card {
  border: none;
  margin-bottom: 30px;
  max-width: 90%;
}
/* .card * {
  border: 1px red solid;
} */
.card:not(:first-of-type) .card-header:first-child {
  border-radius: 10px;
}
.card .card-header {
  border: none;
  border-radius: 10px;
  padding: 0;
  /* border: 1px blue solid; */
  width: 100%;
}
.card .card-header h5 {
  padding: 0;
}
.card .card-header h5 button {
  /* border: 1px blue solid; */
  width: 100%;
  color: #3f4b6e;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  padding: 0 30px 0 70px;
  height: 80px;
  display: block;
  text-align: left;
  background: #fff;
  -webkit-box-shadow: 0px -50px 140px 0px rgba(69, 81, 100, 0.1);
  box-shadow: 0px -50px 140px 0px rgba(69, 81, 100, 0.1);
  border-radius: 10px 10px 0 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}
.card .card-header h5 button:after {
  content: "\f078";
  position: absolute;
  left: 30px;
  top: 50%;
  margin-top: -10px;
  width: 20px;
  height: 20px;
  background-color: transparent;
  color: var(---app);
  text-align: center;
  border: 1px solid var(---app);
  border-radius: 50%;
  line-height: 100%;
  font-size: 10px;
  line-height: 18px;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}
.card .card-header h5 button.collapsed {
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.card .card-header h5 button[aria-expanded="true"]:after {
  content: "\f077";
  color: #fff;
  background-color: var(---app);
}
.card .card-body {
  -webkit-box-shadow: 0px 15px 140px 0px rgba(69, 81, 100, 0.1);
  box-shadow: 0px 15px 140px 0px rgba(69, 81, 100, 0.1);
  border-radius: 0 0 10px 10px;
  padding-top: 0;
  margin-top: -4px;
  /* padding-left: 72px; */
  /* padding-right: 70px; */
}
.big-request-container {
  width: 100vw;
  min-height: 100vh;
}

header {
  background-color: JETPATHCOLOR !important;
  text-align: center;
  color: #fff !important;
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.header {
  margin: 20px;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
  display: flex;
  flex-direction: column;
  max-width: 90%;
}
.request-container {
  /* margin: 20px; */
  padding: 20px;
  /* border: 1px solid #ccc !important; */
  border-radius: 5px;
  /* background-color: #fff !important; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important; */
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.request {
  margin-bottom: 10px;
  color: #333 !important;
}
strong,
.body-pack *,
h4 {
  margin-bottom: 10px;
  color: #333 !important;
}

.payload {
  white-space: pre-wrap;
}

.test-button {
  background-color: JETPATHCOLOR !important;
  color: #fff !important;
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  max-width: 560px;
  margin: auto;
  width: 100%;
  margin: 1rem auto;
}

.test-button:hover {
  background-color: JETPATHCOLORb6 !important;
}

.response-container {
  /* border: 1px solid #ccc !important; */
  /* border-radius: 5px; */
  /* background-color: #fff !important; */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); */
  display: none;
  /* margin: 20px; */
  padding: 10px;
}
.url-input {
  width: fit-content;
  min-width: 60%;
  padding: 18px;
  border-radius: 6px;
  margin: 4px 1rem;
  border: 1px gainsboro solid;
  outline: none;
  max-height: 20px;
  font-size: 16px;
}
.body-pack {
  /* border: 3px solid JETPATHCOLOR36 !important; */
  padding: 1rem;
  margin: 1rem 0px;
  border-radius: 4px;
  overflow: hidden;
}
.body-pack div {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.body-pack div:last-of-type {
  margin-bottom: 0px;
}
.body-pack span {
  margin: 6px;
}
.body-pack input {
  padding: 4px;
  border-radius: 4px;
  border: 1px JETPATHCOLOR5e solid !important;
  width: 100%;
  max-width: 50vw;
}
.comment {
  margin: 3rem 1rem 1rem 1rem;
}

select {
  padding: 10px;
  font-size: 16px;
  border: 2px solid JETPATHCOLOR90 !important;
  border-radius: 5px;
  outline: none;
}
span.method {
  background: #000;
  border-radius: 3px;
  color: #fff;
  font-family: sans-serif;
  font-size: 14px;
  font-weight: 700;
  min-width: 100px !important;
  padding: 6px 0;
  text-align: center;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
span.PUT {
  background: #fca130;
}
span.POST {
  background: #49cc90;
}
span.DELETE {
  background: #f93e3e;
}
span.GET {
  background: #61affe;
}

@media screen and (max-width: 660px) {
  .card,
  .header {
    max-width: 100%;
  }
}

   </style>
  </head>
  <body>
    <header><img src="{LOGO}" alt="{NAME}" style="width: 7rem;" > <h1>{NAME}</h1></header>
    <div style="margin-left: 2rem;">
      <span>Project info:</span>
      <span>{INFO}</span>
    </div>
           <div class="header" id="auth-pack"> 
                                <h2>Auth headers:</h2>
      <div id="keys"></div>
    </div> 
  
        <div class="accordion" id="accordionExample">
                       
                                  </div>
    <h3 class="request-container">Requests</h>
      <div id="big-request-container"></div>
    <script type="module" >
  import _, {
  h4,
  h5,
  span,
  div,
  input,
  button,
  br,
  svg,
  $if,
  strong 
} from "https://unpkg.com/cradova/dist/index.js";

    function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, null, "\t");
  }
  
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

const body = document.getElementById("big-request-container");
function parseUPAPIBody(packer) {
  if (!packer) return;
  const result = {};
  let isSet = false;
  // Retrieve the child nodes of the input div (assuming each child is a div)
  const divs = Array.from(packer.children);
  divs.forEach((div) => {
    const input = div.querySelector("input");
    isSet = true;
    const key = div.querySelector("span").textContent.replace(":", "");
    if (input.type === "file") {
      result[key.trim()] = input.files[0];
      return;
    }
    // Attempt to parse the value as JSON
    let value;
    try {
      value = JSON.parse(input.value);
    } catch (error) {
      // If parsing as JSON fails, treat it as a string
      value = input.value;
    }
    result[key.trim()] = value;
  });
  if (!isSet) return; 
  return result;
}
function parseINAPIBody(api) {
  const packer = div({ className: "body-pack" });
  const packs = (k) =>
    div(
      span(k + ": "),
      input({ type: api[k], value: api[k] !== "file" ? api[k] : null })
    );

  packer.append(...Object.keys(api).map(packs));
  return packer;
}

document.getElementById("keys")?.appendChild(
  parseINAPIBody({
    Authorization: "Bearer ****",
  })
);

function parseApiDocumentation(apiDocumentation) {
  // get boundaries
  const requests = apiDocumentation
    .split("###")
    .map((request) => request.trim())
    .filter((a) => a !== "");
  return requests.map(parseRequest);
}

function parseRequest(requestString) {
  const lines = requestString.split("\\n").map((line) => line.trim());
  // Parse HTTP request line
  const requestLine = lines[0].split(" ");
  const method = requestLine[0];
  const url = requestLine[1];
  const httpVersion = requestLine[2];

  // Parse headers
  const headers = {};
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === "") break; // Headers end when a blank line is encountered
    const [key, value] = lines[i].split(":").map((part) => part.trim());
    headers[key.toLowerCase()] = value;
  }

  // Parse payload if it exists
  const payloadIndex = lines.indexOf("") + 1;
  let payload =
    payloadIndex !== 0 ? lines.slice(payloadIndex).join("\\n") : null;
  let comment = "";
  if (payload?.includes("#")) {
    comment = payload.slice(payload.indexOf("#") + 1, payload.indexOf("-JETE"));
    payload = payload.replace(["#", comment, "-JETE"].join(""), "");
  }
  return {
    method,
    url,
    httpVersion,
    headers,
    payload,
    comment,
  };
}
// API documentation
const apiDocumentation = '{JETPATH}'.replaceAll("[--host--]", location.origin);
// Parse API documentation
const parsedApi = parseApiDocumentation(apiDocumentation);
const groupByFirstFeature = (apis) => {
  const results = {};
  const out = [];
  for (let a = 0; a < apis.length; a++) {
    const api = apis[a];
    const top_path = new URL(api.url).pathname.split("/")[1];
    if (results[top_path || "/"]) {
      results[top_path].push(api);
    } else {
      results[top_path] = [api];
    }
    results[top_path].sort();
  }
  for (const apilist in results) {
    out.push({ comment: apilist });
    out.push(...results[apilist]);
  }
  return out;
};

function showApiResponse(response, id) {
  const responseContainer = document.getElementById(id);
  responseContainer.innerHTML = "";
  responseContainer.append(strong("API Response"), br());
  responseContainer.append(
    _(
      "pre",
      h5(response.status || 404, {
        style: { color: (response.status || 404) < 400 ? "green" : "red" },
      })
    )
  );
  if (response?.body.includes("{")||response?.body.includes("[")) {
    const cid = "x"+Date.now();
        responseContainer.append(
      div({className:"code-container"}, 
      div({id:cid, className:"code"}), 
      )
    );
document.getElementById(cid).innerHTML = syntaxHighlight(response.body);
  } else {
    responseContainer.append(
      svg(
        "<pre style='background-color:JETPATHCOLOR2e;padding:8px;border-radius:8px;text-wrap:balance; overflow-wrap: break-word;'>" +
          (response.body || "error") +
          "</pre>"
      )
    );
  }
  responseContainer.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
  responseContainer.style.display = "block";
}

const card = (request, i) => {
  const payload = JSON.parse(request.payload);
  return div(
    { className: "card" },
    div(
      { className: "card-header" },
      h5(
        { className: "mb-0" },
        $if(request.comment, h5(request.comment)),
        button(
          {
            className: "btn btn-link collapsed",
            type: "button",
            "data-toggle": "collapse",
            "data-target": "#collapse" + i,
            "aria-expanded": "false",
            "aria-controls": "collapseTwo",
            style: { overflow: "hidden" },
          },
          span(request.method, { className: "method " + request.method }),
          span(request.url)
        )
      )
    ),
    div(
      {
        id: "collapse" + i,
        className: "collapse",
        "data-parent": "#accordionExample",
      },
      div(
        { className: "card-body" },
        div(
          { className: "request-container", id: "payload-" + i },
          div(
            span(request.method, { style: { fontSize: "14px" } }),
            input({
              className: "url-input",
              id: "url-" + i,
              value: request.url,
            })
          ),
          $if(Object.entries(request.headers).length, () =>
            div(
              strong("Headers"),
              Object.entries(request.headers).map((header) => {
                input({ value: header[0] + ": " + header[1] });
              })
            )
          ),
          div(
            { id: "content-type-selector" },
            svg(
              '<select id="content-type-dropdown"><option value="application/json">JSON</option><option value="multipart/form-data">Form Data</option><option value="application/x-www-form-urlencoded">Form URL Encoded</option></select>'
            )
          ),
          $if(payload, () =>
            div(
              {
                className: "payload",
              },
              strong("Payload:"),
              br(),
              parseINAPIBody(payload)
            )
          )
        ),
        button("Send Request", {
          className: "test-button",
          async onclick() {
            const updatedRequest = {
              method: request.method,
              url: document.getElementById("url-" + i)?.value?.trim(),
              headers: request.headers,
              payload: request.payload,
            };
            const keysHeaders = parseUPAPIBody(document.getElementById("keys"));
            const requestContainer = document.getElementById("payload-" + i);
            const data = parseUPAPIBody(
              requestContainer?.querySelector(".body-pack")
            );
            const response = await testApi(
              updatedRequest.method,
              updatedRequest.url,
              Object.assign(updatedRequest.headers, keysHeaders),
              data || undefined,
              requestContainer.getElementsByTagName("select")[0]?.value
            );
            showApiResponse(response, "response-" + i);
          },
        }),
        div(
          { className: "response-container", id: "response-" + i },
          "response"
        )
      )
    )
  );
};

// Display API documentation in UI and add testing functionality
groupByFirstFeature(parsedApi).map(async (request, i) => {
  const requestContainer = div();
  if (!request.url) {
    const comment = span();
    requestContainer.classList.add("comment");
    comment.innerText = request.comment;
    requestContainer.appendChild(comment);
    body.appendChild(requestContainer);
  } else {
    body.appendChild(card(request, i));
  }
});

async function testApi(
  method,
  url,
  headers = {},
  body,
  contentType = "application/json"
) {
  headers["Content-Type"] = contentType;
  //   console.log({ method, url, headers, body, contentType });
  let response;
  try {
    if (contentType === "application/json") {
      response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });
    }
    if (contentType === "multipart/form-data") {
      const formData = new FormData();
      for (const key in body) {
        console.log(key ,  body[key])
        formData.append(key, body[key]);
      }
      response = await fetch(url, {
        method,
        headers,
        body: formData,
      });
    }
    if (contentType === "application/x-www-form-urlencoded") {
      const urlEncodedData = new URLSearchParams(body).toString();
      response = await fetch(url, {
        method,
        headers,
        body: urlEncodedData,
      });
    }
    const responseBody = await response.text();
    return {
      status: response.status,
      headers: response.headers,
      body: responseBody,
    };
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}
    </script> 
    <!-- <script type="module" src="index.js"  >
    </script>  -->
       <a style="text-align: center; margin-top: 5rem;">2024 Alrights reserved {NAME}</a>
  </body>
</html>`.replace("'{JETPATH}'", `\`${t}\``).replaceAll("{NAME}", this.options?.documentation?.name || "JethPath API Doc").replaceAll("JETPATHCOLOR", this.options?.documentation?.color || "#007bff").replaceAll("{LOGO}", this.options?.documentation?.logo || "https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp").replaceAll("{INFO}", this.options?.documentation?.info || "This is a JethPath api preview."), "text/html");
        };
        console.log(`visit http://localhost:${this.port}/api-doc to see the displayed routes in UI`);
      }
      console.log(`\n Parsed ${c} handlers in ${Math.round(endTime - startTime)} milliseconds`);
    } else {
      await getHandlers(this.options?.source, false);
    }
    this.listening = true;
    console.log(`\nListening on http://localhost:${this.port}/`);
    this.server.listen(this.port);
  }
}
export {
  JetPath
};
