import mime from "mime/lite";
import { access, writeFile } from "node:fs/promises";
import { _JetPath_app_config, _JetPath_hooks, _JetPath_paths, compileUI, getHandlers, UTILS, } from "./primitives/functions.js";
import {} from "./primitives/types.js";
export class JetPath {
    server;
    listening = false;
    options;
    port;
    constructor(options) {
        this.port = this.options?.port || 8080;
        this.options = options || { displayRoutes: true };
        // ? setting http routes automatically
        // ? seeting up app configs
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
            // console.log({ decorations });
            throw new Error("could not add decoration to ctx");
        }
        UTILS.decorators = Object.assign(UTILS.decorators, decorations);
    }
    async listen() {
        // ? {-view-} here is replaced at build time to html
        let UI = `<!DOCTYPE html>
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
  /* white-space: pre; */
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
  /* border-radius: 10px; */
}
.card .card-header {
  border: none;
  /* border-radius: 10px; */
  padding: 1rem;
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
  align-items: center;
  justify-content: center;
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
  margin: 5rem 1rem 1rem 1rem;
}
.comment span {
  font-size: 2rem;
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
  import  {
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

const loading_svg = ()=> svg('<svg width="200" height="200" viewBox="0 0 100 100" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g style="transform-origin:50% 50%;transform:scale(.8)"><g style="animation:1s linear -1s infinite normal forwards running bounce-4a226a58-420c-4a1d-a9fe-6078f1e12117;transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"><path d="M30 72.889c-8.09 0-14.648-4.099-14.648-9.156v19.611c0 5.057 6.558 9.156 14.648 9.156s14.648-4.099 14.648-9.156V63.733c0 5.057-6.558 9.156-14.648 9.156z" fill="#f8b26a" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/><ellipse cx="30" cy="63.733" rx="14.648" ry="9.156" fill="#f47e60" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/></g><g style="animation:1s linear -.945s infinite normal forwards running bounce-4a226a58-420c-4a1d-a9fe-6078f1e12117;transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"><path d="M70 51.889c-8.09 0-14.648-4.099-14.648-9.156v40.611c0 5.057 6.558 9.156 14.648 9.156s14.648-4.099 14.648-9.156V42.733c0 5.057-6.558 9.156-14.648 9.156z" fill="#a0c8d7" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/><ellipse cx="70" cy="42.733" rx="14.648" ry="9.156" fill="#77a4bd" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/></g><g style="animation:1s linear -.89s infinite normal forwards running bounce-4a226a58-420c-4a1d-a9fe-6078f1e12117;transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"><path d="M30 25.812c-8.09 0-14.648-4.099-14.648-9.156v38.077c0 5.057 6.558 9.156 14.648 9.156s14.648-4.099 14.648-9.156V16.656c0 5.057-6.558 9.156-14.648 9.156z" fill="rgba(255, 255, 255, 0.804)" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/><ellipse cx="30" cy="16.656" rx="14.648" ry="9.156" fill="#ccc" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/></g><g style="animation:1s linear -.835s infinite normal forwards running bounce-4a226a58-420c-4a1d-a9fe-6078f1e12117;transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"><path d="M70 25.812c-8.09 0-14.648-4.099-14.648-9.156v17.077c0 5.057 6.558 9.156 14.648 9.156s14.648-4.099 14.648-9.156V16.656c0 5.057-6.558 9.156-14.648 9.156z" fill="rgba(255, 255, 255, 0.804)" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/><ellipse cx="70" cy="16.656" rx="14.648" ry="9.156" fill="#ccc" style="transform-origin:50px 50px;transform:matrix(1,0,0,1,0,0)"/></g></g><style id="a">@keyframes bounce-4a226a58-420c-4a1d-a9fe-6078f1e12117{0%{animation-timing-function:cubic-bezier(.1361,.2514,.2175,.8786);transform:translate(0,0) scaleY(1)}37%{animation-timing-function:cubic-bezier(.7674,.1844,.8382,.7157);transform:translate(0,-11.988px) scaleY(1)}72%{animation-timing-function:cubic-bezier(.2491,.4828,.4773,.9595);transform:translate(0,0) scaleY(1)}87%{animation-timing-function:cubic-bezier(.5084,.1576,.7399,.5564);transform:translate(0,4.257px) scaleY(.871)}to{transform:translate(0,0) scaleY(1)}}</style></svg>')

//     function syntaxHighlight(json) {
//   if (typeof json != "string") {
//     json = JSON.stringify(json, null, "\t");
//   }
  
//   json = json
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;");
  
//   return json.replace(
// /"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g

// ,
//     // /("(\\u[a-zA-Z0-9]{4}|[0-9]|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
//     function(match) {
//       console.log({match});
//       var cls = "";
//       if (/^"/.test(match)) {
//         if (/:$/.test(match)) {
//           cls = "key";
//         } else {
//           cls = "string";
//         }
//       } else if (/true|false/.test(match)) {
//         cls = "boolean";
//       } else if (/null/.test(match)) {
//         cls = "null";
//       } else if (/[0-9]/.test(match)) {
//         cls = "number";
//       }
//       return '<span class="' + cls + '">' + match + "</span>";
//     }
//   );
// }
function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, null, "\t");
  }

  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("[^"\\]*(?:\\.[^"\\]*)*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?\b)/g,
    function(match) {
      console.log({match});
      var cls = "";
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
      } else if (/^-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?$/.test(match)) {
        cls = "number";
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
function parseINAPIBody(api = {
    Authorization: "Bearer ****",
  }) {
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
  parseINAPIBody(/*TODO: put the general api info here*/)
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
    div( 
      h5(response.status || 404, {
        style: { color: (response.status || 404) < 400 ? "green" : "red" },
      })
    )
  );
  if (response?.body?.includes("{")||response?.body?.includes("[")) {
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
            document.getElementById("response-"+i).style.display = "flex"
            document.getElementById("response-"+i).innerHTML = ""
            document.getElementById("response-"+i).appendChild(loading_svg());
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
    console.log({ method, url, headers, body, contentType });
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
    console.log(error?.message||error);
    return { error: error.message };
  }
}
    </script> 
    <!-- <script type="module" src="index.js"  >
    </script>  -->
       <a style="text-align: center; margin-top: 5rem;">2024 Alrights reserved {NAME}</a>
  </body>
</html>`;
        if (this.options?.publicPath?.route && this.options?.publicPath?.dir) {
            _JetPath_paths["GET"][this.options.publicPath.route + "/*"] = async (ctx) => {
                const fileName = this.options.publicPath.dir + "/" + ctx.params?.["extraPath"];
                if (fileName) {
                    const contentType = mime.getType(fileName.split(".")[1]) || "application/octet-stream";
                    try {
                        await access(fileName);
                    }
                    catch (error) {
                        return ctx.throw();
                    }
                    return ctx.pipe(fileName, contentType);
                }
                else {
                    return ctx.throw();
                }
            };
        }
        if (typeof this.options !== "object" ||
            this.options?.displayRoutes !== false) {
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
                        const v = UTILS.validators[p] || {};
                        const b = v?.body || {};
                        const h_inial = v?.headers || {};
                        const h = [];
                        for (const name in h_inial) {
                            h.push(name + ":" + h_inial[name]);
                        }
                        const j = {};
                        if (b) {
                            for (const ke in b) {
                                j[ke] = b[ke]?.inputType || "text";
                            }
                        }
                        const api = `\n
${k} ${this.options?.displayRoutes === "UI"
                            ? "[--host--]"
                            : "http://localhost:" + this.port}${p} HTTP/1.1
${h.length ? h.join("\n") : ""}\n
${v && (v.method === k && k !== "GET" ? k : "") ? JSON.stringify(j) : ""}\n${v && (v.method === k ? k : "") && v?.["info"]
                            ? "#" + v?.["info"] + "-JETE"
                            : ""}
###`;
                        if (this.options.displayRoutes) {
                            t += api;
                        }
                        else {
                            console.log(api);
                        }
                        c += 1;
                    }
                }
            }
            if (this.options?.displayRoutes === "UI") {
                UI = compileUI(UI, this.options, t);
                _JetPath_paths["GET"]["/api-doc"] = (ctx) => {
                    ctx.send(UI, "text/html");
                };
                console.log(`visit http://localhost:${this.port}/api-doc to see the displayed routes in UI`);
            }
            // if (this.options?.displayRoutes === "FILE") {
            //   UI = compileUI(UI, this.options, t);
            //   await writeFile("api-doc.html", UI);
            //   console.log(
            //     `visit http://localhost:${this.port}/api-doc to see the displayed routes in UI`
            //   );
            // }
            if (this.options?.displayRoutes === "HTTP") {
                await writeFile("api-doc.http", t);
                console.log(`Check ./api-doc.http to test the routes Visual Studio rest client extension`);
            }
            console.log(`\n Parsed ${c} handlers in ${Math.round(endTime - startTime)} milliseconds`);
        }
        else {
            await getHandlers(this.options?.source, false);
        }
        this.listening = true;
        console.log(`\nListening on http://localhost:${this.port}/`);
        this.server.listen(this.port);
    }
}
