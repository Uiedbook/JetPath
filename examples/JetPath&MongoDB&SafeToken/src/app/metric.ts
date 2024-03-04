import { AppCTX } from "jetpath";

export async function GET_metric$$id(ctx: AppCTX) {
  const id = ctx.search.id;
  ctx.send({ message: "ok", status: 200 });
}
