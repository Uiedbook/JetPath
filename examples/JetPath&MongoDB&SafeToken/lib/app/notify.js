import { USERS } from "../database/index.js";
import { sendEmail } from "../utils/emailer.js";
import { EmailTemplate } from "../utils/index.js";
/**
 * @param {{ title: any; image1: any; image: any; _id: string; }} data
 * @param type {"stream" | "music"}
 */
export async function Notify(data, type = "stream") {
  // const users = await User.find({ verified: true });
  const users = await USERS.find();
  // @ts-ignore
  const email = await EmailTemplate[type]({
    title: data.title,
    image: data.image1 || data.image,
    link: data._id,
  });
  for (let ind = 0; ind < users.length; ind++) {
    sendEmail(users[ind].email, {
      html: email,
      email: users[ind].email,
      title: "New " + type + " ! ",
    });
  }
}
