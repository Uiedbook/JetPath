import dotenv from "dotenv";
import { USERS } from "../database/index.js";
import { put, schema } from "../utils/schema.js";
import { sendEmail } from "../utils/emailer.js";
import { EmailTemplate } from "../utils/index.js";
import { generateAlphanumericReference } from "../utils/referenceGenerator.js";
dotenv.config();
const userData = new schema({
    username: {
        type: "string",
    },
    lastName: {
        type: "string",
    },
    firstName: {
        type: "string",
    },
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
export async function POST_user_register(ctx) {
    await userData.validateData(ctx.body);
    ctx.body.email = ctx.body.email.toLowerCase();
    const user = await createUser(ctx.body);
    if (user) {
        const token = ctx.newAuth(user);
        const data = { ...user._doc, token };
        delete data.otp;
        delete data.password;
        ctx.reply({
            data,
            message: "Welcome Onboard!",
        });
    }
    else {
        ctx.throw(400, { message: "this account exits, please login!" });
    }
}
export async function POST_user_otp(ctx) {
    if (!ctx.body.otp && ctx.body.email) {
        ctx.throw(400, { message: "no info provided" });
    }
    ctx.body.email = ctx.body.email.toLowerCase();
    const user = await createUser(ctx.body);
    if (user) {
        const data = { ...user._doc };
        delete data.otp;
        delete data.temporaryPassword;
        delete data.password;
        delete data.role;
        ctx.reply({
            data,
            message: "Account Verified!",
        });
    }
    else {
        ctx.throw(400, { message: "invalid action, please login!" });
    }
}
async function createUser(userObject) {
    const wasThere = await USERS.findOne({
        email: userObject.email,
    });
    if (wasThere && !userObject.otp) {
        return;
    }
    if (wasThere && userObject.otp === wasThere.otp) {
        wasThere.isEmailVerified = true;
        if (wasThere.temporaryPassword) {
            wasThere.password = wasThere.temporaryPassword;
            wasThere.temporaryPassword = null;
        }
        // @ts-ignore
        wasThere.otp = null;
        return await USERS.findOneAndUpdate({ _id: wasThere._id }, wasThere, {
            new: true,
        });
    }
    if (!wasThere) {
        userObject.otp = generateAlphanumericReference(4);
        const user = put(userObject, new USERS());
        const html = await EmailTemplate.info({
            name: userObject.firstName,
            email: userObject.email,
            validation: userObject.otp,
            title: "Verify your account",
        });
        sendEmail(userObject.email, {
            title: "Verify your account",
            html,
        });
        return await user.save();
    }
    return false;
}
export async function GET_user(ctx) {
    const data = ctx.user;
    ctx.reply({
        data,
        message: "success",
    });
}
