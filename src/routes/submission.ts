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


async function submissionRoutes(fastify: FastifyInstance) {
}

export default submissionRoutes;