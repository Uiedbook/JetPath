import { createReadStream, createWriteStream, unlink } from "node:fs";
import os from "node:os";
import { cwd } from "node:process";
import busboy from "busboy";
import { JetPlugin } from "../dist/index.js";
import path from "node:path";
export const busboyjet = new JetPlugin({
    executor({ runtime, server, routesObject }) {
        return {
            formData(ctx) {
                return new Promise((res, rej) => {
                    const data = {};
                    try {
                        const bb = busboy({ headers: ctx.request.headers });
                        bb.on("file", (name, file, info) => {
                            const oldPath = path.join(os.tmpdir(), info.filename);
                            info.location = oldPath;
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
                    }
                    catch (error) {
                        rej(error);
                    }
                });
            },
        };
    },
});
