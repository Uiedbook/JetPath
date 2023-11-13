import { IncomingMessage } from 'http';
import { Stream } from 'stream';

type AppCTXType = {
    search: Record<string, string>;
    params: Record<string, string>;
    request: IncomingMessage;
    reply(data: unknown, ContentType?: string): void;
    throw(code: number, message: string): void;
    method?: string;
    get(field: string): string | undefined;
    set(field: string, value: string): void;
    code(code: number): void;
    pipe(stream: Stream, message: string): void;
    json(): Promise<Record<string, any>>;
    text(): Promise<string>;
    _(): any;
};
type methods = "GET" | "HEAD" | "PUT" | "POST" | "DELETE" | "PATCH";
type allowedMethods = methods[];

declare class JetPathError extends Error {
    constructor(...err: any[]);
    private static geterr;
}

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

export { AppCTXType, JetPathError, JetPath as default };
