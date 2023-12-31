import { AppCTXType } from "jetpath";

export const GET_ = (ctx: AppCTXType) => {
  ctx.reply("just whatApp +2349131131725");
};
export async function GET_user_stats(ctx: AppCTXType) {
  // the statistics object
  const data: Record<string, any> = {};
  ctx.reply({
    data,
    message: "ok",
  });
}
