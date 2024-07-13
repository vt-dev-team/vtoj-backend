import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { Contest, Problem } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";
import { request } from "http";

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

async function domainRoutes(fastify: FastifyInstance) {
}

export default domainRoutes;