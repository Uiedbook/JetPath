import { AppCTXType, allowedMethods, methods } from "./types";

/**
 * an inbuilt CORS post hook
 *
 * @param {Object} [_options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean|Function(ctx)} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 *  - {Boolean} secureContext `Cross-Origin-Opener-Policy` & `Cross-Origin-Embedder-Policy` headers.', default is false
 *    @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes
 *  - {Boolean} privateNetworkAccess handle `Access-Control-Request-Private-Network` request by return `Access-Control-Allow-Private-Network`, default to false
 *    @see https://wicg.github.io/private-network-access/
 * @return {Function} cors post hook
 * @public
 */

export function corsHooker(_options: {
  exposeHeaders?: string[];
  allowMethods?: allowedMethods;
  allowHeaders: string[];
  keepHeadersOnError?: boolean;
  maxAge?: string;
  credentials?: boolean;
  secureContext?: boolean;
  privateNetworkAccess?: any;
  origin?: string;
}): Function {
  const options: typeof _options = {
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    origin: "*",
    secureContext: false,
    keepHeadersOnError: false,
    allowHeaders: [],
  };

  for (const key in _options) {
    if (_options.hasOwnProperty(key)) {
      options[key as keyof typeof _options] =
        _options[key as keyof typeof _options];
    }
  }

  if (Array.isArray(options.allowMethods)) {
    options.allowMethods = options.allowMethods.join(
      ","
    ) as unknown as methods[];
  }

  if (options.maxAge) {
    options.maxAge = String(options.maxAge);
  }

  options.keepHeadersOnError =
    options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

  return function cors(ctx: AppCTXType) {
    let credentials = options.credentials;
    const headersSet: Record<string, string> = {};

    function set(key: string, value: string) {
      ctx.set(key, value);
      headersSet[key] = value;
    }

    if (ctx.method !== "OPTIONS") {
      //? Simple Cross-Origin Request, Actual Request, and Redirects
      set("Access-Control-Allow-Origin", options.origin!);

      //? Add Vary header to indicate response varies based on the Origin header
      set("Vary", "Origin");
      if (credentials === true) {
        set("Access-Control-Allow-Credentials", "true");
      }

      if (options.exposeHeaders) {
        set("Access-Control-Expose-Headers", options.exposeHeaders.join(","));
      }

      if (options.secureContext) {
        set("Cross-Origin-Opener-Policy", "same-origin");
        set("Cross-Origin-Embedder-Policy", "require-corp");
      }
      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
    } else {
      //? Preflight Request

      // If there is no Access-Control-Request-Method header or if parsing failed,
      // do not set any additional headers and terminate this set of steps.
      // The request is outside the scope of this specification.
      if (!ctx.get("Access-Control-Request-Method")) {
        // this not preflight request, ignore it
        return;
      }

      ctx.set("Access-Control-Allow-Origin", options.origin!);

      if (credentials === true) {
        ctx.set("Access-Control-Allow-Credentials", "true");
      }

      if (options.maxAge) {
        ctx.set("Access-Control-Max-Age", options.maxAge);
      }

      if (
        options.privateNetworkAccess &&
        ctx.get("Access-Control-Request-Private-Network")
      ) {
        ctx.set("Access-Control-Allow-Private-Network", "true");
      }

      if (options.allowMethods) {
        ctx.set("Access-Control-Allow-Methods", options.allowMethods.join(","));
      }

      if (options.secureContext) {
        set("Cross-Origin-Opener-Policy", "same-origin");
        set("Cross-Origin-Embedder-Policy", "require-corp");
      }

      if (options.allowHeaders) {
        ctx.set("Access-Control-Allow-Headers", options.allowHeaders.join(","));
      }
      ctx.statusCode = 204;
    }
  };
}
