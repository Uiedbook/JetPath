# Introducing JetPath: A Lightning-Fast, Code-Saving Node Framework, for Supercharged Server-Side apps! ✨🚀

<img src="sunset.jpg" />

Image by <a href="https://pixabay.com/users/analogicus-8164369/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8173575">Tom</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8173575">Pixabay</a>

## it's Evening time here tho.

It's evening over here, and i'm writing this article to share with the awareness about two thing.

1. The heavy and cumbersome nature of server-sider frameworks for NodeJs, Denojs and Bunjs
2. The solution y'all been waiting for!

Sit properly let's evaluate and hunt for something better.

## Cumbersome? what's cumbersome?

What's the Challenge?

Things become cumbersome when they tends to create a dependency tree, complicated interfaces, limited innovation, excessive abstraction layers, and most of all using solutions that implies heavy runtime overhead. If you've ever felt trapped in this situation, you're not alone.

As a software engineer i always have this phylosophy of simplicity is easier to manage and extend. The tool I'm about to introduce aligns with this philosophy, providing a refreshing perspective.

### The Culprits in most node Frameworks.

High learning curve, Abstraction layers, Convention over Configuration, Middleware management, boiler-platey codes, Configuration Overheads, Dependency Injection overhead, debugging challeges, updates and compartibility dramas.

Not make this article too long and creating a debate over the value of whatever advantages or disadvantages. i won't go much into detail on which tools is lacking or what's not.

Instead, Let's talk about something better.

## Rationale

<img style="display: block; margin: 20px auto;" src="icon.webp" alt="JetPath" width="190" height="190">

Many are obviously fed up of dealing with heavy and cumbersome server-side frameworks for our Node.js, Deno.js, and Bun.js applications. Looking into `JetPath` which revolutionize our development experience With its lightweight design and intuitive routing patterns, `JetPath` takes server-side JavaScript frameworks to a new level.

Whether you're using Node.js, Deno.js, or Bun.js, `JetPath` adapts seamlessly to your preferred runtime. Let's look into `JetPath` maybe it will solve all your problems.

It's 'Drop in' it only use the native http api of the runtime you run your app with, so zero compartibility overhead ma.

You enjoy enjoy this sleek design and fast performance, `JetPath` offers a refreshing experience.

## Fast, Small, and Easy-Peasy

JetPath is a small and efficient framework, weighing in at just 5.7kb. Its lightweight nature bare level of abstraction ensures your applications perform optimally without unnecessary overhead. Additionally, `JetPath` offers an easy-to-use API, enabling you to design and manage your API(s) with unparalleled granularity.

Unlike traditional frameworks like Express or Fastify, `JetPath` introduces a groundbreaking innovation with function names as routing patterns. This unique approach simplifies your code and enhances the readability of your routing logic.

## The Need for more Speed and Simplicity

When it comes to server-side frameworks, speed and simplicity are of utmost importance. Other frameworks out there often come with unnecessary overhead, slowing down your application's performance. JetPath, on the other hand, is a lightweight and minimalist framework that emphasizes on speed and simplicity.

It's intuitive routing system, which uses function names as routing patterns, sets it apart from traditional frameworks like Express or Fastify. This innovative approach simplifies your code and enhances the readability of your routing logic, making it easier to design and manage your API(s) with unparalleled granularity.

JetPath is one of Bun's fastest web frameworks.

[benchmark repo](https://github.com/FridayCandour/jetpath-benchmark)

## The Power of JetPath

`JetPath` seamlessly adapts to your preferred runtime. With JetPath, you have the flexibility to choose the runtime that best suits your project's requirements without sacrificing the simplicity and speed that `JetPath` offers. Why limit yourself to a single runtime when `JetPath` empowers you to explore all three? with no extra steps!!!

## Joining the Community

Our Telegram group, comprised of passionate minds, is dedicated to making the web better. Whether you're a beginner developer or embarking on your coding journey, you'll find support, inspiration, and collaboration within the [Uiedbook](https://t.me/uiedbookHQ) community.

## Exploring JetPath's Functionality

JetPath operates by searching through your source folder and automatically assembling any defined paths and hooks following its intuitive format.

This seamless integration saves you precious development time and effort. Instead of spending hours configuring and setting up routes, you can focus on crafting your application's core logic while `JetPath` handles the routing for you.

`JetPath`'s minimalist and efficient approach streamlines the development process, allowing you to build powerful server applications with ease.

## Easy Setup and Configuration

Getting started with `JetPath` is a breeze. Simply install `JetPath` using npm or your preferred JavaScript package manager:

```
npm install jetpath --save
```

Once installed, configure your JetPath instance with necessary options, such as setting the source folder for your routes and specifying the port you want to listen on. Here's an example:

```typescript
import `JetPath` from "jetpath";

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

JetPath introduces a groundbreaking innovation where your function names embody the routing patterns. This unique approach eliminates the need for complex configuration files and enables you to define routes with ease. By aligning your code structure with your routing structure, `JetPath` streamlines the development process and improves code maintainability.

My first testimony - ( more below )

`not going to spend time thinnking about what to name this function anymore, cus now i know!`

### Pre, Post, and Error Request Hooks

JetPath provides hooks that allow you to execute code before and after each request, as well as handle any runtime errors that may occur. These hooks offer unparalleled flexibility to customize the behavior of your application. Whether you need to manipulate data, validate requests, or handle errors gracefully, `JetPath` has got you covered.

### Built-in CORS Handlers

JetPath has an built-in CORS hook. Enable CORS support with a simple inialisation option, and `JetPath` takes care of the rest.

## Requirements and Installation

JetPath is built for the major server-side JavaScript runtimes, Node.js, Deno.js, and Bun.js. Additionally, it offers experimental support for environments like Deno Deploy and edge runtimes such as Cloudflare Workers (coming soon). To get started, simply install `JetPath` using your preferred package manager:

```bash
npm i `jetpath` --save
```

## Getting Started with JetPath

Using `JetPath` is incredibly straightforward, enabling you to create powerful applications with ease. Let's walk through a basic app setup to demonstrate the simplicity of JetPath:

```typescript
import `JetPath` from "jetpath";

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

We define routes using function names, allowing for clear and concise code. `JetPath` also supports pre and post-request hooks, providing extra flexibility for customizations. Additionally, `JetPath` includes inbuilt CORS hooks, things everyone needs.

## It's time to JetPath, JetPath, Jet.

JetPath is the game-changer you've been waiting for — a fast, minimalist framework that empowers you to build powerful server applications with ease. With its lightning speed, simplicity-driven design, and passionate community, `JetPath` is the ideal choice for your Node.js, Deno.js, or Bun.js project.

Benchmarks you won't believe can be on the repo soon.

## My testimony

Jetpath greatly reduced the code on all my node code-bases and let me focus on what's important.

Wait i forgot to mention my apis are several orders of magnitude faster than previuos frameworks my projects are based on.

Add your testimonies below

...

### The Pizza Area

<a href="https://www.buymeacoffee.com/fridaycandour"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a pizza&emoji=&slug=fridaycandour&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>

Some read-world codes (copied)

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

// if you wanna add your just dm me @procal.
```

share the love, tell someone about JetPath.

## Where's JetPath future gonna be like?

currently we are working on integration with industry tools like

1. GraphQL Yoga
2. Swagger
3. tRPC
4. Vite
5. Web Socket
6. Clerk
7. Lucia Auth
8. Logger

This road map is short and narrow to what everyone will benenfit the most from, if you have any suggestion kindly reach out to me.
