const Koa = require("koa");
const app = new Koa();

// entry point
app.use(async (ctx, next) => {
  console.log("entry: ", "1");
  await next();
  console.log("entry: ", "2");
});

// logger

app.use(async (ctx, next) => {
  console.log("logger: ", "1");
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log("logger: ", "2");
});

// x-response-time

app.use(async (ctx, next) => {
  console.log("x-response-time: ", "1");
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
  console.log("x-response-time: ", "2");
});

// response

app.use(async (ctx) => {
  console.log("response: ", 1);
  ctx.body = "Hello world";
  console.log("response: ", 2);
});

app.listen(3005);
