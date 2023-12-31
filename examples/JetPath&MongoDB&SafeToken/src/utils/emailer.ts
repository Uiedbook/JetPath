/**
 * @param {string} email
 * @param {{html: string; title: string;}} data
 */
export async function sendEmail(
  email: string,
  data: { email?: string; title: any; html: any }
) {
  const body = JSON.stringify({
    subject: data.title || "JetPath",
    html: data.html || `<h2>Welcome to the party!</h2>`,
    email: email,
  });

  // return sendEmailAWS([email], data);
  try {
    await fetch("link to my email service ", {
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
