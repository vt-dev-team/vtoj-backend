export function successResponse(data: any, requestId?: string) {
    return {
        status: 'success',
        data,
        meta: {
            timestamp: new Date().toISOString(),
            requestId,
        },
    };
}

export function errorResponse(code: string, message: string, requestId?: string) {
    return {
        status: 'error',
        error: {
            code,
            message,
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId,
        },
    };
}
