/**
 * src/routes/submission.ts
 * 
 * 该文件包含跟提交记录相关的路由。但是我觉得有些路由可能用Websocket更好，但是因为技术原因，先不加了。
 * 
 * 提醒：关于具体的提交记录权限，不同的域、不同的比赛应该严格加以区分，不要忘了。
 * 
 * 主要有以下功能：
 * - [未开始]修改提交记录
 *   需要有MANAGE_SUBMISSION权限。主要是评测鸡或者手动评测，给某条记录修改状态。
 * - [未开始]提交代码
 *   需要有SUBMIT_PROBLEM权限。比赛中也要看比赛的设定。给某道题提交代码。
 * - [未开始]查看某个提交记录
 *   首先，如果是比赛中的，就要看比赛的设定了。如果是自己的当然可以直接看。否则，要有VIEW_OTHERS_CODE权限。错误信息啥的我觉得应该也多弄一个权限，但是懒。
 * - [未开始]查看提交记录列表
 *   查看所有的提交记录，需要有分页，不同的比赛和域应该加以区分，并且可以通过提交者、语言、结果、得分、提交时间来查询。评测鸡就直接用这个查询就好了。
 */

import { FastifyInstance } from "fastify";
import { Privilege } from "../models/Privilege";
import { Problem, Submission, User } from "../models";

interface UpdateSubmissionBody {
    result: number;
    score: number;
    info: string;
}

interface SubmitBody {
    language: number;
    problem: number;
    code: string;
    // Contest
    contest?: number;
}

interface SubmissionListParam {
    score?: [number, number] | number;
    result?: number;
    submitter?: number;
    language?: number;

    domain?: number;
    contest?: number;

    page?: number;
    pageSize?: number;
}

