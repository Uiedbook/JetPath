import { AppCTX } from "jetpath";

export function GET_user_refresh$rftoken(ctx: AppCTX<{ getRT(): string }>) {
  ctx.getRT();
}
