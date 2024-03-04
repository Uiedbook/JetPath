uploading files with JetPath

## Node

https://github.com/mscdex/busboy

```js
// install

// npm i busboy

// usage

POST_upload_files(ctx) {
if (req.method === "POST") {
const bb = busboy({ headers: req.headers });
bb.on("file", (name, file, info) => {
const saveTo = path.join(os.tmpdir(), `busboy-upload-${random()}`);
file.pipe(fs.createWriteStream(saveTo));
});
bb.on("close", () => {
ctx.send("done!")
});
req.pipe(bb);
return;
}
}
```

## Bun

https://bun.sh/guides/http/file-uploads

```js
// usage
POST_upload_files(ctx) {
    const formdata = await ctx.request.formData();
    const profilePicture = formdata.get('profilePicture');
    if (!profilePicture) throw new Error('Must upload a profile picture.');
    // write profilePicture to disk
    await Bun.write('profilePicture.png', profilePicture);
    ctx.send("done!")
}
```

## Deno

https://medium.com/deno-the-complete-reference/handle-file-uploads-in-deno-ee14bd2b16d9

```js
// usage
POST_upload_files(ctx) {
const SAVE_PATH = "./";
const reader = ctx.request?.body?.getReader();
  const f = await Deno.open(SAVE_PATH + fileName, {
    create: true,
    write: true,
  });
  await Deno.copy(readerFromStreamReader(reader), f);
  await f.close();
ctx.send("done!")
},
```
