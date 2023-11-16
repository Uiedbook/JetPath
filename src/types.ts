import { IncomingMessage } from "http";
import { Stream } from "stream";

export type AppCTXType = {
  body: any;
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage;
  reply(data: unknown, ContentType?: string): void;
  throw(code?: number | string, message?: string): void;
  redirect(url: string): void;
  method: string;
  get(field: string): string | undefined;
  set(field: string, value: string): void;
  code(code?: number): number;
  pipe(stream: Stream, message: string): void;
  json(): Promise<Record<string, any>>;
  text(): Promise<string>;
  statusCode: number;
  _1: any;
  _2: Record<string, string>;
  _3: Stream | undefined;
};

export type allowedMethods = methods[];

export type methods =
  | "GET"
  | "POST"
  | "OPTIONS"
  | "DELETE"
  | "HEAD"
  | "PUT"
  | "PATCH";
