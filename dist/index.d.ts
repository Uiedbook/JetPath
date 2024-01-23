import { type allowedMethods, type AppCTXType } from "./primitives/types.js";
export declare class JetPath {
    private options;
    private server;
    listening: boolean;
    constructor(options?: {
        source?: string;
        credentials?: any;
        displayRoutes?: boolean | "UI";
        port?: number;
        cors?: {
            allowMethods?: allowedMethods;
            secureContext?: boolean;
            allowHeaders?: string[];
            exposeHeaders?: string[];
            keepHeadersOnError?: boolean;
            maxAge?: string;
            credentials?: boolean;
            privateNetworkAccess?: any;
            origin?: string;
        } | boolean;
    });
    decorate(decorations: Record<string, (ctx: AppCTXType) => void>): void;
    listen(): Promise<void>;
}
export type { AppCTXType } from "./primitives/types";
