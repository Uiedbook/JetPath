/**
 * @param {string} email
 * @param {{html: string; title: string;}} data
 */
export async function sendEmail(email, data) {
  const body = JSON.stringify({
    subject: data.title,
    html: data.html || `<h2>Welcome to the party!</h2>`,
    email: email,
  });
  // return sendEmailAWS([email], data);
  try {
    const a = await fetch("you know wassup", {
      headers: {
        "Content-Type": "application/json",
      },
      body,
      mode: "no-cors",
      method: "POST",
    });
    // console.log(a);
  } catch (error) {
    console.log(error);
  }
}
