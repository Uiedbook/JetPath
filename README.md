<br/>
<p align="center">
  <a href="https://github.com/uiedbook/JetPath">
     <img src="icon-transparent.webp" alt="JetPath" width="190" height="190">
  </a>

  <h1 align="center">JetPath</h1>

  <p align="center">
    JetPath - A fast and minimalist framework for Node, Deno and Bun.js. Embrace a new server app DX with speed included.
    <br/>
    <br/>
    <a href="https://github.com/uiedbook/JetPath#examples"><strong>Explore JetPath APIs »</strong></a>
    <br/>
    <br/>
    <a href="https://t.me/JetPath">Join Community</a>
    .
    <a href="https://github.com/uiedbook/JetPath/issues">Report Bug</a>
    .
    <a href="https://github.com/uiedbook/JetPath/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/uiedbook/JetPath?color=dark-green)
[![npm Version](https://img.shields.io/npm/v/JetPath.svg)](https://www.npmjs.com/package/JetPath)
![Forks](https://img.shields.io/github/forks/uiedbook/JetPath?style=social)
![Stargazers](https://img.shields.io/github/stars/uiedbook/JetPath?style=social)

--

# Rationale

JetPath is a Small(5.35kb) Server-side framework that is Fast and Easy to use.

- Function names as routing patterns.
- Pre, Post and Error request hooks.
- Inbuilt Cors interface.
- Fast and BenchedMarked.
- A strong backup community moved with passion for making the web better.

In JetPath, unlike express, fastify or other Javascript base server-side framworks, JetPath is designed as a light, simple and but powerful, using the an intuitive route as function name system. you can be able to design and manage your api(s) with more granularity as an easy peasy grease.

This benefits are very essential and delighting.

--

## How JetPath works

JetPath works by search through the source forder and join up any defined paths and hooks that follows it's formart.

## Requirements to use JetPath.

JetPath support all server-side Javascrit runtimes:

- Nodejs.
- Denojs.
- Bunjs.
- Edge support for runtimes like cloudflare workers and deno deploy(in view).

## Installation

Install JetPath Right away on your project using npm or Javascript other package managers.

```
npm i jetpath --save
```

## Usage

JetPath is very simple, it allows you to create the most actions in app in a very intuitive way.

#### A Basic App setup

```ts
import JetPath from "jetpath";

const app = new JetPath({
  source: "./src", // optional
  port: 3000, // optional
  cors: true, // optional
});
//? listening for requests
await app.listen();
```

#### Example routes

```ts
import JetPath from "jetpath";

const app = new JetPath({
  source: "./src", // optional
  port: 3000, // optional
  cors: true, // optional
});

// in your ./src/dogs.js

//? GET locahost:8080/dogs
export function GET_dogs(ctx) {
  ctx.set("X-E", "boohoo");
  ctx.reply({ foo: "bar" });
  // ctx.throw(400, "boohoo you mf*");
}

//? POST locahost:8080/dogs
export async function POST_dogs(ctx) {
  console.log(await ctx.text());
  ctx.reply("enter skelter");
}

//? GET locahost:8080/dogs/friday/12/male
export async function GET_dogs$name$age$sex(ctx) {
  const { name, age, sex } = ctx.params;
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
  const { name, age, sex } = ctx.search;
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
  // console.log("POST boohoo");
  return data;
}

export function hook__PRE(ctx) {
  // console.log("PRE function boohoo");
  return data;
}

export function hook__ERROR(ctx, err) {
  ctx.throw(400, "bad request!");
}
```

When improvements and changes rolls out, we will quickly update this page and the currently prepared [web documentation]("https://uiedbook.gitbook.io/jetpath/").

We intend to move with less traction and have implemented many of the best decisions and designs we can think-of/research right from the beginning.

The `JetPath` class accepts an object argument with the following options:

## MIT Lincenced

Opensourced And Free.

Uiedbook is an open source team of web focused engineers, their vision is to make the web better, improving and innovating infrastructures for a better web experience.

You can Join the [Uiedbook group]("https://t.me/UiedbookHQ") on telegram.
Ask your questions and become a team-member/contributor by becoming an insider.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code to be distributed under the MIT license. You are also implicitly verifying that all code is your original work.
