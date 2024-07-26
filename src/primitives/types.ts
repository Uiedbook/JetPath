import { IncomingMessage, Server, ServerResponse } from "node:http";
import type { _JetPath_paths } from "./functions.js";
import type { JetPlugin } from "./classes.js";

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never;

export type Context<
  JetBody extends Record<string, any>,
  JetParams extends Record<string, string>,
  JetSearch extends Record<string, string>,
  JetPluginTypes extends Record<string, unknown>[]
> = {
  /**
   * an object you can set values to per request
   */
  app: UnionToIntersection<JetPluginTypes[number]> & Record<string, any>;
  /**
   * get body params after /?
   */
  body: JetBody;
  /**
   * get search params after /?
   */
  search: JetSearch;
  /**
   * get route params in /:thing
   */
  params: JetParams;
  /**
   * remove request control from the request
   */
  eject(): never;
  /**
   * reply the request
   */
  request: Request;
  /**
   * API status
   */
  code: number;
  /**
   * validate body
   */
  validate: (data: any) => JetBody;

  /**
   * send a stream
   */
  // sendStream(stream: Stream | string, ContentType: string): never;
  sendStream(stream: any | string, ContentType: string): never;
  /**
   * reply the request
   *
   */
  send(data: unknown, ContentType?: string): never;
  /**
   * end the request with an error
   */
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): never;
  /**
   * redirect the request
   */
  redirect(url: string): never;
  /**
   * get request header values
   */
  get(field: string): string | undefined;
  /**
   * set request header values
   */
  set(field: string, value: string): void;
  /**
   * Parses the request as JSON
   */

  json(): Promise<Record<string, any>>;

  /**
   * get original request
   */
  path: string;
  _1?: string | undefined;
  _2?: Record<string, string>;
  _3?: any; //Stream | undefined; // Stream
  _4?: boolean | undefined;
  _5?: (() => never) | undefined;
};

export type JetPluginExecutorInitParams = {
  runtime: {
    node: boolean;
    bun: boolean;
    deno: boolean;
  };
  server: Server<typeof IncomingMessage, typeof ServerResponse>;
  routesObject: typeof _JetPath_paths;
  JetPath_app: (req: Request) => Response;
};
export type JetPluginExecutor = (
  this: JetPlugin,
  init: JetPluginExecutorInitParams
) => Record<string, any>;

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

export type jetOptions = {
  globalHeaders?: Record<string, string>;
  apiDoc?: {
    name?: string;
    info?: string;
    color?: string;
    logo?: string;
    path?: string;
  };
  source?: string;
  credentials?: {
    cert: string;
    key: string;
  };
  APIdisplay?: "UI" | "HTTP" | false;
  port?: number;
  static?: { route: string; dir: string };
  cors?:
    | {
        allowMethods?: allowedMethods;
        secureContext?: boolean;
        allowHeaders?: string[];
        exposeHeaders?: string[];
        keepHeadersOnError?: boolean;
        maxAge?: string;
        credentials?: boolean;
        privateNetworkAccess?: any;
        origin?: string;
      }
    | boolean;
  websocket?:
    | {
        idleTimeout?: number;
      }
    | boolean;
};

export type HTTPBody<Obj extends Record<string, any>> = {
  [x in keyof Obj]: {
    err?: string;
    type?: "string" | "number" | "file" | "object" | "boolean";
    RegExp?: RegExp;
    inputAccept?: string;
    inputType?:
      | "date"
      | "email"
      | "file"
      | "password"
      | "number"
      | "time"
      | "tel"
      | "datetime"
      | "url";
    defaultValue?: string | number | boolean;
    required?: boolean;
    validator?: (value: any) => boolean;
  };
};

export type JetFunc<
  JetBody extends Record<string, any> = Record<string, any>,
  JetParams extends Record<string, string> = Record<string, any>,
  JetSearch extends Record<string, string> = Record<string, any>,
  JetPluginTypes extends Record<string, unknown>[] = []
> = {
  (
    ctx: Context<JetBody, JetParams, JetSearch, JetPluginTypes>
  ): Promise<void> | void;
  body?: HTTPBody<JetBody>;
  headers?: Record<string, string>;
  info?: string;
  method?: string;
};
