import { USERS } from "../database/index.js";
import { schema } from "../utils/schema.js";
const put = (fro, to) => {
    for (const [k, v] of Object.entries(fro)) {
        if (k === "id" || k === "User" || k === "Creator") {
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
    accountNumber: {
        type: "string",
        nullable: true,
        minLength: 10,
        maxLength: 10,
    },
    bank: {
        type: "string",
        nullable: true,
    },
    accountName: {
        type: "string",
        nullable: true,
    },
    additionalProps: false,
});
export async function POST_user_update(ctx) {
    await userDatah.validateData(ctx.body);
    const user = ctx.user;
    async function updateUser(UserObject) {
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
        ctx.reply({ data: user, status: 200, message: "ok" });
    }
    else {
        ctx.throw(400, { message: "wrong details, please login for verification" });
    }
}
