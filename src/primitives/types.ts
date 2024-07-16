import { IncomingMessage, Server, ServerResponse } from "node:http";
// import { Stream } from "node:stream";
import type { _JetPath_paths } from "./functions";
import type { JetPlugin } from "./classes";

export type Context<
  JetBody extends Record<string, any> = {},
  JetParams extends Record<string, string> = {},
  JetSearch extends Record<string, string> = {}
> = {
  /**
   * get body params after api/?
   */
  body: JetBody;
  /**
   * get search params after api/?
   */
  search: JetSearch;
  /**
   * get route params in api/:thing
   */
  params: JetParams;
  /**
   * remove request control from the request
   */
  eject(): never;
  /**
   * reply the request
   */
  request: IncomingMessage;
  /**
   * API status
   */
  code: number;
  /**
   * an object you can set values to per request
   */
  app: Record<string, any>;
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
  /**
   * get and set status code
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

type HTTPBody<Obj extends Record<string, any>> = {
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
    nullable?: boolean;
    validator?: (value: any) => boolean;
  };
};

export type JetFunc<
  JetBody extends Record<string, any> = {},
  JetParams extends Record<string, string> = {},
  JetSearch extends Record<string, string> = {}
> = {
  (
    this: {
      validate: (data: any) => JetBody;
    },
    ctx: Context<JetBody, JetParams, JetSearch>
  ): Promise<void> | void;
  config?: {
    body?: HTTPBody<JetBody>;
    headers?: Record<string, string>;
    info?: string;
    path?: string;
    method?: string;
  };
  validate?: (data: any) => JetBody;
};
