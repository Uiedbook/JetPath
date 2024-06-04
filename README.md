<br/>
<p align="center">
     <img src="icon.webp" alt="JetPath" width="190" height="190">

  <h1 align="center">JetPath</h1>

  <p align="center">
    JetPath 🚀 - Is a granular, fast and minimalist framework for Node, Deno and Bun. Embrace new standards!!!
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
5. Logger usage - (we tested pino/winston).

In this version (not this latest), multi-runtime support is no-longer based on compartiblity but pure engine api(s).

We Added Examples in the examples folder!

- running Node index.js starts a Node instance for your app.
- running Deno run index.ts starts a Deno instance for your app.
- running Bun index.ts starts a Bun instance for your app.
- looking into serverless

this version we fixed issues with the inbuilt cors hook.

- more speed, same size, more power.

# Rationale

JetPath is a web framework that is Granularity, Fast and Easy to use.

[benchmark repo](https://github.com/FridayCandour/jetpath-benchmark)

- JetPath now runs on the runtime you are using, bun or node or deno.
- Function names as routing patterns (newest innovation you haven't seen before).
- Pre, Post and Error request hooks.
- Inbuilt Cors handlers.
- Fast and small and easy as peasy.
- A strong backup community moved with passion for making the web better.
- Inbuilt API auto doc functionality.

JetPath is designed as a light, simple and but powerful, using the an intuitive route as function name system. you can be able to design and manage your api(s) with the smallest granularity possible.

This benefits are very lovely and delighting, but trust me you have never written javascript app in this manner before and you should definitely check this out.

--

## How JetPath works

JetPath works by search through the source forder and join up any defined handlers and hooks that follows it's format in files named [anything].route.js.

## Requirements to use JetPath.

JetPath support all web Javascript runtimes:

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

#### An hello App setup

```ts
// in your src/index.routes.js

import { JetPath } from "jetpath";

const app = new JetPath({
  port: 8080,
});

//? listening for requests
app.listen();

// = /
export async function GET_(ctx: Context) {
  ctx.send("hello world!");
}
```

## Where's JetPath future gonna be like?

We have exhausted our Roadmap, let's me what your suggestions are!

we are currently working an integrated admin interface, let us know what you think about that!!!

## Apache 2.0 Lincenced

Opensourced And Free.

Uiedbook is an open source, our vision is to make the web better, improving and innovating infrastructures for a better web experience.

You can [join]("https://t.me/UiedbookHQ") on telegram.
Ask your questions and contribute XD.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.

### Support

Your contribution(s) is a good force for change anytime you do it, you can ensure JetPath's growth and improvement by contributing a re-occuring or fixed donations to:

https://www.buymeacoffee.com/fridaycandour

Or Click.

<a href="https://www.buymeacoffee.com/fridaycandour"><img src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=&slug=fridaycandour&button_colour=FFDD00&font_colour=000000&outline_colour=000000&coffee_colour=ffffff" /></a>
