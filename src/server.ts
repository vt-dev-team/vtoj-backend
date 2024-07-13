import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import "reflect-metadata"
import typeorm from './plugins/typeorm';
import { Announcement, User, Problem, Submission, Domain, Contest, ChooseProblem } from './models';

import { db, server } from "./config.json";

import { randomBytes } from 'crypto';
import routes from './routes';
import { onSend } from './hooks/onSend';

const app = Fastify({
    logger: process.env.NODE_ENV !== 'production'
});

// 注册TypeORM的插件，数据库的设置在config.json中配置
app.register(typeorm, {
    ...db,
    entities: [Announcement, User, Problem, ChooseProblem, Submission, Domain, Contest],
    synchronize: true
});

// 注册Cookie和Session插件
app.register(fastifyCookie);
app.register(fastifySession, {
    // 生成一个随机的session secret，理论上还是弄一个环境变量比较好
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    saveUninitialized: false
});

// 注册onSend钩子，会把json数据转成ResponseFormatter设定的格式
app.addHook('onSend', onSend);

// 注册路由，所有的路由都在routes文件夹中，并加上前缀/api
app.register(routes, { prefix: "/api" });

// 启动服务器
app.listen(server, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }

    console.log("VegeTable Online Judge");
    console.log(`Server listening at ${address}`)
});