import { IncomingMessage } from "http";
import { Stream } from "stream";

export type AppCTXType = {
  app: Record<string, unknown>;
  json(): Promise<Record<string, any>>;
  text(): Promise<string>;
  body: any;
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage;
  method: string;
  reply(data: unknown, ContentType?: string): void;
  throw(
    code: number | string | Record<string, any>,
    message: string | Record<string, any>
  ): void;
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

export type allowedMethods = methods[];

export type methods =
  | "GET"
  | "POST"
  | "OPTIONS"
  | "DELETE"
  | "HEAD"
  | "PUT"
  | "PATCH";
