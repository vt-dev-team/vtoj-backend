/**
 * 
 */

import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { Announcement } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";
import { request } from "http";

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

async function announcementRoutes(fastify: FastifyInstance) {
    // 获取公告详情
    fastify.get<{ Params: { id: number } }>("/:id", async (request, reply) => {
        const announcementRepository = fastify.dataSource.getRepository(Announcement);
        const announcement = await announcementRepository.findOne({
            where: { id: request.params.id },
            relations: ["domain", "creator"],
            select: {
                id: true,
                title: true,
                content: true,
                createTime: true,
                lastModifyTime: true,
                creator: {
                    id: true,
                    username: true,
                    rating: true,
                    tag: true
                },
                domain: {
                    id: true,
                    name: true
                }
            }
        });
        if (!announcement) {
            return reply.code(404).send({ message: "没有该公告" });
        }
        return announcement;
    });
    // 获取公告列表
    fastify.get<{ Querystring: { page?: number, pageSize?: number, Domain?: number } }>("/list", async (request, reply) => {
        const page = request.query.page || 1;
        const pageSize = request.query.pageSize || 10;
        const domain = request.query.Domain;

        const announcementRepository = fastify.dataSource.getRepository(Announcement);
        const query = announcementRepository.createQueryBuilder("announcement")
            .leftJoinAndSelect("announcement.creator", "user")
            .select([
                "announcement.id",
                "announcement.title",
                "announcement.lastModifyTime",
                "user.id",
                "user.username",
                "user.rating",
                "user.tag"
            ]);

        if (domain) {
            query.where("announcement.domain = :domain", { domain });
        }

        const totalRecords = await query.getCount();
        const totalPages = Math.ceil(totalRecords / pageSize);
        const announcements = await query.skip((page - 1) * pageSize).take(pageSize).getMany();
        return {
            announcements,
            totalPages,
            currentPage: page,
            pageSize: pageSize,
            totalRecords
        };
    })
}

export default announcementRoutes;