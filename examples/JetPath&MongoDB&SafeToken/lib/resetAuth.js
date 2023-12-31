import { USERS } from "./database/index.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { schema } from "./utils/schema.js";
import { EmailTemplate } from "./utils/index.js";
import { sendEmail } from "./utils/emailer.js";
import { generateAlphanumericReference } from "./utils/referenceGenerator.js";
const resetData = new schema({
    email: {
        type: "string",
        nullable: true,
        mustInclude: "@",
        err: "invalid email please recheck!",
    },
    password: {
        nullable: true,
        type: "string",
        maxLength: 20,
        minLength: 4,
    },
    additionalProps: false,
});
async function savePasswordAndSendEmail(personObject) {
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
export async function POST_user_reset_password(ctx) {
    await resetData.validateData(ctx.body);
    ctx.body.email = ctx.body.email.toLowerCase();
    const person = await savePasswordAndSendEmail(ctx.body);
    if (!person) {
        ctx.throw(400, {
            message: "email not found, please contact support if it exists.",
        });
        return;
    }
    const data = { ...person._doc };
    delete data.otp;
    delete data.temporaryPassword;
    delete data.password;
    delete data.role;
    ctx.reply({
        data,
        status: 200,
        message: "ok",
    });
}
