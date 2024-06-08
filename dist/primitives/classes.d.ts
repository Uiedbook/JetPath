/// <reference types="node" />
import type { IncomingMessage, Server, ServerResponse } from "http";
export declare class JetPlugin {
    name?: string;
    version?: string;
    executor: (init: {
        runtime: {
            node: boolean;
            bun: boolean;
            deno: boolean;
        };
        server: Server<typeof IncomingMessage, typeof ServerResponse>;
    }) => Record<string, Function>;
    constructor({ name, version, executor, }: {
        name: string;
        version: string;
        executor: (init: {
            runtime: {
                node: boolean;
                bun: boolean;
                deno: boolean;
            };
            server: Server<typeof IncomingMessage, typeof ServerResponse>;
        }) => Record<string, Function>;
    });
    _setup(init: {
        runtime: {
            node: boolean;
            bun: boolean;
            deno: boolean;
        };
        server: Server<typeof IncomingMessage, typeof ServerResponse>;
    }): any;
}
