import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import logger from "./utils/logger";

import socket from "./socket";

const port = (process.env.PORT ||  4000) as number; 
const corsOrigin = (process.env.CORS_ORIGIN || '*') as string;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true, 
    },
});

app.get("/", (_, res) => res.send("Server is up and running"));

httpServer.listen(port, () => {
    logger.info("Server listing at port %s", port);

    socket({ io });
});
