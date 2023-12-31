export async function GET_metric$$id(ctx) {
    const id = ctx.search.id;
    ctx.reply({ message: "ok", status: 200 });
}
