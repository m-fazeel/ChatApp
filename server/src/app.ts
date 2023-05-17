import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import config from "config";
import logger from "./utils/logger";

import socket from "./socket";

const port = config.get("port") as number;
const host = config.get("host") as string;
const corsOrigin = config.get("corsOrigin") as string;

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: config.get("corsOrigin"),
        credentials: true, 
    },
});

app.get("/", (_, res) => res.send("Server is up and running"));

httpServer.listen(port, host, () => {
    logger.info("Server listing at http://%s:%s", host, port);

    socket({ io });
}
);

