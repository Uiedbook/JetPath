import { IncomingMessage } from "http";
import { Stream } from "node:stream";

export type AppCTX<Type = {}> = {
  json(): Promise<Record<string, any>> | null;
  validate(data: any): Record<string, any>;
  body?: Record<string, any>;
  code: number;
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage;
  method: string;
  path: string;
  reply(data: unknown, ContentType?: string): void;
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): void;
  redirect(url: string): void;
  get(field: string): string | undefined;
  set(field: string, value: string): void;
  _1?: string | undefined;
  _2?: Record<string, string>;
  _3?: Stream | undefined;
  _4?: boolean | undefined;
  pipe(stream: Stream | string, ContentType: string): void;
  app: Record<string, any>;
  // files(): Promise<any>;
} & Type;
export interface Schema {
  body: Record<
    string,
    {
      err?: string;
      type:
        | "string"
        | "number"
        | "object"
        | "boolean"
        | StringConstructor
        | NumberConstructor
        | BooleanConstructor
        | ObjectConstructor;

      inputType?: string;
      nullable?: boolean;
      RegExp?: RegExp;
      validator?: (value: any) => boolean;
    }
  >;
  info?: string;
  method?: methods;
  headers?: Record<string, string>;
  search_params?: string[];
  validate?: (data?: any) => Record<string, any>;
}

export type contentType =
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "application/json";

export type methods =
  | "GET"
  | "POST"
  | "OPTIONS"
  | "DELETE"
  | "HEAD"
  | "PUT"
  | "PATCH";

export type allowedMethods = methods[];
