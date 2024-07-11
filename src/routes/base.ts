import { FastifyInstance } from "fastify";
import Config from "../config.json";

async function routes(fastify: FastifyInstance) {
    fastify.get("/settings", async (request, reply) => {
        return {
            website: Config.website,
            ui: Config.ui
        };
    });
}

export default routes;