/// <reference types="node" />
import { type Context, type JetSchema, type allowedMethods, type jetOptions, type methods } from "./types.js";
import { Stream } from "node:stream";
import type { JetPlugin } from "./classes.js";
/**
 * an inbuilt CORS post hook
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 *  - {Boolean} secureContext `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` headers.', default is false
 *    @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
 *  - {Boolean} privateNetworkAccess handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`, default to false
 *    @see https://wicg.github.io/private-network-access/
 * @return {Function} cors post hook
 * @public
 */
export declare function corsHook(options: {
    exposeHeaders?: string[];
    allowMethods?: allowedMethods;
    allowHeaders: string[];
    keepHeadersOnError?: boolean;
    maxAge?: string;
    credentials?: boolean;
    secureContext?: boolean;
    privateNetworkAccess?: any;
    origin: string[];
}): Function;
export declare const UTILS: {
    wsFuncs: never[];
    ctx: {
        app: {
            body: null;
        };
        request: any;
        code: number;
        send(data: unknown, contentType: string): never;
        redirect(url: string): never;
        throw(code?: unknown, message?: unknown): never;
        get(field: string): string | undefined;
        set(field: string, value: string): void;
        eject(): never;
        sendStream(stream: Stream | string, ContentType: string): never;
        json<Type = Record<string, any>>(): Promise<Type>;
        params: {};
        search: {};
        path: string;
        _1: any;
        _2: any;
        _3: any;
        _4: boolean;
        _5: any;
    };
    ae(cb: {
        (): any;
        (): any;
        (): void;
    }): boolean;
    set(): void;
    runtime: Record<string, boolean>;
    validators: Record<string, JetSchema<Record<string, any>>>;
    server(plugs: JetPlugin[]): {
        listen: any;
    } | void;
};
export declare let _JetPath_paths: Record<methods, Record<string, (ctx: Context) => void | Promise<void>>>;
export declare const _JetPath_hooks: Record<string, (ctx: Context) => void | Promise<void>>;
export declare const _JetPath_app_config: {
    cors: (ctx: Context) => void;
    set(this: any, opt: string, val: any): void;
};
export declare function getHandlers(source: string, print: boolean): Promise<void>;
export declare function validate(schema: JetSchema, data: any): Record<string, any>;
export declare const compileUI: (UI: string, options: any, api: string) => string;
export declare const compileAPI: (options: jetOptions) => [number, string];
