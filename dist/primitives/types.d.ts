/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage } from "http";
import { Stream } from "node:stream";
export type AppCTXType<Type = {}> = {
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
    _3?: Stream | undefined;
    _4?: boolean | undefined;
    pipe(stream: Stream, ContentType: string): void;
    app: Record<string, any>;
} & Type;
export type methods = "GET" | "POST" | "OPTIONS" | "DELETE" | "HEAD" | "PUT" | "PATCH";
export type allowedMethods = methods[];
