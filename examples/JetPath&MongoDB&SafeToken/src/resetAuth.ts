import { USERS } from "./database/index.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { schema } from "./utils/schema.js";
import { EmailTemplate } from "./utils/index.js";
import { sendEmail } from "./utils/emailer.js";
import { AppCTX } from "jetpath";
import { generateAlphanumericReference } from "./utils/referenceGenerator.js";

const resetData = new schema({
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
  additionalProps: false,
});

async function savePasswordAndSendEmail(personObject: {
  email: any;
  password: string;
}) {
  const wasThere = await USERS.findOne({
    email: personObject.email,
  });
  if (wasThere) {
    // hashing password with bcrypt
    wasThere.temporaryPassword = await bcrypt.hash(personObject.password, 10);
    wasThere.otp = generateAlphanumericReference(4);
    const html = await EmailTemplate.info({
      name: wasThere.firstName,
      email: wasThere.email,
      title: "Verify password change",
    });
    sendEmail(wasThere.email, {
      email: wasThere.email,
      title: "Verify password change",
      html,
    });
    return await USERS.findOneAndUpdate({ _id: wasThere._id }, wasThere, {
      new: true,
    });
  }
  return false;
}

export async function POST_user_reset_password(ctx: AppCTX) {
  await resetData.validateData(ctx.body);
  ctx.body.email = ctx.body.email.toLowerCase();
  const person = await savePasswordAndSendEmail(ctx.body);
  if (!person) {
    ctx.throw(400, {
      message: "email not found, please contact support if it exists.",
    });
    return;
  }
  const data = { ...(person as any)._doc };
  delete data.otp;
  delete data.temporaryPassword;
  delete data.password;
  delete data.role;
  ctx.send({
    data,
    status: 200,
    message: "ok",
  });
}
