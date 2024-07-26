import mime from "mime/lite";
import { access, writeFile } from "node:fs/promises";
import { _JetPath_app_config, _JetPath_paths, compileAPI, compileUI, getHandlers, UTILS, } from "./primitives/functions.js";
import { JetPlugin, Log } from "./primitives/classes.js";
export class JetPath {
    constructor(options) {
        this.listening = false;
        this.plugs = [];
        this.options = options || {
            APIdisplay: "UI",
        };
        // ? setting up app configs
        for (const [k, v] of Object.entries(this.options)) {
            _JetPath_app_config.set(k, v);
        }
        if (!options?.cors) {
            _JetPath_app_config.set("cors", true);
        }
    }
    use(plugin) {
        if (this.listening) {
            throw new Error("Your app is listening new plugins can't be added.");
        }
        if (plugin instanceof JetPlugin) {
            this.plugs.push(plugin);
        }
        else {
            throw Error("invalid Jetpath plugin");
        }
    }
    async listen() {
        // ? kickoff server
        this.server = UTILS.server(this.plugs);
        // ? {-view-} here is replaced at build time to html
        let UI = `{{view}}`;
        // ? setting up static server
        if (this.options?.static?.route && this.options?.static?.dir) {
            _JetPath_paths["GET"][this.options.static.route + "/*"] = async (ctx) => {
                const fileName = this.options?.static?.dir +
                    "/" +
                    decodeURI(ctx.params?.["extraPath"] || "").split("?")[0];
                if (fileName) {
                    const contentType = mime.getType(fileName.split(".").at(-1) || "application/octet-stream");
                    try {
                        await access(fileName);
                    }
                    catch (error) {
                        return ctx.throw();
                    }
                    return ctx.sendStream(fileName, contentType);
                }
                else {
                    return ctx.throw();
                }
            };
            _JetPath_paths["GET"][this.options.static.route + "/*"].method = "GET";
        }
        //? setting up api viewer
        if (this.options?.APIdisplay !== undefined) {
            Log.info("Compiling...");
            const startTime = performance.now();
            // ? Load all jetpath functions described in user code
            const errorsCount = await getHandlers(this.options?.source, true);
            const endTime = performance.now();
            Log.info("Done.");
            //? compile API
            const [handlersCount, compiledAPI] = compileAPI(this.options);
            // ? render API in UI
            if (this.options?.APIdisplay === "UI") {
                UI = compileUI(UI, this.options, compiledAPI);
                _JetPath_paths["GET"][this.options?.apiDoc?.path || "/api-doc"] = (ctx) => {
                    ctx.send(UI, "text/html");
                };
                Log.success(`visit http://localhost:${this.options?.port || 8080}${this.options?.apiDoc?.path || "/api-doc"} to see the displayed routes in UI`);
            }
            // ? render API in a .HTTP file
            if (this.options?.APIdisplay === "HTTP") {
                await writeFile("api-doc.http", compiledAPI);
                Log.success(`Check http file ./api-doc.http to test the routes Visual Studio rest client extension`);
            }
            Log.info(`Parsed ${handlersCount} handlers in ${Math.round(endTime - startTime)} milliseconds`);
            if (errorsCount) {
                for (let i = 0; i < errorsCount.length; i++) {
                    Log.error(`\nReport: ${errorsCount[i].file} file was not loaded due to \n "${errorsCount[i].error}" error; \n please resolve!`);
                }
            }
        }
        else {
            // ? Load all jetpath functions described in user code
            const errorsCount = await getHandlers(this.options?.source, false);
            if (errorsCount) {
                for (let i = 0; i < errorsCount.length; i++) {
                    Log.error(`\nReport: ${errorsCount[i].file} file was not loaded due to \n "${errorsCount[i].error}" error; \n please resolve!`);
                }
            }
        }
        Log.success(`Listening on http://localhost:${this.options?.port || 8080}`);
        // ? start server
        this.listening = true;
        this.server.listen(this.options?.port || 8080);
    }
}
export { JetPlugin } from "./primitives/classes.js";
