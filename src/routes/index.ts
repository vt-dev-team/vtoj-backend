/**
 * src/routes/index.ts
 * 
 * 这个文件主要引入所有的路由并将其导出。
 * 具体每个路由的信息都在每个文件的最开始写上了。这里就不在说了。
 * 
 * 另外，每个文件中写的可能比较简略，找个时间写到文档里面，能更清晰一点。
 */

import { FastifyInstance } from "fastify";

export default function routes(fastify: FastifyInstance, options: any, done: Function) {
    fastify.register(import('./base'), { prefix: '/base' });
    fastify.register(import('./user'), { prefix: '/user' });
    fastify.register(import('./problem'), { prefix: '/problem' });
    fastify.register(import('./contest'), { prefix: '/contest' });
    fastify.register(import('./submission'), { prefix: '/submission' });

    done();
}