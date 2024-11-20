import express from "express";
import cors from "cors";
import signale from "signale";
import helmet from "helmet";
import dotenv from "dotenv";
import http from "http";
import {setWebsocketServer} from "./Websockets.js";
import cookieParser from "cookie-parser";
import { setMqtt } from "./mqtt.js";
dotenv.config();

import { userRouter } from "./routers/UserRouter.js";
import authRouter from "./auth.js";

import { connectToDatabase } from "./database/connectToDatabase.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.ALLOWED_DOMAIN, "*"],
    credentials: true
}));
app.use(helmet());

app.use("/users", userRouter);
app.use("/auth", authRouter);

const server = http.createServer(app);

const wss = setWebsocketServer(server);
setMqtt(wss);

(await connectToDatabase().then((success) => {
    if (success) server.listen(Number.parseInt(process.env.API_PORT), () => signale.success("server running"));
    else signale.error("server cannot start");
}));