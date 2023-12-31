export const GET_ = (ctx) => {
    ctx.reply("just whatApp +2349131131725");
};
export async function GET_user_stats(ctx) {
    // the statistics object
    const data = {};
    ctx.reply({
        data,
        message: "ok",
    });
}
