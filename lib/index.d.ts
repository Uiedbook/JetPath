import { IncomingMessage } from 'http';

type AppCTXType<Type = {}> = {
    json(): Promise<Record<string, any>> | null;
    body?: any;
    code: number;
    search?: Record<string, string>;
    params?: Record<string, string>;
    request: IncomingMessage;
    method: string;
    reply(data: unknown, ContentType?: string): void;
    throw(code?: number | string | Record<string, any> | unknown, message?: string | Record<string, any>): void;
    redirect(url: string): void;
    get(field: string): string | undefined;
    set(field: string, value: string): void;
    _1?: string | undefined;
    _2?: Record<string, string>;
    _4?: boolean | undefined;
} & Type;
type methods = "GET" | "POST" | "OPTIONS" | "DELETE" | "HEAD" | "PUT" | "PATCH";
type allowedMethods = methods[];

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
