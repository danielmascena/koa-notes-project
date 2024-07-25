const Koa = require("koa");
const parse = require("co-body");
const session = require("koa-session");

const app = new Koa();
const form = `
  <form action="/login" method="POST">
    <input name="username" type="text" value="username">
    <input name="password" type="password" placeholder="The secret value is 'password'.">
    <button type="submit">Submit</button>
  </form>
`;

app.keys = ["secret1", "secret2", "secret3"];

app.use(session(app));

app.use(async (ctx, next) => {
  if (ctx.path !== "/") {
    return await next();
  }
  if (ctx.session.authenticated) {
    return (ctx.body = "Hello back");
  }
  ctx.status = 401;
});

app.use(async (ctx, next) => {
  if (ctx.path !== "/login") {
    return await next();
  }
  if (ctx.request.method === "GET") {
    return (ctx.body = form);
  }
  if (ctx.request.method !== "POST") {
    return;
  }
  const body = await parse(ctx);
  console.log({ body });

  if (body.username !== "username" || body.password !== "password") {
    return (ctx.status = 500);
  }
  ctx.session.authenticated = true;
  ctx.redirect("/");
});

app.use(async (ctx, next) => {
  if (ctx.path !== "/logout") {
    return await next();
  }
  ctx.session.authenticated = false;
  ctx.redirect("/login");
});

app.listen(3009);
console.log("Server up and running on port 3009");
console.log("🚀");
