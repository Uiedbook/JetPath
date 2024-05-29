import {
  PathLike,
  WriteStream,
  createReadStream,
  createWriteStream,
  unlink,
} from "node:fs";
import os from "node:os";
import { cwd } from "node:process";
import busboy from "busboy";
import { AppCTX, JetPlugin } from "../dist/index.js";
import path from "node:path";

export const busboyjet = new JetPlugin({
  name: "busboyjet",
  version: "1.0.0",
  executor({ runtime, server }) {
    return {
      formData(ctx: AppCTX) {
        return new Promise((res, rej) => {
          const data = {};
          try {
            const bb = busboy({ headers: ctx.request.headers });
            bb.on("file", (name: string, file: any, info: any) => {
              const oldPath = path.join(os.tmpdir(), info.filename);
              info.location = oldPath;
              info.saveTo = (name: string) => {
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
            bb.on("field", (name: string, val: any) => {
              data[name] = val !== "undefined" ? val : undefined;
            });
            bb.on("close", () => {
              res(data);
            });
            ctx.request.pipe(bb);
          } catch (error) {
            rej(error);
          }
        });
      },
    };
  },
});
