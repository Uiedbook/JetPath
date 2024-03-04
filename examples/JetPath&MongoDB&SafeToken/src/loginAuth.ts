import { USERS } from "./database/index.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { schema } from "./utils/schema.js";
import { AppCTX } from "jetpath";
import { IUserDoc } from "./database/interfaces/interfaces.user.js";
dotenv.config();

const loginData = new schema({
  email: {
    type: "string",
    mustInclude: "@",
    RegExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    err: "invalid email, please recheck!",
  },
  password: {
    type: String,
    minLength: 4,
    err: "invalid password, should be more than 5 characters including letters, numbers or the mix are allowed",
  },
});
function getPerson(personObject: { email: any }) {
  return USERS.findOne({ email: personObject.email });
}

export async function POST_user_login(
  ctx: AppCTX<{
    newAuth(person: IUserDoc): {
      accessToken: string;
      refreshToken: string;
    };
  }>
) {
  await loginData.validateData(ctx.body);
  ctx.body.email = ctx.body.email.toLowerCase();
  const person = await getPerson(ctx.body);

  if (person === null) {
    ctx.throw(401, "Incorrect password or email");
  } else {
    if (!(await bcrypt.compare(ctx.body.password, person.password))) {
      ctx.throw(401, "Incorrect password or email");
    }
    const token = ctx.newAuth(person);
    const data = { ...(person as any)._doc, token };
    delete (data as any).otp;
    delete (data as any).password;
    ctx.send({
      data,
      message: "ok",
    });
  }
}
