import fss from "node:fs/promises";

async function serve(link: string, encode: any) {
  const data = await fss.readFile(link, encode);
  if (data) {
    return data;
  } else {
    throw new Error("file doesn't exist");
  }
}
/** types of template
 * stream
 * validation
 * subscription
 */

const encod = {
  encoding: "utf-8",
};

export const EmailTemplate = {
  /**
   * @param {{ name:string; email:string; validation:string; title:string; }} data
   */
  async info(data: Record<string, string>) {
    let email = await serve("emails/info.html", encod);
    for (const key in data) {
      email = (email as any).replaceAll("$" + key, data[key]);
    }
    return email;
  },
};
