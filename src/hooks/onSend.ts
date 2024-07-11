/**
 * src/hooks/onSend.ts
 * 
 * 这个文件主要是给出响应之前套一层壳。变成想要的ApiResponse格式。
 */

import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse, successResponse } from "../utils/responseFormatter";

export async function onSend(request: FastifyRequest, reply: FastifyReply, payload: any) {
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
        return JSON.stringify(successResponse(JSON.parse(payload), request.id));
    } else {
        return JSON.stringify(errorResponse(reply.statusCode, JSON.parse(payload).message, request.id));
    }
}