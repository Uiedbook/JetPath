## Introducing JetPath: A Lightning-Fast, Code-Saving Node Framework, for Supercharged Server-Side apps! ✨🚀

<img src="sunset.jpg" />

Image by <a href="https://pixabay.com/users/analogicus-8164369/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8173575">Tom</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8173575">Pixabay</a>

## it's Evening time here tho.

It's evening over here, and i'm writing this article to talk about two things.

1. The heavy and cumbersome nature of server-sider frameworks for NodeJs, Denojs and Bunjs
2. The solution y'all been waiting for!

let's walk in.

## Cumbersome? what's cumbersome?

What's the Challenge?

Things become cumbersome when they tends to create a dependency tree, complicated interfaces, limited innovation, excessive abstraction layers, and most of all using solutions that implies heavy runtime overhead. If you've ever felt trapped in this situation, you're not alone.

As a software engineer i always have this phylosophy of simplicity is easier to manage and extend. The tool I'm about to introduce aligns with this philosophy, providing a refreshing perspective in this early 2024 and beyound.

### The Culprits in most node Frameworks.

High learning curve, Abstraction layers, Convention over Configuration, Middleware management, boiler-platey codes, Configuration Overheads, Dependency Injection overhead, debugging challeges, updates and compartibility dramas.

Not to make this article too long and creating a debate over the value of whatever advantages or disadvantages. i won't go much into detail on which tools is lacking or what's not.

Instead, Let's walk into something better.

## Rationale

<center>
<img style="display: block; margin: 20px auto;" src="icon.webp" alt="JetPath" width="190" height="190">

<h1>
JetPath
</h1>
</center>

Many are obviously fed up of dealing with heavy and cumbersome server-side frameworks for our Node.js, Deno.js, and Bun.js applications. Looking into `JetPath` which revolutionize our development experience With its lightweight design and intuitive routing patterns, `JetPath` takes server-side JavaScript frameworks to a new level.

Whether you're using Node.js, Deno.js, or Bun.js, `JetPath` adapts seamlessly to your preferred runtime. Let's look into `JetPath` maybe it will solve all your problems.

It's a runtime 'Drop in' it only use the native http api of the runtime you run your app with, so zero compartibility overhead ma.

With a sleek design and high performance, `JetPath` offers a refreshing experience, i have ever seen. this is new innovation.

## Fast, Small, and Easy-Peasy

JetPath is a small and efficient framework, weighing in at just 6kb. Its lightweight nature bare level of abstraction ensures your applications performs optimally without unnecessary overhead. Additionally, `JetPath` offers an easy-to-use API, enabling you to design and manage your API(s) with unparalleled granularity.

Unlike traditional frameworks like Express or Fastify, `JetPath` introduces a groundbreaking innovation with function names as routing patterns. This unique and innovative approach simplifies your code and enhances the readability of your routing logic.

## The Need for more Speed and Simplicity

When it comes to server-side frameworks, speed and simplicity are of utmost importance. JetPath's aim is to avoid performance bottle necks, with a lightweight and minimalist design that emphasizes on speed and simplicity.

It's has an inbuilt intuitive routing system, which uses function names as routing patterns, sets it apart from traditional frameworks like Express or Fastify. This innovative approach simplifies your code and enhances the readability of your routing logic, making it easier to design and manage your API(s) with unparalleled granularity.

JetPath is one of Bun's fastest web frameworks.

