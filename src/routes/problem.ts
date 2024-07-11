/**
 * src/routes/problem.ts
 * 
 * 该文件包含题目路由。
 * 
 * 提醒：关于具体的题目权限，不同的域、不同的比赛应该严格加以区分，不要忘了。
 * 
 * 主要有以下功能：
 * - [未开始]新增题目
 *   需要权限MANAGE_PROBLEM。这个权限应该根据专门的域来获取。新增题目，需要提供题目标题、描述、难度、标签、评测方法、时间限制、内存限制、所属域等。
 * - [未开始]修改题目信息
 *   需要权限MANAGE_PROBLEM。这个权限应该根据专门的域来获取，并且如果制定了用户对某个题目有管理权限，也应该放行。修改题目信息，可以修改题目标题、描述、难度、标签、评测方法、时间限制、内存限制等，所属域不能更改。
 * - [未开始]删除题目
 *   需要权限MANAGE_PROBLEM。这个权限应该根据专门的域来获取，并且如果制定了用户对某个题目有管理权限，也应该放行。删除题目，删除后题目的所有信息都会被删除。
 * - [未开始]新增题目权限
 *   需要权限MANAGE_PROBLEM。这个权限应该根据专门的域来获取。新增题目权限，可以增加或减少用户对某个题目的权限。
 * - [未开始]修改题目测试数据
 *   需要权限MANAGE_PROBLEM。这个权限应该根据专门的域来获取，并且如果制定了用户对某个题目有管理权限，也应该放行。修改题目测试数据，这个比较麻烦。需要操作文件系统。
 * - [未完成]获取题目信息
 *   需要权限VIEW_PROBLEM。如果是在比赛中的题目，还要进一步细化权限。通过题目id获取题目信息，包括题目标题、描述、创建者、难度、标签、评测方法、时间限制、内存限制、所属领域等。
 * - [未完成]获取题目列表
 *   获取题目列表，需要通过比赛和域来进行筛选，然后再通过分页、搜索进行筛选。应该还要加上一些搜索功能（懒）。排序功能就交给前端完成吧。
 * - [未完成]查询某道题的结果
 *   获取某个用户关于某道题的结果，即未做过、尝试过、已完成，需要根据比赛和域进行区分。
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
    // 获取题目信息，根据指定id返回题目信息
    fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
        const problemRepository = fastify.dataSource.getRepository(Problem);
        const query = problemRepository.createQueryBuilder("problem")
            .leftJoinAndSelect("problem.creator", "user")
            .leftJoinAndSelect("problem.domain", "domain")
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
                "user.tag",
                "domain.id",
                "domain.name"
            ]);
        const problem = await query.where("problem.id = :id", { id: request.params.id }).getOne();
        return problem;
    })

    // 获取题目列表，可以通过分页、搜索和所属域进行筛选
    fastify.get<{ Querystring: { page?: number, pageSize?: number, search?: string, domain?: number } }>('/list', async (request, reply) => {
        const problemRepository = fastify.dataSource.getRepository(Problem);

        const page = request.query.page || 1;
        const pageSize = request.query.pageSize || 25;

        const search = request.query.search;
        const domain = request.query.domain;

        const query = problemRepository.createQueryBuilder("problem")
            .select([
                "problem.id",
                "problem.pid",
                "problem.title",
                "problem.difficulty",
                "problem.tags",
                "problem.judgeMethod"
            ]);

        // 如果指定了搜索关键词，就筛选搜索关键词
        if (search) {
            query.where("problem.title LIKE :search OR problem.tags LIKE :search", { search: `%${search}%` });
        }

        // 如果指定了所属领域，就筛选所属领域
        if (domain !== undefined) {
            query.andWhere("problem.domainId = :domain", { domain });
        }

        query.take(pageSize).skip((page - 1) * pageSize);

        const problems = await query.getMany();
        return problems;
    });
}

export default problemRoutes;