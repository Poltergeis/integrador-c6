import signale from "signale";
import TempModel from "../models/Temperatura.js";
import BPMModel from "../models/BPM.js";
import DistanciaModel from "../models/Distancias.js";
import ToqueModel from "../models/Toques.js";

async function insertTemperatura(req, res) {
    return await insertRecord(req, res, TempModel, "temperatura");
}

async function insertBpm(req, res) {
    return await insertRecord(req, res, BPMModel, "bpm");
}

async function insertDistancia(req, res) {
    return await insertRecord(req,res, DistanciaModel, "distancia")
}

async function insertToque(req, res) {
    return await insertRecord(req, res, ToqueModel, "toque");
}

async function insertRecord(req, res, TypeModel, fieldname) {
    try {
        const { valor } = req.body;

        if (valor === undefined || valor === null) {
            signale.info("Petición incompleta: falta el valor");
            return res.status(400).json({
                success: false,
                message: "El valor no fue encontrado",
            });
        }

        const safeValor = parseFloat(valor);
        if (isNaN(safeValor)) {
            signale.info("Petición de inserción con valor inválido");
            return res.status(400).json({
                success: false,
                message: "El valor proporcionado no es válido",
            });
        }

        const newRecord = await TypeModel.create({
            [fieldname]: safeValor,
            fecha: new Date().getHours()
        });

        if (!newRecord) {
            return res.status(400).json({
                success: false,
                message: "No se pudo guardar el nuevo registro",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Registro guardado exitosamente",
        });
    } catch (error) {
        signale.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const statisticController = {
    insertTemperatura,
    insertBpm, insertDistancia, insertToque
};

export default statisticController;
