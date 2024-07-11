/**
 * src/routes/user.ts
 * 
 * 该文件包含用户路由。
 * 
 * 主要有以下功能：
 * 以下是需要有特定权限的功能：
 * - [未完成]获取用户列表
 *   需要有MANAGE_USER或MANAGE_PRIVILEGE权限，获取所有用户信息，方便管理。目前还没加分页和搜索功能。
 * - [未开始]修改某个用户的信息
 *   需要有MANAGE_USER权限，可以修改用户的信息，包括用户名、密码、邮箱、手机号、真实姓名和学号。
 * - [未开始]删除某个用户
 *   需要有MANAGE_USER权限，可以删除某个用户，删除后用户的所有信息都会被删除。
 * - [未开始]添加用户
 *   需要有MANAGE_USER权限，可以添加新用户，需要提供用户名、密码、邮箱和手机号，这个应该和注册功能合并。
 * - [未开始]修改某个用户的权限
 *   需要有MANAGE_PRIVILEGE权限，可以修改某个用户的权限，可以增加或减少用户的权限。
 * 以下是需要登录才可以操作的功能：
 * - [未开始]修改当前用户的信息
 *   其实这个可以和管理的信息进行合并
 * - [已完成]完成退出登录
 *   销毁session，退出登录
 * 以下是不需要登录就可以操作的功能：
 * - [已完成]获取当前登录用户信息
 *   如果用户已登录，返回用户信息，否则返回未登录状态。
 * - [已完成]获取指定用户信息
 *   通过用户id获取用户信息，主要用于获取其他用户的信息。
 * - [已完成]登录
 *   通过用户名、邮箱或手机号和密码登录。密码在前端需要进行100轮SHA256的hash
 * - [已完成]注册
 *   注册新用户，需要提供用户名、密码、邮箱和手机号。密码在前端需要进行100轮SHA256的hash
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

// 登录请求体
interface LoginBody {
    auth: string;
    password: string;
}

// 注册请求体
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
    // 获取用户列表，权限验证还未完成
    fastify.get('/list', { preHandler: [authenticateSession] }, async (request, reply) => {
        const userRepository = fastify.dataSource.getRepository(User);
        const users = await userRepository.find();
        return users;
    });

    // 获取当前登录用户信息
    fastify.get('/me', async (request, reply) => {
        const user = request.session.get<any>('user');
        // 如果用户未登录，返回login: false
        // 实际上，未登录应该也得返回一个权限，这个权限在settings中设置，然后在最开始获取设置的地方返回。
        // 其实我感觉未登录可以返回一个叫做guest的用户。
        if (!user) {
            return {
                login: false
            }
        }
        // 如果用户已登录，返回login: true和用户信息
        else {
            return {
                login: true,
                user
            }
        }
    });

    // 获取指定用户信息
    fastify.get<{ Querystring: { id: number } }>('/:id', async (request, reply) => {
        const userRepository = fastify.dataSource.getRepository(User);
        const query = userRepository.createQueryBuilder("user")
            .select([
                "user.id",
                "user.username",
                "user.signature"
            ]);
        const user = await query.where("user.id = :id", { id: request.query.id }).getOne();
        return user;
    })

    // 退出登录
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
        // 如果用户不存在
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