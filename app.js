import express from "express";
import cors from "cors";
import signale from "signale";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import { userRouter } from "./routers/UserRouter.js";

import { connectToDatabase } from "./database/connectToDatabase.js";

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['*']
}));
app.use(helmet());

app.use("/users", userRouter);

(await connectToDatabase().then((success) => {
    if (success) app.listen(9000, () => signale.success("server running"));
    else signale.error("server cannot start");
}));