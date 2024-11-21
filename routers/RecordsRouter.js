import { Router } from "express";
import { validateToken } from "./middlewares.js";
import statisticController from "../controllers/statisticController.js";

export const recordsRouter = Router();

recordsRouter.post("/temperatura", validateToken, statisticController.insertTemperatura);

recordsRouter.post("/bpm", validateToken, statisticController.insertBpm);

recordsRouter.post("/distancias", validateToken, statisticController.insertDistancia);

recordsRouter.post("/toque", validateToken, statisticController.insertToque);