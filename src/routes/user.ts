/**
 * src/routes/user.ts
 * 
 * 该文件包含用户路由。
 */

import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { User } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/list', { preHandler: [authenticateSession] }, async (request, reply) => {
        const userRepository = fastify.dataSource.getRepository(User);
        const users = await userRepository.find();
        return users;
    });

    fastify.post('/add', async (request, reply) => {
        const { username } = request.body as { username: string };
        const userRepository = fastify.dataSource.getRepository(User);
        const user = await userRepository.create({ username });
        await userRepository.save(user);
        return user;
    });
}

export default userRoutes;