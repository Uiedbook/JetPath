<br/>
<p align="center">
     <img src="icon.webp" alt="JetPath" width="190" height="190">

  <h1 align="center">JetPath</h1>

  <p align="center">
    JetPath 🚀 - A fast and minimalist framework for Node, Deno and Bun.js. Embrace a new dev DX!
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

JetPath is a Small Server-side framework that is Fast and Easy to use.

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

This benefits are very lovely and delighting, but trust me you have never written javascript app in this manner before and you should definitely check this out for a new taste beyound what the mainstream offers, an eciting DX.

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
// in your ./src/routes/PathShop.js

import { AppCTX, Schema } from "../dist/index.js";

//? Body validators

export const BODY_pets: Schema = {
  name: { err: "please provide dog name", type: "string" },
  image: { type: "string", nullable: true, inputType: "file" },
  age: { type: "number" },
};
export const BODY_petBy$id: Schema = {
  name: { err: "please provide dog name", type: "string" },
  image: { type: "string", nullable: true, inputType: "file" },
  age: { type: "number" },
};
export const BODY_petImage$id: Schema = {
  image: { type: "string", inputType: "file" },
};

// ? Routes

// ? PETshop temperaly Database
const pets: { id: string; imageUrl: string; name: string }[] = [];

// ? /
export async function GET_(ctx: AppCTX) {
  ctx.reply("Welcome to Petshop!");
}

// List Pets: Retrieve a list of pets available in the shop
// ? /pets
export function GET_pets(ctx: AppCTX) {
  ctx.reply(pets);
}

// ? /petBy/19388
// Get a Pet by ID: Retrieve detailed information about a specific pet by its unique identifier
export function GET_petBy$id(ctx: AppCTX) {
  const petId = ctx.params?.id;
  const pet = pets.find((p) => p.id === petId);
  if (pet) {
    ctx.reply(pet);
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// ? /pets
// Add a New Pet: Add a new pet to the inventory
export async function POST_pets(ctx: AppCTX) {
  ctx.validate(await ctx.json());
  const newPet: { id: string; imageUrl: string; name: string } = ctx.body;
  // Generate a unique ID for the new pet (in a real scenario, consider using a UUID or another robust method)
  newPet.id = String(Date.now());
  pets.push(newPet);
  ctx.reply({ message: "Pet added successfully", pet: newPet });
}

// Update a Pet: Modify the details of an existing pet
// ? /petBy/8766
export async function PUT_petBy$id(ctx: AppCTX) {
  ctx.validate(await ctx.json());
  const petId = ctx.params.id;
  const updatedPetData = await ctx.json();
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    // Update the existing pet's data
    pets[index] = { ...pets[index], ...updatedPetData };
    ctx.reply({ message: "Pet updated successfully", pet: pets[index] });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// ? /petBy/8766
// Delete a Pet: Remove a pet from the inventory
export function DELETE_petBy$id(ctx: AppCTX) {
  const petId = ctx.params.id;
  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    const deletedPet = pets.splice(index, 1)[0];
    ctx.reply({ message: "Pet deleted successfully", pet: deletedPet });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// ? /petImage/76554
// Upload a Pet's Image: Add an image to a pet's profile
export async function POST_petImage$id(ctx: AppCTX) {
  const petId = ctx.params.id;
  // @ts-ignore
  console.log(ctx.request);
  const formdata = await ctx.request.formData();
  console.log(formdata);
  const profilePicture = formdata.get("image");
  if (!profilePicture) throw new Error("Must upload a profile picture.");
  console.log({ formdata, profilePicture });

  const index = pets.findIndex((p) => p.id === petId);
  if (index !== -1) {
    // Attach the image URL to the pet's profile (in a real scenario, consider storing images externally)
    pets[index].imageUrl = `/images/${petId}.png`;
    // write profilePicture to disk
    // @ts-ignore
    await Bun.write(pets[index].imageUrl, profilePicture);
    ctx.reply({
      message: "Image uploaded successfully",
      imageUrl: pets[index].imageUrl,
    });
  } else {
    ctx.code = 404;
    ctx.reply({ message: "Pet not found" });
  }
}

// ? error hook
export function hook__ERROR(ctx: AppCTX, err: unknown) {
  ctx.code = 400;
  console.log(err);
  ctx.reply(String(err));
}

//? hooks
export function hook__POST(ctx, data) {
  ctx.throw("no handlers for this request");
}

export function hook__PRE(ctx) {
  console.log(ctx.method);
}
```

### ctx Overview at current

ctx is th JetPath parameter your route functions are called with.

```ts
export type AppCTX = {
  json(): Promise<Record<string, any>> | undefined;
  validate(data: any): Record<string, any>;
  body?: any;
  code: number;
  search: Record<string, string>;
  params: Record<string, string>;
  request: IncomingMessage | Request;
  method: string;
  reply(data: unknown, ContentType?: string): void;
  throw(
    code?: number | string | Record<string, any> | unknown,
    message?: string | Record<string, any>
  ): void;
  redirect(url: string): void;
  get(field: string): string | undefined;
  set(field: string, value: string): void;
  pipe(stream: Stream | string, ContentType: string): void;
  app: Record<string, any>;
};
```

When improvements and changes rolls out, we will quickly update this page and the currently prepared [web documentation]("https://uiedbook.gitbook.io/jetpath/").

## Where's JetPath future gonna be like?

We have exhausted our Roadmap, let's me what your suggestions are!

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
