/**
 * src/hooks/onSend.ts
 * 
 * 这个文件主要是给出响应之前套一层壳。变成想要的ApiResponse格式。
 */

import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse, successResponse } from "../utils/responseFormatter";

export async function onSend(request: FastifyRequest, reply: FastifyReply, payload: any) {
    // 先判断返回是不是json
    const contentType = reply.getHeader('Content-Type');
    if (typeof contentType === 'string' && !contentType.includes('application/json')) {
        return payload;
    }
    let data;
    try {
        data = JSON.parse(payload);
    }
    catch (e) {
        return payload;
    }
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
        return JSON.stringify(successResponse(data, request.id));
    } else {
        return JSON.stringify(errorResponse(reply.statusCode, data.message, request.id));
    }
}