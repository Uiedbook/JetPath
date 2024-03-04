import { IncomingMessage } from "http";
import { Stream } from "node:stream";

export type AppCTX<Type = {}> = {
  /**
   * Parses the request as JSON
   */
  json(): Promise<Record<string, any>> | null;
  /**
   * validate the request
   */
  validate(data: any): Record<string, any>;
  /**
   * get and set status code
   */
  code: number;
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
  request: IncomingMessage;
  /**
   * get request method
   */
  path: string;
  reply(data: unknown, ContentType?: string): never;
  offload(): never;
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): never;
  redirect(url: string): never;
  get(field: string): string | undefined;
  set(field: string, value: string): void;
  _1?: string | undefined;
  _2?: Record<string, string>;
  _3?: Stream | undefined;
  _4?: boolean | undefined;
  _5?: (() => never) | undefined;
  pipe(stream: Stream | string, ContentType: string): never;
  app: Record<string, any>;
  // files(): Promise<any>;
} & Type;
export interface Schema {
  body?: Record<
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
