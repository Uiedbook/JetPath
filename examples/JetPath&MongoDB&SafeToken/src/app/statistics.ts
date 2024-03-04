import { AppCTX } from "jetpath";

export const GET_ = (ctx: AppCTX) => {
  ctx.send("just whatApp +2349131131725");
};
export async function GET_user_stats(ctx: AppCTX) {
  // the statistics object
  const data: Record<string, any> = {};
  ctx.send({
    data,
    message: "ok",
  });
}
