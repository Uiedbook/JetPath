import { createReadStream } from "node:fs";
import { _DONE, _JetPath_paths, _OFF, UTILS, validator } from "./functions.js";
export class JetPlugin {
    constructor({ executor }) {
        this.executor = executor;
    }
    _setup(init) {
        return this.executor.call(this, init);
    }
}
export class Log {
    // Define ANSI escape codes for colors and styles
    static { this.colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
        fgBlack: "\x1b[30m",
        fgRed: "\x1b[31m",
        fgGreen: "\x1b[32m",
        fgYellow: "\x1b[33m",
        fgBlue: "\x1b[34m",
        fgMagenta: "\x1b[35m",
        fgCyan: "\x1b[36m",
        fgWhite: "\x1b[37m",
        bgBlack: "\x1b[40m",
        bgRed: "\x1b[41m",
        bgGreen: "\x1b[42m",
        bgYellow: "\x1b[43m",
        bgBlue: "\x1b[44m",
        bgMagenta: "\x1b[45m",
        bgCyan: "\x1b[46m",
        bgWhite: "\x1b[47m",
    }; }
    static log(message, color) {
        console.log(`${color}%s${Log.colors.reset}`, `Jetpath: ${message}`);
    }
    static info(message) {
        Log.log(message, Log.colors.fgBlue);
    }
    static warn(message) {
        Log.log(message, Log.colors.fgYellow);
    }
    static error(message) {
        Log.log(message, Log.colors.fgRed);
    }
    static success(message) {
        Log.log(message, Log.colors.fgGreen);
    }
}
export class Context {
    constructor() {
        this.code = 200;
        // ?
        this.app = {};
        //? load
        this._1 = undefined;
        // ? header of response
        this._2 = {};
        // //? stream
        this._3 = undefined;
        //? used to know if the request has ended
        this._4 = false;
        //? used to know if the request has been offloaded
        this._5 = false;
        //? response
        this._6 = false;
    }
    // ? reset the COntext to default state
    _7(req, path, params, search) {
        this.request = req;
        this.method = req.method;
        this.params = params || {};
        this.search = search || {};
        this.path = path;
        //? load
        this._1 = undefined;
        // ? header of response
        this._2 = {};
        // //? stream
        this._3 = undefined;
        //? used to know if the request has ended
        this._4 = false;
        //? used to know if the request has been offloaded
        this._5 = false;
        //? response
        this._6 = false;
    }
    send(data, contentType) {
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
        if (!this._5)
            throw _DONE;
        this._5();
        return undefined;
    }
    validate(data = {}) {
        return validator(_JetPath_paths[this.method][this.path].body, data);
    }
    redirect(url) {
        this.code = 301;
        if (!this._2) {
            this._2 = {};
        }
        this._2["Location"] = url;
        this._1 = undefined;
        this._4 = true;
        if (!this._5)
            throw _DONE;
        this._5();
        return undefined;
    }
    throw(code = 404, message = "Not Found") {
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
                    }
                    else if (typeof message === "string") {
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
        if (!this._5)
            throw _DONE;
        this._5();
        return undefined;
    }
    get(field) {
        if (field) {
            if (UTILS.runtime["node"]) {
                // @ts-expect-error
                return this.request.headers[field];
            }
            return this.request.headers.get(field);
        }
        return undefined;
    }
    set(field, value) {
        if (!this._2) {
            this._2 = {};
        }
        if (field && value) {
            this._2[field] = value;
        }
    }
    eject() {
        throw _OFF;
    }
    sendStream(stream, ContentType) {
        if (!this._2) {
            this._2 = {};
        }
        this._2["Content-Disposition"] = `inline;filename="unnamed.bin"`;
        this._2["Content-Type"] = ContentType;
        if (typeof stream === "string") {
            this._2["Content-Disposition"] = `inline;filename="${stream.split("/").at(-1) || "unnamed.bin"}"`;
            if (UTILS.runtime["bun"]) {
                // @ts-expect-error
                stream = Bun.file(stream);
            }
            else {
                stream = createReadStream(stream);
            }
        }
        this._3 = stream;
        this._4 = true;
        if (!this._5)
            throw _DONE;
        this._5();
        return undefined;
    }
    json() {
        // TODO:  calling this function twice cause an request hang in nodejs
        if (!UTILS.runtime["node"]) {
            try {
                this.body = this.request.json();
                return this.body;
            }
            catch (error) {
                return {};
            }
        }
        return new Promise((r) => {
            let body = "";
            // @ts-expect-error
            this.request.on("data", (data) => {
                body += data.toString();
            });
            // @ts-expect-error
            this.request.on("end", () => {
                try {
                    this.body = JSON.parse(body);
                    r(this.body);
                }
                catch (error) {
                    r({});
                }
            });
        });
    }
}
