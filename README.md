<br/>
<p align="center">
     <img src="icon.webp" alt="JetPath" width="190" height="190">

  <h1 align="center">JetPath</h1>

  <p align="center">
    JetPath 🚀 - Is the granular, fast and minimalist framework for Node, Deno and Bun. Embrace new standards!!!
    <br/>
    <br/>
    <a href="https://github.com/uiedbook/JetPath#examples"><strong>Explore JetPath APIs »</strong></a>
    <br/>
    <br/>
    <a href="https://t.me/uiedbookHQ">Join Community</a>
    .
    <a href="https://github.com/uiedbook/JetPath/issues">Report Bug</a>
    .
    <a href="https://github.com/uiedbook/JetPath/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/uiedbook/JetPath?color=dark-green)
[![npm Version](https://img.shields.io/npm/v/jetpath.svg)](https://www.npmjs.com/package/JetPath)
![Forks](https://img.shields.io/github/forks/uiedbook/JetPath?style=social)
![Stargazers](https://img.shields.io/github/stars/uiedbook/JetPath?style=social)

--

## Latest version info

In this version, we added/tested these features on all runtimes.

1. auto-generated api documentation UI (JethPath UI).
2. streaming via ctx.pipe(stream||filename).
3. file uploads [check this example](tests/uploading-files.md)
4. support for websockets [check this example](tests/websockets-usage.md).
5. Jet Plugins.

In this version (not this latest), multi-runtime support is no-longer based on compartiblity but pure engine api(s).

We Added Examples in the examples folder!

- running Node index.js starts a Node instance for your app.
- running Deno run index.ts starts a Deno instance for your app.
- running Bun index.ts starts a Bun instance for your app.
- looking into serverless, possible with plugins

this version we fixed issues with the inbuilt cors hook.

- more speed, same size, more power.

# Rationale

JetPath is the Granular web framework aimed for speed and ease of use.

[benchmark repo](https://github.com/FridayCandour/jetpath-benchmark)

- JetPath now runs on the runtime you are using, bun or node or deno.
- Function names as routing patterns (newest innovation you haven't seen before).
- Pre, Post and Error request hooks.
- Inbuilt Cors handlers hook.
- Fast and small and easy as peasy.
- A strong backup community moved with passion for making the web better.
- Inbuilt API auto doc functionality.

JetPath is designed as a light, simple and but powerful, using the an intuitive route as function name system. you can be able to design and manage your api(s) with the smallest granularity possible.

This benefits are very lovely and delighting, but trust me you have never written javascript app in this manner before and you should definitely check this out.

--

## How JetPath works

JetPath works by search through the source forder and join up any defined handlers and hooks that follows it's format in files named [anything].jet.js.

## Requirements to use JetPath.

JetPath support all web Javascript runtimes:

- Nodejs.
- Denojs.
- Bunjs.
- and deno deploy (testing)
- Edge support for runtimes like cloudflare workers supported via plugins.

## Installation

Install JetPath Right away on your project using npm or Javascript other package managers.

```
npm i jetpath --save
```

#### An hello App setup

```ts
// in your src/index.jet.js
import { Context, JetFunc, JetPath } from "./dist/index.js";

const app = new JetPath({ APIdisplay: "HTTP" });

//? listening for requests
app.listen();

// this goes to = get /
export const GET_: JetFunc = async function (ctx) {
  ctx.send("hello world!");
};

// this goes to = post /
export const POST_: JetFunc = async function (ctx) {
  ctx.send("a simple post path!");
};

// ? not implemented?
const payment: any = {};

// this goes to = /api/v1/payment
export const POST_api_v1_payment: JetFunc<{
  name: string;
  amount: number;
  currency: "BTC" | "ETH" | "XRP" | "LTC";
  address: string;
}> = async function (ctx) {
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
  amount: { type: "number", defaultValue: 50 },
  currency: { RegExp: /(BTC|ETH|XRP|LTC)/, defaultValue: "BTC" },
  address: {
    err: "Please provide a valid address",
    validator(address) {
      // logic to validate address
      return true;
    },
  },
};

// this goes to = /api/v1/payment/:paymentId
export const GET_api_v1_payment_status$paymentId: JetFunc<
  {},
  { paymentId: string }
> = async function (ctx) {
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
```

## Where's JetPath future gonna be like?

We have exhausted our Roadmap, let's me what your suggestions are!

we are currently working an integrated admin interface, let us know what you think about that!!!

## Apache 2.0 Lincenced

Open sourced And Free.

Uiedbook is an open source community, the vision is to make the web better, improving and innovating infrastructures for a better web experience.

You can [join]("https://t.me/UiedbookHQ") on telegram.
Ask your questions and contribute XD.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

### Support

Your contribution(s) is a good force for change anytime you do it, you can ensure JetPath's continues growth and improvement by contributing a re-occuring or fixed donations to:

https://www.buymeacoffee.com/fridaycandour

Or Click.

<a href="https://www.buymeacoffee.com/fridaycandour"><img src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=&slug=fridaycandour&button_colour=FFDD00&font_colour=000000&outline_colour=000000&coffee_colour=ffffff" /></a>
