// /dogs
/**
 * @param {{ set: (arg0: string, arg1: string) => void; reply: (arg0: any) => void; }} ctx
 */
export function GET_dogs(ctx) {
  ctx.send(ctx); // ! error in nodejs
}
/**
 * @param {{ text: () => any; reply: (data: string) => void; }} ctx
 */
export async function POST_dogs(ctx) {
  ctx.send("enter skelter");
}

/**
 * @param {{ params: { name: any; age: any; sex: any; }; reply: (arg0: string) => void; }} ctx
 */
export async function GET_dogs$name$age$sex(ctx) {
  // console.log(ctx.request.url, ctx.params);
  const { name, age, sex } = ctx.params;
  ctx.send(
    "hello " + name + " you are " + age + " years old and you are " + sex
  );
}

/**
 * @param {{ search: { name: any; age: any; sex: any; }; reply: (arg0: string) => void; }} ctx
 */
export async function GET_dogs$$(ctx) {
  const { name, age, sex } = ctx.search;
  ctx.send(
    "hello " + name + " you are " + age + " years old and you are " + sex
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
 * @param {any} ctx
 */
export function hook__PRE(ctx) {
  // console.log("PRE function boohoo");
  // console.log(ctx);
}

/**
 * @param {any} ctx
 * @param {any} data
 */
export function hook__POST(ctx, data) {
  // console.log("POST boohoo");
  return data;
}

/**
 * @param {{ throw: (arg0: number, arg1: string) => void; }} ctx
 * @param {any} err
 */
export function hook__ERROR(ctx, err) {
  console.log(err);
  ctx.throw(400, "bad request!");
  console.log("booo2"); // nop this won't run, JetPath took over control
}

// GET localhost:8080/default
/**
 * @param {{ sendDefaultDoglist: () => void; }} ctx
 */
export async function GET_default(ctx) {
  ctx.sendDefaultDoglist();
}
// GET localhost:8080/user/:id
/**
 * @param {{ id: () => any; reply: (arg0: string) => void; }} ctx
 */
export function GET_user$id(ctx) {
  const id = ctx.id();
  ctx.send("you are " + id);
}

/**
 * @returns {{}}
 */
export function hook__DECORATOR() {
  return {
    id() {
      // @ts-ignore
      const id = this.params.id;
      return id;
    },
  };
}
