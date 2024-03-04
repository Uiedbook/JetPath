import { AppCTX } from "jetpath";
import { USERS } from "../database/index.js";
import { IUserDoc } from "../database/interfaces/interfaces.user.js";
import { schema } from "../utils/schema.js";

const put = (fro: any, to: any) => {
  for (const [k, v] of Object.entries(fro)) {
    if (k === "_id") {
      continue;
    }
    to[k] = typeof v === "string" ? v.trim() : v;
  }
  return to;
};

const userDatah = new schema({
  username: {
    type: "string",
    nullable: true,
    maxLength: 30,
    minLength: 4,
  },
  firstName: {
    type: "string",
    nullable: true,
    maxLength: 30,
    minLength: 4,
  },
  lastName: {
    type: "string",
    nullable: true,
    maxLength: 30,
    minLength: 4,
  },
  additionalProps: false,
});

export async function POST_user_update(ctx: AppCTX<{ user: IUserDoc }>) {
  await userDatah.validateData(ctx.body);
  const user = ctx.user;
  async function updateUser(UserObject: {
    password: any;
    temporaryPassword: any;
    emall: any;
    role: any;
    email: any;
  }) {
    //? remove any insecure options
    delete UserObject.password;
    delete UserObject.temporaryPassword;
    delete UserObject.emall;
    delete UserObject.role;
    put(UserObject, user);
    return await USERS.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
    });
  }
  await updateUser(ctx.body);
  if (user) {
    ctx.send({ data: user, status: 200, message: "ok" });
  } else {
    ctx.throw(400, { message: "wrong details, please login for verification" });
  }
}
