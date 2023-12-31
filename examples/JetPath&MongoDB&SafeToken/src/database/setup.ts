import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { USERS } from "./schemas/user.js";
import { generateAlphanumericReference } from "../utils/referenceGenerator.js";
dotenv.config();

const put = (fro: any, to: any) => {
  for (const [k, v] of Object.entries(fro)) {
    to[k] = typeof v === "string" ? v.trim() : v;
  }
  return to;
};

export async function createServer() {
  const wasThere = await USERS.findOne({
    email: process.env.SERVER_MAIL,
  });
  if (!wasThere) {
    const USERSObject = {
      email: process.env.SERVER_MAIL!,
      password: process.env.SERVER_PASSWORD!,
      username: "admin",
      firstName: "admin",
      lastName: "admin",
      role: "admin",
      otp: generateAlphanumericReference(4),
    };
    USERSObject.password = await bcrypt.hash(USERSObject.password, 10);
    const user = put(USERSObject, new USERS());
    await user.save();
  }
}
