import { AppCTXType } from "jetpath";

export async function GET_metric$$id(ctx: AppCTXType) {
  const id = ctx.search.id;
  ctx.reply({ message: "ok", status: 200 });
}
