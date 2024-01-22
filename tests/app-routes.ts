import { AppCTXType } from "../dist/index.js";
// /dogs
export function GET_dogs(ctx: AppCTXType) {
  ctx.reply(ctx); // ! error in nodejs
}

// /dogs
export function GET_dogs$0(ctx: AppCTXType) {
  ctx.reply("all requests to /dogs/* ends on this page"); // ! error in nodejs
}

export async function POST_dogs(ctx: AppCTXType) {
  ctx.reply("enter skelter");
}

export async function GET_dogs$name$age$sex(ctx: AppCTXType) {
  // console.log(ctx.request.url, ctx.params);
  const { name, age, sex } = ctx.params!;
  ctx.reply(
    "hello " + name + " you are " + age + " years old and you are " + sex
  );
}

export async function GET_dogs$$(ctx: AppCTXType) {
  const { name, age, sex } = ctx.search!;
  ctx.reply(
    "hello " + name + " you are " + age + " years old and you are " + sex
  );
}
/**
 * @param {{ redirect: (arg0: string) => void; }} ctx
 */
export async function GET_(ctx: AppCTXType) {
  // ctx.redirect("http://localhost:8080/dogs");
  throw new Error("tada");
}

/**
 * @param {any} ctx
 */
export function hook__PRE(ctx: AppCTXType) {
  // console.log("PRE function boohoo");
  // console.log(ctx);
}

export function hook__POST(ctx: AppCTXType) {}

export function hook__ERROR(ctx: AppCTXType, err: unknown) {
  console.log(err);
  ctx.throw(400, "bad request!");
  console.log("booo2"); // nop this won't run, JetPath took over control
}
// GET localhost:8080/user/:id
export function GET_user$id(ctx: AppCTXType<{ id: () => string }>) {
  const id = ctx.id();
  ctx.reply("you are " + id);
}

export function hook__DECORATOR() {
  return {
    id(this: AppCTXType) {
      const id = this.params!.id;
      return id;
    },
  };
}
