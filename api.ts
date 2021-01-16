import { Router } from 'https://deno.land/x/oak@v6.4.1/mod.ts';

import * as planets from './models/planets.ts';
import * as launches from './models/launches.ts';

const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = 'Hello world';
});

router.get('/planets', (ctx) => {
  ctx.response.body = planets.getAllPlanets();
})

router.get('/launches', (ctx) => {
  ctx.response.body = launches.getAll();
})

router.get('/launches/:id', (ctx) => {
  if  (ctx.params?.id) {
    const launchesList = launches.getOne(Number(ctx.params.id));
    if (launchesList) {
      ctx.response.body = launchesList;
    } else {
      ctx.throw(400, 'The requested launch doesn\'t exist');
    }
  }
})

export default router;