import { JetPath } from "../dist/index.js";
const app = new JetPath({ APIdisplay: "HTTP" });
//? listening for requests
app.listen();
// this goes to = get /
export const GET_ = async function (ctx) {
  ctx.send("hello world!");
};
// this goes to = post /
export const POST_ = async function (ctx) {
  ctx.send("a simple post path!");
};
// ? not implemented?
const payment = {};
// this goes to = /api/v1/payment
export const POST_api_v1_payment = async function (ctx) {
  // ? http body to json
  await ctx.json();
  // ? http validate the body, or end the request with the error
  const data = ctx.validate();
  // ? process the request
  await payment.process({
    amount: data.amount,
    address: data.address,
    currency: data.currency,
  });
  // ? send response
  ctx.send({ message: "sucess" });
};
POST_api_v1_payment.body = {
  name: { type: "string" },
  amount: { type: "number", defaultValue: 50.0 },
  currency: { RegExp: /(BTC|ETH|XRP|LTC)/ },
  address: {
    err: "Please provide a valid address",
    validator(address) {
      // logic to validate address
      return true;
    },
  },
};
// this goes to = /api/v1/payment/:paymentId
export const GET_api_v1_payment_status$paymentId = async function (ctx) {
  // ? retrieve
  const status = await payment.getStatusById(ctx.params.paymentId);
  if (status === "SUCCESS") {
    // ? send response
    ctx.send({ message: "sucess" });
  } else {
    const id = setInterval(async () => {
      const status = await payment.getStatusById(ctx.params.paymentId);
      if (status === "SUCCESS") {
        // ? clean up
        clearInterval(id);
        // ? send response
        ctx.send({ message: "sucess" });
      }
    }, 1000);
    //? ctx.eject() - allows any async operation to keep running while the function done exicutiong, always call it last
    ctx.eject();
  }
};