async function submissionRoutes(fastify: FastifyInstance) {
    // 更新提交记录信息，也是给评测机用
    fastify.post<{ Params: { id: number }, Body: UpdateSubmissionBody }>('/update/:id', async (request, reply) => {
        // 判定权限
        const loginUser = request.session.get<any>('user');
        if (!loginUser) {
            // 理论上游客也是有一个权限，也应该判断这个权限而不是直接返回401，但是这里先不管了，TODO
            return reply.code(401).send({ message: '未登录' });
        }
        const UserRepository = fastify.dataSource.getRepository(User);
        const user = await UserRepository.findOneBy({ id: loginUser.id });
        if (!user) {
            return reply.code(401).send({ message: '未登录' });
        }
        if (!(user.privilege & Privilege.MANAGE_SUBMISSION)) {
            return reply.code(403).send({ message: '没有修改权限' })
        }
        // 更新记录
        const SubmissionRepository = fastify.dataSource.getRepository(Submission);
        const submission = await SubmissionRepository.findOne({
            where: { id: request.params.id }
        });
        if (!submission) {
            return reply.code(404).send({ message: '没有该条记录' })
        }
        try {
            submission.result = request.body.result;
            submission.score = request.body.score;
            submission.info = request.body.info;
            submission.judgeMachine = user.username;
            return { ok: true };
        }
        catch (e) {
            return reply.code(500).send({ message: '服务器错误' })
        }
    })
    // 获取最老的一个没有被评测的提交记录，给评测机用
    fastify.get('/needJudge', async (request, reply) => {
        // 理论上这里也要加个权限，反正也没什么隐私，暂时就不加了。TODO
        const SubmissionRepository = fastify.dataSource.getRepository(Submission);
        const submission = await SubmissionRepository.findOne({
            where: { result: 0 },
            relations: ['problem'],
            select: {
                id: true,
                codeText: true,
                language: true,
                problem: {
                    id: true
                }
            },
            order: {
                id: "ASC"
            }
        });
        return submission;
    });
    // 查询提交记录列表
    fastify.get<{ Querystring: SubmissionListParam }>('/list', async (request, reply) => {
        // 提取分页参数，默认值为1和20
        const page = request.query.page || 1;
        const pageSize = request.query.pageSize || 20;

        const SubmissionRepository = fastify.dataSource.getRepository(Submission);

        // 构建查询条件
        const query: any = {};
        if (request.query.domain) {
            query.domain = request.query.domain;
        }
        if (request.query.contest) {
            query.contest = request.query.contest;
        }
        if (request.query.score) {
            if (Array.isArray(request.query.score)) {
                query.score = request.query.score;
            } else {
                query.score = request.query.score;
            }
        }
        if (request.query.result) {
            query.result = request.query.result;
        }
        if (request.query.submitter) {
            query.submitter = request.query.submitter;
        }
        if (request.query.language) {
            query.language = request.query.language;
        }

        // 查询总记录数
        const totalRecords = await SubmissionRepository.count({ where: query });

        // 计算总页数
        const totalPages = Math.ceil(totalRecords / pageSize);

        // 查询分页数据
        const submissions = await SubmissionRepository.find({
            where: query,
            relations: ['submitter', 'problem'],
            select: {
                id: true,
                submitter: {
                    id: true,
                    username: true,
                    rating: true,
                    tag: true
                },
                problem: {
                    id: true,
                    pid: true,
                    title: true
                },
                result: true,
                timeCost: true,
                memoryCost: true,
                score: true,
                submitTime: true,
                judgeTime: true,
                judgeMachine: true
            },
            order: {
                id: "DESC"
            },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        // 返回结果，包括分页信息
        return {
            submissions,
            totalPages,
            currentPage: page,
            pageSize,
            totalRecords
        };
    });
    // 查询提交记录
    fastify.get<{ Params: { id: number } }>('/:id', async (request, reply) => {
        const loginUser = request.session.get<any>('user');
        if (!loginUser) {
            // 理论上游客也是有一个权限，也应该判断这个权限而不是直接返回401，但是这里先不管了，TODO
            return reply.code(401).send({ message: '未登录' });
        }
        const UserRepository = fastify.dataSource.getRepository(User);
        const user = await UserRepository.findOneBy({ id: loginUser.id });
        if (!user) {
            return reply.code(401).send({ message: '未登录' });
        }
        const SubmissionRepository = fastify.dataSource.getRepository(Submission);
        const submission = await SubmissionRepository.findOne({
            where: { id: request.params.id },
            relations: ['submitter', 'problem', 'contest', 'domain'],
            select: {
                id: true,
                codeText: true,
                language: true,
                result: true,
                score: true,
                info: true,
                submitTime: true,
                timeCost: true,
                memoryCost: true,
                judgeTime: true,
                judgeMachine: true,
                contest: {
                    id: true,
                    title: true,
                    mode: true,
                    startTime: true,
                    endTime: true
                },
                domain: {
                    id: true,
                    name: true
                },
                submitter: {
                    id: true,
                    username: true,
                    rating: true,
                    tag: true
                },
                problem: {
                    id: true,
                    pid: true,
                    title: true
                }
            }
        });
        // 首先检查是否在比赛
        // TODO
        // 然后检查是否为自己的的代码
        if (submission.submitter.id !== user.id && !(user.privilege & Privilege.VIEW_OTHERS_CODE)) {
            // 没有权限
            return reply.code(403).send({ message: '无权限查看他人的代码' });
        }

        return submission;
    });
    // 提交代码
    fastify.post<{ Body: SubmitBody }>('/submit', async (request, reply) => {
        // 首先检查提交权限
        // 检查是否登录
        const loginUser = request.session.get<any>('user');
        if (!loginUser) {
            // 理论上游客也是有一个权限，也应该判断这个权限而不是直接返回401，但是这里先不管了，TODO
            return reply.code(401).send({ message: '未登录' });
        }
        const UserRepository = fastify.dataSource.getRepository(User);
        const user = await UserRepository.findOneBy({ id: loginUser.id });
        if (!user) {
            return reply.code(401).send({ message: '未登录' });
        }
        // 检查题目是否存在
        const ProblemRepository = fastify.dataSource.getRepository(Problem);
        const problem = await ProblemRepository.findOne({
            where: { id: request.body.problem },
            relations: ['domain']
        });
        if (!problem) {
            return reply.code(404).send({ message: '题目不存在' });
        }
        // 如果题目不可用，并且不是管理员，就不能提交。这里管理员权限还没有判断，TODO
        if (!problem.available) {
            return reply.code(403).send({ message: '题目不可用' });
        }

        // 如果在比赛中，就要看有没有参加比赛
        if (request.body.contest) {
            // 检查是否有参加比赛
            // 检查是否有提交权限

            // TODO
        }
        // 否则，看是否有相应的提交权限
        else {
            if (!(user.privilege & Privilege.SUBMIT_PROBLEM)) {
                // 无权限
                return reply.code(403).send({ message: '用户无权限提交题目' });
            }
        }

        // 提交代码
        try {
            const SubmissionRepository = fastify.dataSource.getRepository(Submission);
            const submission = SubmissionRepository.create({
                submitter: user,
                codeText: request.body.code,
                language: request.body.language,
                problem: problem,
                domain: problem.domain ? problem.domain : null
            });
            await SubmissionRepository.save(submission);

            return { id: submission.id };
        }
        catch (e) {
            console.error(e);
            return reply.code(500).send({ message: e.message });
        }
    })
}

export default submissionRoutes;