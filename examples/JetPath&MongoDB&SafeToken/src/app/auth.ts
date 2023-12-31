import { AppCTXType } from "jetpath";

export function GET_user_refresh$rftoken(ctx: AppCTXType<{ getRT(): string }>) {
  ctx.getRT();
}
