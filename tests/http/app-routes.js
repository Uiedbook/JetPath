import { Stream } from "node:stream";
import { IncomingMessage } from "node:http";

/**
 * @param ctx {{
 log(ctx: any): unknown;
 *  request: IncomingMessage;
 * reply(data: unknown, ContentType?: string): void;
 * throw(code: number, message: string): void;
 * method?: string;
 * get(field: string): string | undefined;
 * set(field: string, value: string): void;
 * code(code: number): void;
 * pipe(stream: Stream, message: string): void;
 * json(): Promise<Record<string, any>>;
 * text(): Promise<string>;
 *  }}
 */

// /dogs
export function GET_dogs(ctx) {
  // ctx.set("X-token", "boohoo");
  ctx.reply(ctx);
  // ctx.throw(400, "boohoo");
}
/**
 * @param {{ text: () => any; reply: (data: string) => void; }} ctx
 */
export async function POST_dogs(ctx) {
  console.log(await ctx.text());
  ctx.reply("enter skelter");
}

/**
 * @param {{ params: { name: any; age: any; sex: any; }; reply: (arg0: string) => void; }} ctx
 */
export async function GET_dogs$name$age$sex(ctx) {
  // console.log(ctx.request.url, ctx.params);
  const { name, age, sex } = ctx.params;
  ctx.reply(
    "hello " +
      name +
      " you are " +
      age +
      " years old and you are " +
      sex +
      " thanks for visiting JetPath App!"
  );
}

/**
 * @param {{ search: { name: any; age: any; sex: any; }; reply: (arg0: string) => void; }} ctx
 */
export async function GET_dogs$$(ctx) {
  const { name, age, sex } = ctx.search;
  ctx.reply(
    "hello " +
      name +
      " you are " +
      age +
      " years old and you are " +
      sex +
      " thanks for visiting JetPath App!"
  );
}
/**
 * @param {{ redirect: (arg0: string) => void; }} ctx
 */
export async function GET_(ctx) {
  // ctx.redirect("http://localhost:8080/dogs");
  throw new Error("tada");
}

/**
 * @param {{
 * reply: (data: any) => void;
 * throw(code: number, message: string): void;
 * code(code: number): void;
 *  pipe(stream: Stream, message: string): void;
 * json(): Promise<Record<string, any>>;
 * text(): Promise<string>;
 *  _(): any;
 *  }} ctx
 */
export function hook__PRE(ctx) {
  // console.log("PRE function boohoo");
  // console.log(ctx);
}
/**
 * @param {{
 * reply: (data: any) => void;
 * throw(code: number, message: string): void;
 * code(code: number): void;
 *  pipe(stream: Stream, message: string): void;
 * json(): Promise<Record<string, any>>;
 * text(): Promise<string>;
 *  _(): any;
 *  }} ctx
 *
 * @param {any} data
 */
export function hook__POST(ctx, data) {
  // console.log("POST boohoo");
  return data;
}

/**
 * @param ctx {{
    reply: (data: any) => void;
    throw(code: number, message: string): void;
    code(code: number): void;
    pipe(stream: Stream, message: string): void;
    json(): Promise<Record<string, any>>;
    text(): Promise<string>;
    _(): any;
}} ctx
 * @param {any} err
 */
export function hook__ERROR(ctx, err) {
  console.log({ err });
  ctx.throw(400, "bad request!");
  console.log(err); // nop this won't run, JetPath took over control
}

// GET localhost:8080/default
export async function GET_default(ctx) {
  ctx.sendDefaultDoglist();
}

export function hook__DECORATOR() {
  return {
    sendDefaultDoglist() {
      console.log(this);
      this.reply({
        types: [
          "rottweiler",
          "german sheepherd",
          "boerbull",
          "husky",
          "neopolitan mastiff",
          "pitbull",
          "pug",
          "eskimo",
          "labrador",
          "golden retrieval",
        ],
      });
    },
  };
}
