/**
 * src/routes/user.ts
 * 
 * 该文件包含用户路由。
 */

import { FastifyInstance } from "fastify";
import { DataSource } from "typeorm";
import { User } from "../models";
import { authenticateSession } from "../middlewares/authMiddleware";

import bcrypt from 'bcrypt';

declare module 'fastify' {
    interface FastifyInstance {
        dataSource: DataSource;
    }
}

interface LoginBody {
    auth: string;
    password: string;
}

interface RegisterBody {
    username: string;
    password: string;
    rptPassword: string;
    email: string;
    phone: string;
    realName?: string;
    studentId?: string;
}

async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/list', { preHandler: [authenticateSession] }, async (request, reply) => {
        const userRepository = fastify.dataSource.getRepository(User);
        const users = await userRepository.find();
        return users;
    });

    fastify.get('/me', async (request, reply) => {
        const user = request.session.get<any>('user');
        if (!user) {
            return {
                login: false
            }
        }
        else {
            return {
                login: true,
                user
            }
        }
    });

    fastify.post('/logout', async (request, reply) => {
        request.session.destroy();
        return { message: '已退出登录' };
    });

    // 登录
    fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
        const { auth, password } = request.body;
        // 检查auth是否为某个用户的用户名、邮箱或手机号
        const userRepository = fastify.dataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: [
                { username: auth },
                { email: auth },
                { phone: auth }
            ]
        });
        if (!user) {
            return reply.code(401).send({ message: '账号或密码错误' });
        }
        // 检查密码是否正确
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return reply.code(401).send({ message: '账号或密码错误' });
        }

        // 登录成功，设置session
        request.session.set<any>('user', {
            id: user.id,
            username: user.username,
            privilege: user.privilege
        });

        return {
            id: user.id,
            username: user.username,
            privilege: user.privilege
        }
    });

    // 注册
    fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
        const { username, password, email, phone, realName, studentId } = request.body;

        const userRepository = fastify.dataSource.getRepository(User);
        // 判断是否由重复的用户名，邮箱或手机号
        const user = await userRepository.findOne({
            where: [
                { username },
                { email },
                { phone }
            ]
        });
        if (user) {
            return reply.code(400).send({ message: '用户名、邮箱或手机号已被注册' })
        }

        // 给密码加密
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = userRepository.create({
                username,
                password: hashedPassword,
                email,
                phone,
                realName,
                studentId
            });
            await userRepository.save(user);
            // 注册后需要把用户信息存入session
            request.session.set<any>('user', {
                id: user.id,
                username: user.username,
                privilege: user.privilege
            })
            return {
                id: user.id,
                username: user.username,
                privilege: user.privilege
            }
        }
        catch (e) {
            return reply.code(500).send({ message: '服务器错误，请稍后再试' });
        }
    })
}

export default userRoutes;