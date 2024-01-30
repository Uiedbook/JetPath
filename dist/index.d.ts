import { type allowedMethods, type AppCTXType } from "./primitives/types.js";
export declare class JetPath {
    server: any;
    private listening;
    private options;
    constructor(options?: {
        source?: string;
        credentials?: any;
        displayRoutes?: boolean | "UI";
        port?: number;
        publicPath?: {
            route: string;
            dir: string;
        };
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
export type { AppCTXType, JetPathSchema } from "./primitives/types";
