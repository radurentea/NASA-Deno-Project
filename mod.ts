import { Application, send } from 'https://deno.land/x/oak@v6.4.1/mod.ts';

const app = new Application();
const PORT = 8000;

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method}, ${ctx.request.url}: ${time}`);
})

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${delta}ms`);
});

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    'index.html',
    'images/favicon.png',
    'javascripts/script.js',
    'stylesheets/style.css'
  ];
  await send(ctx, filePath, {
    root: `${Deno.cwd()}/public`,
  });
});

app.use(async (ctx) => {
  ctx.response.body = 'Hello World';
});

if (import.meta.main) {
  await app.listen({
    port: PORT
  });
}
