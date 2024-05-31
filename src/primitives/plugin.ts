import type { IncomingMessage, Server, ServerResponse } from "http";

export class JetPlugin {
  name: string;
  version: string;
  executor: (init: {
    runtime: {
      node: boolean;
      bun: boolean;
      deno: boolean;
    };
    server: Server<typeof IncomingMessage, typeof ServerResponse>;
  }) => Record<string, Function>;
  constructor({
    name,
    version,
    executor,
  }: {
    name: string;
    version: string;
    executor: (init: {
      runtime: { node: boolean; bun: boolean; deno: boolean };
      server: Server<typeof IncomingMessage, typeof ServerResponse>;
    }) => Record<string, Function>;
  }) {
    this.name = name;
    this.version = version;
    this.executor = executor;
  }
  _setup(init: {
    runtime: { node: boolean; bun: boolean; deno: boolean };
    server: Server<typeof IncomingMessage, typeof ServerResponse>;
  }): any {
    return this.executor(init);
  }
}
