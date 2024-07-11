/**
 * src/routes/contest.ts
 * 
 * 该文件包含比赛路由。
 * 
 * 主要有以下功能：
 * - [未开始]新增比赛
 *   需要权限MANAGE_CONTEST。这个权限应该根据专门的域来获取。新增比赛，需要提供比赛标题、描述、开始时间、结束时间、是否公开、题目列表、模式、所属域等。
 * - [未开始]修改比赛信息
 *   需要权限MANAGE_CONTEST。这个权限应该根据专门的域来获取，并且如果制定了用户对某个比赛有管理权限，也应该放行。修改比赛信息，可以修改比赛标题、描述、开始时间、结束时间、是否公开、题目列表、模式等，所属域不能更改。
 * - [未开始]删除比赛
 *   需要权限MANAGE_CONTEST。这个权限应该根据专门的域来获取，并且如果制定了用户对某个比赛有管理权限，也应该放行。删除比赛，删除后比赛的所有信息都会被删除。
 * - [未开始]新增比赛权限
 *   需要权限MANAGE_CONTEST。这个权限应该根据专门的域来获取。新增比赛权限，可以增加或减少用户对某个比赛的权限。
 * - [未开始]查看参赛人员
 *   需要权限MANAGE_CONTEST。这个权限应该根据专门的域来获取。查看参赛人员，可以查看参加比赛的人员列表，并进行管理。
 * - [未开始]获取比赛信息
 *   根据需要放行。如果比赛公开那么可以直接看，不公开但是有相关权限也可以直接看。通过比赛id获取比赛信息，包括比赛标题、描述、创建者、开始时间、结束时间、是否公开、题目列表、模式、所属域等。
 * - [未开始]获取比赛题目列表
 *   根据需要放行。参加比赛或者有相关权限可以直接看。通过比赛id获取比赛题目列表。
 * - [未开始]参加比赛
 *   需要登录。通过比赛id参加比赛。报名比赛应该在比赛开始前进行。
 * - [未开始]获取比赛排行榜
 *   根据需要放行。参加比赛或者有相关权限可以直接看，参加比赛的只有比赛开始了才可以看。通过比赛id获取比赛排行榜。
 * - [未开始]获取比赛列表
 *   获取比赛列表，可以通过分页、搜索和所属域进行筛选。应该还要加上一些搜索功能（懒）。排序功能就交给前端完成吧。
 */

import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { Contest, Problem } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

async function problemRoutes(fastify: FastifyInstance) {
    fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
        const contestRepository = fastify.dataSource.getRepository(Contest);
        const query = contestRepository.createQueryBuilder("contest")
            .leftJoinAndSelect("contest.creator", "user")
            .leftJoinAndSelect("contest.domain", "domain")
            .select([
                "contest.id",
                "contest.name",
                "contest.description",
                "contest.creator",
                "contest.isPublic",
                "contest.problemList",
                "contest.mode",
                "contest.createTime",
                "contest.lastModifyTime",
                "user.id",
                "user.username",
                "user.rating",
                "user.tag",
                "domain.id",
                "domain.name"
            ]);
        const contest = await query.where("contest.id = :id", { id: request.params.id }).getOne();
        return contest;
    })

    fastify.get<{ Querystring: { page?: number, pageSize?: number, search?: string, domain?: number } }>('/list', async (request, reply) => {
        const contestRepository = fastify.dataSource.getRepository(Contest);
        const page = request.query.page || 1;
        const pageSize = request.query.pageSize || 25;
        const search = request.query.search;

        const query = contestRepository.createQueryBuilder("contest")
            .select([
                "contest.id",
                "contest.title",
                "contest.isPublic",
                "contest.mode",
                "contest.startTime",
                "contest.endTime"
            ])
            .where("contest.isPublic = :isPublic", { isPublic: true });

        if (search) {
            query.where("contest.title LIKE :search", { search: `%${search}%` })
        }

        query.take(pageSize).skip((page - 1) * pageSize);

        const problems = await query.getMany();
        return problems;
    });
}

export default problemRoutes;