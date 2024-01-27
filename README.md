<br/>
<p align="center">
     <img src="icon.webp" alt="JetPath" width="190" height="190">

  <h1 align="center">JetPath</h1>

  <p align="center">
    JetPath - A fast and minimalist framework for Node, Deno and Bun.js. Embrace a new server-side DX with speed included.
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

In this version, multi-runtime support is no-longer based on compartiblity but pure engine api(s).

We Added Examples in the examples folder!

- running Node index.js starts a Node instance for your app.
- running Deno run index.ts starts a Deno instance for your app.
- running Bun index.ts starts a Bun instance for your app.

- looking into serverless

this version we fixed issues with the inbuilt cors hook.

- more speed, same size, more power.

# Rationale

JetPath is a Small(7kb) gzipped Server-side framework that is Fast and Easy to use.

[benchmark repo](https://github.com/FridayCandour/jetpath-benchmark)

- JetPath now runs one the runtime you are using, bun or node or deno.
- Function names as routing patterns (newest innovation you haven't seen before).
- Pre, Post and Error request hooks.
- Inbuilt Cors handlers.
- Fast and small and easy as peasy.
- A strong backup community moved with passion for making the web better.
- Now supports file streaming.
- Inbuilt swagger functionality.

In JetPath, unlike express, fastify or other Javascript base server-side framworks, JetPath is designed as a light, simple and but powerful, using the an intuitive route as function name system. you can be able to design and manage your api(s) with the smallest granularity possible.

This benefits are very lovely and delighting, trust me you have never written javascript app in this manner before and you should definitely check this out for a new taste beyound what the mainstream offers, an eciting DX.

--

## How JetPath works

JetPath works by search through the source forder and join up any defined paths and hooks that follows it's formart.

## Requirements to use JetPath.

JetPath support all server-side Javascript runtimes:

- Nodejs.
- Denojs.
- Bunjs.
- and deno deploy (testing)
- Edge support for runtimes like cloudflare workers(in view).

## Installation

Install JetPath Right away on your project using npm or Javascript other package managers.

```
npm i jetpath --save
```

## Usage

JetPath is very simple, it allows you to create the most actions in app in a very simple intuitive way.

#### A Basic App setup

```ts
// in your src/app.js
import JetPath from "jetpath";

const app = new JetPath({
  source: "./src", // optional
  port: 3000, // optional
  cors: true, // optional
});
//? listening for requests
app.listen();
```

#### Example routes

```ts
// in your ./src/routes/dogs.js
export function GET_dogs(ctx) {
  ctx.set("X-header", "dog server");
  ctx.reply("welcome home fellas");
}

//? POST locahost:8080/dogs
export async function POST_dogs(ctx) {
  console.log(await ctx.json());
  ctx.reply("enter skelter");
}

//? GET locahost:8080/dogs/friday/12/male
export async function GET_dogs$name$age$sex(ctx) {
  const { name, age, sex } = ctx.params || {};
  ctx.reply(
    "hello " +
      name +
      " you are " +
      age +
      " years old and you are " +
      sex +
      " thanks for visiting JetPath App!"
  );
}

//? GET locahost:8080/dogs?*
export async function GET_dogs$$(ctx) {
  const { name, age, sex } = ctx.search || {};
  ctx.reply(
    "hello " +
      name +
      " you are " +
      age +
      " years old and you are " +
      sex +
      " thanks for visiting JetPath App!"
  );
}

//? hooks
export function hook__POST(ctx, data) {
  ctx.throw("no handlers for this request");
}

export function hook__PRE(ctx) {
  console.log(ctx.method);
}

export function hook__ERROR(ctx, err) {
  ctx.throw(400, err);
}
```

### ctx Overview at current

ctx is th JetPath parameter your route functions are called with.

```ts
export type AppCTXType = {
  // parse incoming data
  json(): Promise<Record<string, any>>;
  // readOnly(s)
  body: any; // only available after calling ctx.json()
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage; // original reg object
  method: string;
  // get and set headers and code
  get(field: string): string | undefined;
  set(field: string, value: string): void;
  code: number;
  //Reply  methods
  reply(data: unknown, ContentType?: string): void;
  throw(code?: number | string, message?: string): void;
  redirect(url: string): void;
};
```

When improvements and changes rolls out, we will quickly update this page and the currently prepared [web documentation]("https://uiedbook.gitbook.io/jetpath/").

## Where's JetPath future gonna be like?

currently we are working on integration with industry tools like

1. Logger (can use pino/winston)
2. http stream (done)
3. Swagger (can be used but JetPath has one inbuilt)
4. Web Socket (in the next releases)
5. file upload (in the next release)

## Apache 2.0 Lincenced

Opensourced And Free.

Uiedbook is an open source team of web focused engineers, their vision is to make the web better, improving and innovating infrastructures for a better web experience.

You can Join the [Uiedbook group]("https://t.me/UiedbookHQ") on telegram.
Ask your questions and become a team-member/contributor by becoming an insider.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

### Support

Your contribution(s) is a good force for change anytime you do it, you can ensure JetPath's growth and improvement by contributing a re-occuring or fixed donations to:

https://www.buymeacoffee.com/fridaycandour

Or Click.

<a href="https://www.buymeacoffee.com/fridaycandour"><img src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=&slug=fridaycandour&button_colour=FFDD00&font_colour=000000&outline_colour=000000&coffee_colour=ffffff" /></a>
