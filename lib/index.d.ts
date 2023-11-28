import { IncomingMessage } from 'http';
import { Stream } from 'stream';

type AppCTXType = {
    app: Record<string, unknown>;
    json(): Promise<Record<string, any>>;
    text(): Promise<string>;
    body: any;
    search: Record<string, string>;
    params: Record<string, string>;
    request: IncomingMessage;
    method: string;
    reply(data: unknown, ContentType?: string): void;
    throw(code: number | string | Record<string, any> | unknown, message?: string | Record<string, any>): void;
    redirect(url: string): void;
    get(field: string): string | undefined;
    statusCode: number;
    set(field: string, value: string): void;
    pass(field: string, value: unknown): void;
    pipe(stream: Stream, message: string): void;
    _1: any;
    _2: Record<string, string>;
    _3: Stream | undefined;
};
type allowedMethods = methods[];
type methods = "GET" | "POST" | "OPTIONS" | "DELETE" | "HEAD" | "PUT" | "PATCH";

declare class JetPath {
    options: any;
    server: any;
    constructor(options?: {
        source?: string;
        credentials?: any;
        printRoutes?: boolean;
        port?: number;
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
    });
    listen(): Promise<void>;
}

export { AppCTXType, JetPath };
