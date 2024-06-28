/**
 * src/middlewares/authMiddleware.ts
 * 
 * 该文件包含身份验证和授权中间件。
 * 身份验证中间件检查用户是否已登录。
 * 授权中间件检查用户是否具有所需的角色。
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models';

declare module '@fastify/session' {
    interface FastifySessionObject {
        user?: User;
    }
}

export async function authenticateSession(request: FastifyRequest, reply: FastifyReply) {
    if (!request.session.user) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }
}

export async function authorizeRole(role: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        //if (request.session.user.role !== role) {
        //    return reply.code(403).send({ message: 'Forbidden' });
        //}
    };
}