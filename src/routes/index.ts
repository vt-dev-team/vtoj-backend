import { FastifyInstance } from "fastify";

export default function routes(fastify: FastifyInstance, options: any, done: Function) {
    fastify.register(import('./base'), { prefix: '/base' });
    fastify.register(import('./user'), { prefix: '/user' });
    fastify.register(import('./problem'), { prefix: '/problem' });

    done();
}