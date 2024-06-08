/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage } from "node:http";
import { Stream } from "node:stream";
export type Context = {
    /**
     * remove request control from the request
     */
    eject(): never;
    /**
     * reply the request
     */
    request: IncomingMessage;
    /**
     * API status
     */
    code: number;
    /**
     * an object you can set values to per request
     */
    app: Record<string, any>;
    /**
     * send a stream
     */
    sendStream(stream: Stream | string, ContentType: string): never;
    /**
     * reply the request
     *
     */
    send(data: unknown, ContentType?: string): never;
    /**
     * end the request with an error
     */
    throw(code?: number | string | Record<string, any> | unknown, message?: string | Record<string, any>): never;
    /**
     * redirect the request
     */
    redirect(url: string): never;
    /**
     * get request header values
     */
    get(field: string): string | undefined;
    /**
     * set request header values
     */
    set(field: string, value: string): void;
    /**
     * Parses the request as JSON
     */
    /**
     * get and set status code
     */
    json(): Promise<Record<string, any>>;
    /**
     * get search params after api/?
     */
    search: Record<string, string>;
    /**
     * get route params in api/:thing
     */
    params: Record<string, string>;
    /**
     * get original request
     */
    path: string;
    _1?: string | undefined;
    _2?: Record<string, string>;
    _3?: Stream | undefined;
    _4?: boolean | undefined;
    _5?: (() => never) | undefined;
} | Record<string, any>;
interface HTTPBody {
    [x: string]: {
        err?: string;
        type?: "string" | "number" | "file" | "object" | "boolean" | StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor;
        RegExp?: RegExp;
        inputAccept?: string;
        inputType?: "color" | "date" | "email" | "file" | "text" | "password" | "number" | "time" | "tel" | "datetime" | "url";
        defaultValue?: string;
        nullable?: boolean;
        ranges?: Record<number, string>;
        model?: Record<string, Record<string, any>>;
        validator?: (value: any) => boolean;
    };
}
export interface JetSchema<JetBody extends HTTPBody = Record<string, any>> {
    body?: HTTPBody;
    info?: string;
    method?: methods;
    headers?: Record<string, string>;
    search_params?: string[];
    validate?: (data?: any) => Record<keyof JetBody, any>;
}
export type contentType = "application/x-www-form-urlencoded" | "multipart/form-data" | "application/json";
export type methods = "GET" | "POST" | "OPTIONS" | "DELETE" | "HEAD" | "PUT" | "PATCH";
export type allowedMethods = methods[];
export type jetOptions = {
    apiDoc?: {
        name?: string;
        info?: string;
        color?: string;
        logo?: string;
        path?: string;
    };
    source?: string;
    credentials?: {
        cert: string;
        key: string;
    };
    APIdisplay?: "UI" | "HTTP" | false;
    port?: number;
    static?: {
        route: string;
        dir: string;
    };
    cors?: {
        allowMethods?: allowedMethods;
        secureContext?: boolean;
        allowHeaders?: string[];
        exposeHeaders?: string[];
        keepHeadersOnError?: boolean;
        maxAge?: string;
        credentials?: boolean;
        privateNetworkAccess?: any;
        origin?: string;
    } | boolean;
    websocket?: {
        idleTimeout?: number;
    } | boolean;
};
export {};
