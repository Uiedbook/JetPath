import { USERS } from "./database/index.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { schema } from "./utils/schema.js";
dotenv.config();
const loginData = new schema({
    email: {
        type: "string",
        mustInclude: "@",
        err: "invalid email please recheck!",
    },
    password: {
        type: "string",
        maxLength: 100,
        minLength: 4,
        err: "invalid password please recheck!",
    },
});
function getPerson(personObject) {
    return USERS.findOne({ email: personObject.email });
}
export async function POST_user_login(ctx) {
    await loginData.validateData(ctx.body);
    ctx.body.email = ctx.body.email.toLowerCase();
    const person = await getPerson(ctx.body);
    if (person === null) {
        ctx.throw(401, "Incorrect password or email");
    }
    else {
        if (!(await bcrypt.compare(ctx.body.password, person.password))) {
            ctx.throw(401, "Incorrect password or email");
        }
        const token = ctx.newAuth(person);
        const data = { ...person._doc, token };
        delete data.otp;
        delete data.password;
        ctx.reply({
            data,
            message: "ok",
        });
    }
}