[benchmark repo](https://github.com/FridayCandour/jetpath-benchmark)

## The Power of JetPath

`JetPath` seamlessly adapts to your preferred runtime. With JetPath, you have the flexibility to choose the runtime that best suits your project's requirements without sacrificing the simplicity and speed that `JetPath` offers. Why limit yourself to a single runtime when `JetPath` empowers you to explore all three? with no extra steps!!!

## Joining the Community

Our Telegram group, comprised of passionate minds, is dedicated to making the web better. Whether you're a beginner developer or embarking on your coding journey, you'll find support, inspiration, and collaboration within the [Uiedbook](https://t.me/uiedbookHQ) community.

## Exploring How JetPath's Work

JetPath operates by searching through your source folder and automatically assembling any exported defined paths and hooks functions following its intuitive route patterns.

This seamless integration saves you precious development time and effort. Instead of spending hours configuring and setting up routes, you can focus on crafting your application's core logic while `JetPath` handles the routing for you.

`JetPath`'s minimalist and efficient approach streamlines the development process, allowing you to build powerful server applications with ease.

## Easy Setup and Configuration

Getting started with `JetPath` is a breeze. Simply install `JetPath` using npm or your preferred JavaScript package manager:

```
npm install jetpath --save
```

Once installed, configure your JetPath instance with necessary options, such as setting the source folder for your routes and specifying the port you want to listen on. Here's an example:

```typescript
import { JetPath } from "jetpath";

const app = new JetPath({
  source: "./src", // Optional: Set the source folder for your routes
  port: 3000, // Optional: Specify the port you want to listen on
  cors: true, // Optional: Enable CORS support
});

// Start listening for requests
app.listen();
```

With just a few lines of code, you're up and running with JetPath, ready to take advantage of its speed and simplicity.

## How `JetPath` Works

JetPath operates by searching through your folders and automatically assembling any defined paths and hooks following its intuitive format. This process saves you time and effort, allowing you to focus on building your application's core logic removing all that stress, project setup overhead and saves you time.

And these features are the core of JetPath.

### Function Names as Routing Patterns

JetPath introduces an innovation where your function names declares the routing pattern for the function. This unique approach eliminates the need for complex configuration files and enables you to define routes with ease.

My first testimony - ( more below )

`not going to spend time thinnking about what to name this function anymore, cus now i know!`

### Pre, Post, and Error Request Hooks

JetPath provides hooks that allows you to execute code before and after each request, as well as handle any runtime errors that may occur. These hooks offer unparalleled flexibility to customize the behavior of your application. Whether you need to manipulate data, validate requests, or handle errors gracefully, `JetPath`'s hooks has got you covered.

### Built-in CORS Handlers

JetPath has an built-in CORS hook. Enable CORS support with a simple inialisation option, and `JetPath` takes care of the rest.

## Requirements and Installation

JetPath is built for the major server-side JavaScript runtimes, Node.js, Deno.js, and Bun.js. Additionally, it offers experimental support for environments like Deno Deploy and edge runtimes such as Cloudflare Workers (coming soon). To get started, simply install `JetPath` using your preferred package manager:

```bash
npm i `jetpath` --save
```

## Getting Started with JetPath

Using `JetPath` is incredibly straightforward. Let's walk through a basic app setup to demonstrate the simplicity of JetPath:

```typescript
import { JetPath } from "jetpath";

const app = new JetPath({
  source: "./src", // Optional: Set the source folder for your routes
  port: 3000, // Optional: Specify the port you want to listen on
  cors: true, // Optional: Enable CORS support
});

// Start listening for requests
app.listen();
```

## Example Routes

To provide a better understanding of JetPath's capabilities, let's take a look at

some example routes:

```js
// File: src/routes/cats.js

// GET localhost:8080/
export function GET_cats(ctx) {
  ctx.set("token", "0x00000");
  ctx.reply("Welcome home, `JetPath` fellas!");
}

// GET localhost:8080/cats
export function GET_cats(ctx) {
  ctx.reply({ foo: "bar" });
  // ctx.throw(400, "meow");
}

// POST localhost:8080/cats
export async function POST_cats(ctx) {
  console.log(await ctx.text());
  ctx.reply("Enter skelter");
}

// GET localhost:8080/cats/friday/12/male
export async function GET_cats$name$age$sex(ctx) {
  const { name, age, sex } = ctx.params;
  ctx.reply(
    `Hello ${name}, you are ${age} years old and you are ${sex}. Thanks for visiting the `JetPath` App!`
  );
}

// GET localhost:8080/cats?*
export async function GET_cats$$(ctx) {
  const { name, age, sex } = ctx.search;
  ctx.reply(
    `Hello ${name}, you are ${age} years old and you are ${sex}. Thanks for visiting the `JetPath` App!`
  );
}

// GET localhost:8080/default/dog/types
export async function GET_default_dog_types(ctx) {
  // custom ctx methods
  ctx.sendDefaultDoglist();
}

// hook to decorate the CTX
export function hook__DECORATOR() {
  return {
    sendDefaultDoglist() {
      this.reply({
        types: [
          "rottweiler",
          "german sheepherd",
          "boerbull",
          "husky",
          "neopolitan mastiff",
          "pitbull",
          "pug",
          "eskimo",
          "labrador",
          "golden retrieval",
        ],
      });
    },
  };
}



// Hooks
export function hook__POST(ctx, data) {
  // console.log("POST boohoo");
  return data;
}

export function hook__PRE(ctx) {
  // console.log("PRE function boohoo");
  return data;
}

export function hook__ERROR(ctx, err) {
  ctx.throw(400, "Bad request!");
}
```

We define routes using function names, allowing for clear and concise code. `JetPath` also supports pre and post-request hooks, providing extra flexibility for customizations. Additionally, `JetPath` includes inbuilt CORS hooks, things everyone web dev needs :).

## It's time to JetPath, JetPath, Jet.

JetPath is the game-changing innovation you've been waiting for — a fast, minimalist framework that empowers you to build powerful server applications with ease. With its lightning speed, simplicity-driven design, and passionate community, `JetPath` is the ideal choice for your Node.js, Deno.js, or Bun.js projects.

## My testimony

Jetpath greatly reduced the code on all my node code-bases and let me focus on what's important.

Wait i forgot to mention my apis are several orders of magnitude faster than previous frameworks my projects are based on.

Add your testimonies below

...

Some read-world codes (copied with permission)

```js
export async function POST_admin_create_product(ctx: AppCTXType) {
  await productSchema.validateData(await ctx.json()).catch((e) => {
    ctx.throw(400, e); // code stopped executing here if erred
  }); // ignore it don't share my data validator library it's too fast.

  ctx.body.category = ctx.body.category.toLowerCase().trim();
  ctx.body.uploadedOn = new Date().toDateString();
  const product = new Product(ctx.body);
  const data = await product.save();
  ctx.reply({ data, status: 201, message: "ok" });
}

export async function Get_products_search$query(ctx: AppCTXType) {
  if (!ctx.params.query) return undefined;
  const search = await Product.find({
    title: { $regex: ctx.params.query, $options: "i" },
  })
    .limit(38)
    .exec();
  ctx.reply(search);
}
```

share the love, tell someone about JetPath. i told my friends and my mum.

## Where's JetPath future gonna be like?

currently we are working on integration with industry tools like

1. GraphQL Yoga
2. Swagger (in progress)
3. tRPC
4. Vite (in progress)
5. Web Socket (in progress)
6. Clerk
7. Lucia Auth
8. Logger (in progress)
9. http stream (in progress)
10. file upload (in progress)

This road map is short and narrow to what everyone would benenfit from the most, if you have any suggestions kindly reach out to me on the [HQ](https://t.me/uiedbookHQ).

If you want to make npm packages for JetPath and need support, send a dm.

dog names suggestions was provided by @da-favice.

### The Pizza Area

<a href="https://www.buymeacoffee.com/fridaycandour"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=&slug=fridaycandour&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
