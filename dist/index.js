// src/primitives/functions.ts
import {opendir} from "node:fs/promises";
import {URLSearchParams} from "node:url";
import path from "node:path";
import {cwd} from "node:process";
import {createServer} from "node:http";
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
        ctx.set("Cross-Origin-Opener-Policy", "same-origin");
        ctx.set("Cross-Origin-Embedder-Policy", "require-corp");
      }
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
    } else {
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
    const { err, type, nullable, RegExp, validate: validate2 } = value;
    if (!data[prop] && nullable) {
      continue;
    }
    if (!data[prop] && !nullable) {
      if (err) {
        errout = err;
      }
      errout = ` ${prop} is required`;
    }
    if (validate2 && !validate2(data[prop])) {
      if (err) {
        errout = err;
      }
      errout = ` ${prop} must is invalid`;
    }
    if (typeof RegExp === "object" && !RegExp.test(data[prop])) {
      if (err) {
        errout = err;
      }
      errout = ` ${prop} must is invalid`;
    }
    if (typeof type === "function" && (!type(data[prop]) || typeof type(data[prop]) !== typeof type())) {
      if (err) {
        errout = err;
      }
      errout = ` ${prop} type is invalid ${data[prop]}`;
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
    if (opt === "cors" && val !== false) {
      this.cors = corsHook({
        exposeHeaders: [],
        allowMethods: [],
        allowHeaders: ["Content-Type"],
        maxAge: "",
        keepHeadersOnError: true,
        secureContext: false,
        privateNetworkAccess: undefined,
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
  const paseredR = URLPARSER(req.method, req.url);
  if (paseredR) {
    const ctx = createCTX(req, UTILS.decorators);
    const r = paseredR[0];
    ctx.params = paseredR[1];
    ctx.search = paseredR[2];
    ctx.path = paseredR[3];
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
    if (_JetPath_app_config.cors && req.method === "OPTIONS") {
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
  if (/(GET|POST|PUT|PATCH|DELETE|OPTIONS|BODY)/.test(method)) {
    return [method, path2];
  }
  return;
};
var URLPARSER = (method, url) => {
  const routes = _JetPath_paths[method];
  if (url[0] !== "/") {
    url = url.slice(url.indexOf("/", 7));
  }
  if (routes[url]) {
    return [routes[url], {}, {}, url];
  }
  if (typeof routes === "function") {
    routes();
    return;
  }
  if (routes[url + "/"]) {
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
  options;
  server;
  listening = false;
  constructor(options) {
    this.options = options || { displayRoutes: true };
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
    if (typeof this.options !== "object" || this.options.displayRoutes !== false) {
      let c = 0, t = "";
      console.log("JetPath: compiling...");
      const startTime = performance.now();
      await getHandlers(this.options?.source, true);
      const endTime = performance.now();
      console.log("JetPath: done.");
      console.log(_JetPath_hooks);
      for (const k in _JetPath_paths) {
        const r = _JetPath_paths[k];
        if (r && Object.keys(r).length) {
          for (const p in r) {
            const b = UTILS.validators[p];
            const j = {};
            if (b) {
              for (const ke in b) {
                j[ke] = typeof b[ke].type();
              }
            }
            const api = `\n
${k} http://localhost:${port}${p} HTTP/1.1
${b && k !== "GET" ? "\n" + JSON.stringify(j) : ""}
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
        _JetPath_paths["GET"]["/JetPath-ui"] = (ctx) => {
          ctx.reply(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JetPath API Preview</title>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
      }

      header {
        background-color: #007bff; 
        text-align: center;
        color: #fff;
        font-size: 24px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .request-container {
        margin: 20px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .request {
        margin-bottom: 10px;
      }

      .headers,
      .payload {
        margin-left: 20px;
      }

      .payload {
        white-space: pre-wrap;
      }

      .test-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 10px 18px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease-in-out;
      }

      .test-button:hover {
        background-color: #0056b3;
      }

      .response-container {
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        display: none;
        margin: 20px;
        padding: 20px;
      }
      textarea {
        margin-top: 0.4rem;
        min-width: 50vw;
        min-height: 3rem;
        padding: 1rem;
        border: 3px solid #007bff;
        border-radius: 20px;
        outline: none;
      }
      textarea#keys {
        margin-top: 0.4rem;
        min-width: 30vw;
        min-height: 5rem;
        padding: 0.6rem;
        border: 2px solid #007bff;
        border-radius: 10px;
        outline: none;
      }
      textarea:focus {
        border: 3px solid #007bff5e;
      }
    </style>
  </head>
  <body>
    <header><img src="https://raw.githubusercontent.com/Uiedbook/JetPath/main/icon-transparent.webp" alt="JetPath" style="width: 7rem;" > <h1>JetPath API Preview</h1></header>
    <div class="request-container">
      <h4>headers:</h4>
      <textarea id="keys">
 {
   "Authetication": "Bearer ****"
     
 }</textarea
      >
    </div>
    <h3 class="request-container">Requests</h>
    <script>
      function parseApiDocumentation(apiDocumentation) {
        const requests = (apiDocumentation
          .split("###")
          .map((request) => request.trim())).filter((a)=>a !== "");
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
        const payload =
          payloadIndex !== 0 ? lines.slice(payloadIndex).join("\\n") : null;

        return {
          method,
          url,
          httpVersion,
          headers,
          payload,
        };
      }
      // Example API documentation
      const apiDocumentation = '{JETPATH}';

      // Parse API documentation
      const parsedApi = parseApiDocumentation(apiDocumentation);

      // Display API documentation in UI and add testing functionality
      parsedApi.forEach((request) => {
        const requestContainer = document.createElement("div");
        requestContainer.classList.add("request-container");

        const requestInfo = document.createElement("div");
        requestInfo.classList.add("request");
        const urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.value = request.url;
        requestInfo.appendChild(document.createTextNode(request.method + " "));
        requestInfo.appendChild(urlInput);
        requestInfo.appendChild(
          document.createTextNode(" " + request.httpVersion)
        );
        requestContainer.appendChild(requestInfo);

        const headersContainer = document.createElement("div");
        headersContainer.classList.add("headers");
        headersContainer.innerHTML = "<strong>Headers:</strong>";
        for (const [key, value] of Object.entries(request.headers)) {
          const headerInput = document.createElement("input");
          headerInput.type = "text";
          headerInput.value = key+": "+value;
          headersContainer.appendChild(document.createElement("br"));
          headersContainer.appendChild(headerInput);
        }
        requestContainer.appendChild(headersContainer);

        if (request.payload) {
          const payloadContainer = document.createElement("div");
          payloadContainer.classList.add("payload");
          payloadContainer.innerHTML = "<strong>Payload:</strong><br>";
          const payloadTextarea = document.createElement("textarea");
          payloadTextarea.value = request.payload;
          payloadTextarea.addEventListener("change",()=>{
            request.payload = payloadTextarea.value;
          })
          payloadContainer.appendChild(payloadTextarea);
          requestContainer.appendChild(payloadContainer);
        }

        const testButton = document.createElement("button");
        testButton.classList.add("test-button");
        testButton.textContent = "Test API";
        testButton.addEventListener("click", async () => {
          const updatedRequest = {
            method: requestInfo.firstChild.textContent.trim(),
            url: urlInput.value.trim(),
            httpVersion: requestInfo.lastChild.textContent.trim(),
            headers: {},
            payload: request.payload,
          };

          headersContainer.querySelectorAll("input").forEach((headerInput) => {
            const [key, value] = headerInput.value
              .split(":")
              .map((part) => part.trim());
            if (key) {
              updatedRequest.headers[key] = value || "";
            }
          });

          if (request.payload) {
            updatedRequest.payload = request.payload.trim();
          }
const keys = document.getElementById("keys");
let keysHeaders={}
try { 
  keysHeaders = JSON.parse(keys.value);
} catch (error) {
  alert(error);
}
          const response = await testApi(
            updatedRequest.method,
            updatedRequest.url,
            Object.assign(updatedRequest.headers, keysHeaders),
            updatedRequest.payload || undefined
          ); 
          showApiResponse(response);
        });
        requestContainer.appendChild(testButton);

        const responseContainer = document.createElement("div");
        responseContainer.classList.add("response-container");
        document.body.appendChild(requestContainer);
        document.body.appendChild(responseContainer);

        function showApiResponse(response) {
          responseContainer.innerHTML = "<strong>API Response:</strong><br>";
          responseContainer.innerHTML += "<pre><h3 style='color:"+(response.status<400?"green":"red")+"';>"+response.status+"</h3></pre>";
          responseContainer.innerHTML += "<pre>"+response.body+"</pre>";
          responseContainer.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
          responseContainer.style.display = "block";
        }
      });

      async function testApi(method, url, headers, payload) {
        try {
          const response = await fetch(url, {
            method,
            headers,
            body: payload,
          });

          const responseBody = await response.text();
          return {
            status: response.status,
            headers: response.headers,
            body: responseBody,
          };
        } catch (error) {
          return { error: error.message };
        }
      }
    </script>
  </body>
</html>`.replace("'{JETPATH}'", `\`${t}\``), "text/html");
        };
        console.log(`visit http://localhost:${port}/JetPath-ui to see the displayed routes in UI`);
      }
      console.log(`\n Parsed ${c} handlers in ${Math.round(endTime - startTime)} milliseconds`);
    } else {
      await getHandlers(this.options?.source, false);
    }
    this.listening = true;
    console.log(`\nListening on http://localhost:${port}/`);
    this.server.listen(port);
  }
}
export {
  JetPath
};
