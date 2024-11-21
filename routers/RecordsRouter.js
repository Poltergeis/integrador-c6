import { Router } from "express";
import { validateToken } from "./middlewares.js";
import statisticController from "../controllers/statisticController.js";
import ToqueModel from "../models/Toques.js";
import DistanciaModel from "../models/Distancias.js";
import TempModel from "../models/Temperatura.js";
import BPMModel from "../models/BPM.js";

export const recordsRouter = Router();

const postRoutes = [
    { path: "/temperatura", handler: statisticController.insertTemperatura },
    { path: "/bpm", handler: statisticController.insertBpm },
    { path: "/distancias", handler: statisticController.insertDistancia },
    { path: "/toque", handler: statisticController.insertToque }
];
//valueFieldName es "toque", "bpm", "distancia" o "temperatura"
const getRoutes = [
    { path: "/prom/dia/toque", handler: async(req, res) => await statisticController.searchPerDay(req, res, ToqueModel, "toque") },
    { path: "/prom/semana/toque", handler: async(req, res) => await statisticController.searchPerWeek(req, res, ToqueModel, "toque") },
    { path: "/prom/mes/toque", handler: async(req, res) => await statisticController.searchPerMonth(req, res, ToqueModel, "toque") },

    { path: "/prom/dia/bpm", handler: async(req, res) => await statisticController.searchPerDay(req, res, BPMModel, "bpm") },
    { path: "/prom/semana/bpm", handler: async(req, res) => await statisticController.searchPerWeek(req, res, BPMModel, "bpm") },
    { path: "/prom/mes/bpm", handler: async(req, res) => await statisticController.searchPerMonth(req, res, BPMModel, "bpm") },

    { path: "/prom/dia/distancia", handler: async(req, res) => await statisticController.searchPerDay(req, res, DistanciaModel, "distancia") },
    { path: "/prom/semana/distancia", handler: async(req, res) => await statisticController.searchPerWeek(req, res, DistanciaModel, "distancia") },
    { path: "/prom/mes/distancia", handler: async(req, res) => await statisticController.searchPerMonth(req, res, DistanciaModel, "distancia") },

    { path: "/prom/dia/temperatura", handler: async(req, res) => await statisticController.searchPerDay(req, res, TempModel, "temperatura") },
    { path: "/prom/semana/temperatura", handler: async(req, res) => await statisticController.searchPerWeek(req, res, TempModel, "temperatura") },
    { path: "/prom/mes/temperatura", handler: async(req, res) => await statisticController.searchPerMonth(req, res, TempModel, "temperatura") }
];


postRoutes.forEach(route => {
    recordsRouter.post(route.path, validateToken, route.handler);
});

getRoutes.forEach(route => {
    recordsRouter.get(route.path, validateToken, route.handler)
});