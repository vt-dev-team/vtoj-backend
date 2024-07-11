/**
 * src/routes/problem.ts
 * 
 * 该文件包含题目路由。
 */

import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { Problem } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

async function problemRoutes(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
        const problemRepository = fastify.dataSource.getRepository(Problem);
        const query = problemRepository.createQueryBuilder("problem")
            .leftJoinAndSelect("problem.creator", "user")
            .select([
                "problem.id",
                "problem.pid",
                "problem.title",
                "problem.description",
                "problem.creator",
                "problem.difficulty",
                "problem.tags",
                "problem.judgeMethod",
                "problem.timeLimit",
                "problem.memoryLimit",
                "user.id",
                "user.username",
                "user.rating",
                "user.tag"
            ]);
        const problem = await query.where("problem.id = :id", { id: request.params.id }).getOne();
        return problem;
    })

    fastify.get<{ Querystring: { page?: number, pageSize?: number, search?: string } }>('/list', async (request, reply) => {
        const problemRepository = fastify.dataSource.getRepository(Problem);
        const page = request.query.page || 1;
        const pageSize = request.query.pageSize || 25;
        const search = request.query.search;

        const query = problemRepository.createQueryBuilder("problem")
            .select([
                "problem.id",
                "problem.pid",
                "problem.title",
                "problem.difficulty",
                "problem.tags",
                "problem.judgeMethod"
            ]);

        if (search) {
            query.where("problem.title LIKE :search", { search: `%${search}%` })
                .orWhere("problem.tags LIKE :search", { search: `%${search}%` });
        }

        query.take(pageSize).skip((page - 1) * pageSize);

        const problems = await query.getMany();
        return problems;
    });
}

export default problemRoutes;