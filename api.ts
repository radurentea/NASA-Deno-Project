import { Router } from 'https://deno.land/x/oak@v6.4.1/mod.ts';

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = 'Hello world';
});

export default router;