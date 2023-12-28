import { IncomingMessage } from "http";
import { Stream } from "stream";

export type AppCTXType<Type = {}> = {
  app: Record<string, unknown>;
  // files(): Promise<any>;
  json(): Promise<Record<string, any>> | null;
  text(): Promise<string>;
  body: any;
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage;
  method: string;
  reply(data: unknown, ContentType?: string): void;
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): void;
  redirect(url: string): void;
  get(field: string): string | undefined;
  statusCode: number;
  set(field: string, value: string): void;
  pass(field: string, value: unknown): void;
  pipe(stream: Stream, message: string): void;
  _1: string | undefined;
  _2: Record<string, string>;
  _3: Stream | undefined;
  _4: boolean | undefined;
} & Type;

export type methods =
  | "GET"
  | "POST"
  | "OPTIONS"
  | "DELETE"
  | "HEAD"
  | "PUT"
  | "PATCH";

export type allowedMethods = methods[];
