import { IncomingMessage } from 'http';
import { Stream } from 'stream';

type AppCTXType = {
    body: any;
    search: Record<string, string>;
    params: Record<string, string>;
    request: IncomingMessage;
    reply(data: unknown, ContentType?: string): void;
    throw(code?: number, message?: string): void;
    redirect(url: string): void;
    method: string;
    get(field: string): string | undefined;
    set(field: string, value: string): void;
    code(code?: number): number;
    pipe(stream: Stream, message: string): void;
    json(): Promise<Record<string, any>>;
    text(): Promise<string>;
    _1(): any;
    _2(): any;
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

export { AppCTXType, JetPath as default };
