### VTOJ-backend

#### 技术栈

- 语言：TypeScript
- 框架：Fastify、TypeORM

#### 安装

```
yarn
```

```
yarn serve
```

#### 目录结构

- models
  存放TypeORM的Entity实体。不小心把一些常数也放进去了
- routes
  存放路由，再在index.ts导出。实际上，不只是路由，把逻辑啥的都写了
- data
  存放题目的测试数据，可以在config里面修改
- hooks
  fastify的路由钩子，不需要改。onSend是把json的格式套层壳。
- plugins
  fastify注册的插件，放了typeorm插件。
- middlewares
  中间件，权限验证感觉要在这里完成
- utils
- server.ts
  核心程序
- config.json
  核心配置