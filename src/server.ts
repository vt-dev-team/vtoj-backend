import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import "reflect-metadata"
import typeorm from './plugins/typeorm';
import { User, Problem, Submission, Domain, Contest } from './models';

import { db, server } from "./config.json";

import { randomBytes } from 'crypto';
import routes from './routes';
import { onSend } from './hooks/onSend';

const app = Fastify({
    logger: true
});

// Register the typeorm plugin with the database configuration
app.register(typeorm, {
    ...db,
    entities: [User, Problem, Submission, Domain, Contest],
    synchronize: true
});

// Register cookie and session plugins
app.register(fastifyCookie);
app.register(fastifySession, {
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    saveUninitialized: false
});

app.addHook('onSend', onSend);

// Register routes with the /api prefix
app.register(routes, { prefix: "/api" });

// Run the server!
app.listen(server, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }

    console.log("VegeTable Online Judge");
    console.log(`Server listening at ${address}`)
});