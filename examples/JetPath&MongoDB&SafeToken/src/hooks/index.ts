// Access handlers
import { AppCTX } from "jetpath";
import { sendEmail } from "../utils/emailer.js";
import { USERS } from "../database/index.js";
import { SafeToken } from "safetoken";
import dotenv from "dotenv";
import { IUserDoc } from "../database/interfaces/interfaces.user.js";
import { EmailTemplate } from "../utils/index.js";
dotenv.config();

// auth
const Auth = new SafeToken({
  encryptionKey: process.env.SAFE_TOKEN_KEY,
  rtStoreKey: "_token",
  rtDays: 90,
});

// here is the auth access mapper how awesome it is
export async function hook__PRE(ctx: AppCTX<{ getUser(this: AppCTX): any }>) {
  if (ctx.method !== "GET") {
    await ctx.json();
  }
  const pub =
    ctx.request.url!.includes("/register") ||
    ctx.request.url!.includes("/reset/password") ||
    ctx.request.url!.includes("/webhook") ||
    ctx.request.url!.includes("/otp") ||
    ctx.request.url === "/" ||
    ctx.request.url!.includes("/login");
  if (!pub && !(await ctx.getUser())) {
    ctx.throw();
  }
}
export async function hook__POST(ctx: AppCTX) {
  ctx.throw();
}
// app error middleware, a very funny one
export async function hook__ERROR(ctx: AppCTX, err: any) {
  let errMessage = err.message || err;
  ctx.set("error", errMessage);
  if (ctx.request.statusCode! > 499) {
    await sendEmail("JetPath.checkpoint@gmail.com", {
      title: "Server error",
      html: `<div>
  <h1>server errors please report to technical team</h1>
  ${errMessage}
    </div>`,
    });
  }
  console.log(errMessage);
  ctx.send({ message: errMessage });
}

// hook to decorate the CTX
export function hook__DECORATOR() {
  return {
    async getUser(this: AppCTX): Promise<any> {
      const accesToken = this.get("authorization");
      if (accesToken) {
        let credentials = Auth.verifyToken(accesToken);
        let id;
        if (typeof credentials === "string") {
          id = JSON.parse(credentials).id;
        }
        // @ts-ignore
        if (typeof id === "string") {
          const user = await USERS.findById(id);
          if (!user) this.throw(JSON.stringify({ message: "unknown user" }));
          if (!user!.isEmailVerified) {
            const html = await EmailTemplate.info({
              name: user!.firstName,
              email: user!.email,
              validation: user!.otp,
              title: "Verify your account",
            });
            sendEmail(user!.email, {
              title: "Verify your account",
              html,
            });
            this.throw(JSON.stringify({ message: "Please verify your email" }));
          }
          return user;
        }
        this.throw(JSON.stringify({ message: "Token Expired" }));
      } else {
        this.throw(JSON.stringify({ message: "Please Autheticate" }));
      }
    },
    newAuth(this: AppCTX, person: IUserDoc) {
      const credentials = JSON.stringify({ id: person._id, role: person.role });
      return {
        accessToken: Auth.newAccessToken(credentials),
        refreshToken: Auth.newRefreshToken(credentials),
      };
    },
    getrt(this: AppCTX): any {
      const refreshToken = this.params.rftoken;
      if (refreshToken) {
        const credentials = Auth.verifyRefreshToken(refreshToken);

        // @ts-ignore
        const id = credentials.id;
        if (typeof id === "string") {
          this.reply({
            token: {
              accessToken: Auth.newAccessToken(JSON.stringify(credentials)),
              refreshToken,
            },
          });
        }
        this.throw({ message: "Token Expired" });
      } else {
        this.throw({ message: "Please Autheticate" });
      }
    },
  };
}
