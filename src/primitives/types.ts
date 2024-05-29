import { IncomingMessage } from "node:http";
import { Stream } from "node:stream";

export type AppCTX<Type = {}> = {
  /**
   * Parses the request as JSON
   * :proto
   */
  json(): Promise<Record<string, any>>;
  /**
   * validate the request
   * :proto
   */
  validate(data: any): Record<string, any>;
  /**
   * get and set status code
   * :proto
   */
  code: number;
  /**
   * get search params after api/?
   * :proto
   */
  search: Record<string, string>;
  /**
   * get route params in api/:thing
   * :proto
   */
  params: Record<string, string>;
  /**
   * get original request
   * :proto
   */
  request: IncomingMessage;
  /**
   * get handler defined path
   *
   */
  path: string;
  /**
   * reply the request
   *
   */
  send(data: unknown, ContentType?: string): never;
  /**
   * reply the request
   * :proto
   */
  sendReponse(response: Response): never;
  /**
   * remove request from the jetpath secure control
   * :proto
   */
  eject(): never;
  /**
   * end the request with an error
   * :proto
   */
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): never;
  /**
   * :proto
   * redirect the request
   */
  redirect(url: string): never;
  /**
   * get request header values
   * :proto
   */
  get(field: string): string | undefined;
  /**
   * set request header values
   * :proto
   */
  set(field: string, value: string): void;
  /**
   * an object you can set values to per request
   * :proto
   */
  app: Record<string, any>;
  /**
   * send a stream
   * :proto
   */
  pipe(stream: Stream | string, ContentType: string): never;
  _1?: string | undefined;
  _2?: Record<string, string>;
  _3?: Stream | undefined;
  _4?: boolean | undefined;
  _5?: (() => never) | undefined;
  // files(): Promise<any>;
} & Type;
export interface JetSchema {
  body?: Record<
    string,
    {
      err?: string;
      type?:
        | "string"
        | "number"
        | "file"
        | "object"
        | "boolean"
        | StringConstructor
        | NumberConstructor
        | BooleanConstructor
        | ObjectConstructor;
      RegExp?: RegExp;
      inputType?:
        | "color"
        | "date"
        | "email"
        | "file"
        | "text"
        | "image"
        | "password"
        | "number"
        | "time"
        | "tel"
        | "datetime"
        | "url";
      // |"button"
      // |"checkbox"
      // |"hidden"
      // |"month"
      // |"radio"
      // |"range"
      // |"reset"
      // |"search"
      // |"submit"
      // |"Play"
      // "week";

      defaultValue?: string;
      nullable?: boolean;
      ranges?: Record<number, string>;
      model?: Record<string, Record<string, any>>;
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
