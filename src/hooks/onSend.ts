// hooks/onSend.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse, successResponse } from "../utils/responseFormatter";

export async function onSend(request: FastifyRequest, reply: FastifyReply, payload: any) {
    if (reply.statusCode >= 200 && reply.statusCode < 300) {
        return JSON.stringify(successResponse(JSON.parse(payload), request.id));
    } else {
        return JSON.stringify(errorResponse(reply.statusCode.toString(), JSON.parse(payload).message, request.id));
    }
}