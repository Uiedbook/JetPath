import { createReadStream, createWriteStream, unlink, } from "fs";
import os from "node:os";
import { cwd } from "node:process";
import busboy from "busboy";
import { JetPlugin } from "../dist/index.js";
import path from "path";
export const busboyjet = new JetPlugin({
    name: "busboyjet",
    version: "1.0.0",
    executor({ runtime, server }) {
        return {
            formData(ctx) {
                return new Promise((res) => {
                    const data = {};
                    const bb = busboy({ headers: ctx.request.headers });
                    bb.on("file", (name, file, info) => {
                        const oldPath = path.join(os.tmpdir(), info.filename);
                        // info.location = saveTo;
                        info.saveTo = (name) => {
                            const newPath = path.resolve(cwd(), name);
                            return new Promise((res, rej) => {
                                var readStream = createReadStream(oldPath);
                                var writeStream = createWriteStream(newPath);
                                readStream.on("error", (e) => {
                                    rej(e);
                                });
                                writeStream.on("error", (e) => {
                                    rej(e);
                                });
                                readStream.on("close", function () {
                                    unlink(oldPath, (e) => {
                                        rej(e);
                                    });
                                    res(undefined);
                                });
                                readStream.pipe(writeStream);
                            });
                        };
                        data[name] = info;
                        file.pipe(createWriteStream(oldPath));
                    });
                    bb.on("field", (name, val) => {
                        data[name] = val !== "undefined" ? val : undefined;
                    });
                    bb.on("close", () => {
                        res(data);
                    });
                    ctx.request.pipe(bb);
                });
            },
        };
    },
});
