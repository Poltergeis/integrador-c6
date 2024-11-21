import signale from "signale";
import TempModel from "../models/Temperatura.js";
import BPMModel from "../models/BPM.js";
import DistanciaModel from "../models/Distancias.js";
import ToqueModel from "../models/Toques.js";
import { Op } from "sequelize";
import sequelize from "../database/connectToDatabase.js";

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
        // Obtener la fecha actual
        const now = new Date();
        const newRecord = await TypeModel.create({
            [fieldname]: safeValor,
            fecha: now
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

async function searchPerMonth(req, res, TypeModel, valueFieldName) {
    try {
        const lastRecord = await TypeModel.findOne({
            order: [["fecha", "DESC"]]
        });

        if (!lastRecord) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron datos"
            });
        }

        const lastMonth = new Date(lastRecord.fecha).getMonth(); // Mes (0-11)
        const lastYear = new Date(lastRecord.fecha).getFullYear(); // Año

        // Buscar registros del mes actual
        const currentMonthRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("MONTH", sequelize.col("fecha")),
                lastMonth + 1 // Mes en formato (1-12)
            ),
            include: [
                {
                    model: TypeModel,
                    where: sequelize.where(sequelize.fn("YEAR", sequelize.col("fecha")), lastYear),
                },
            ],
        });

        // Buscar registros del mes anterior
        const prevMonthRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("MONTH", sequelize.col("fecha")),
                lastMonth
            ),
            include: [
                {
                    model: TypeModel,
                    where: sequelize.where(sequelize.fn("YEAR", sequelize.col("fecha")), lastYear),
                },
            ],
        });

        // Calcular las medias
        const promActual = calculateMean(currentMonthRecords, valueFieldName);
        const promAnterior = calculateMean(prevMonthRecords, valueFieldName);

        // Obtener nombres de los meses
        const currentMonthName = new Date(lastRecord.fecha).toLocaleString('default', { month: 'long' });
        const prevMonthName = new Date(new Date(lastRecord.fecha).setMonth(lastMonth - 1)).toLocaleString('default', { month: 'long' });

        return res.status(200).json({
            fechaActual: currentMonthName,
            fechaAnterior: prevMonthName,
            promActual,
            promAnterior
        });
    } catch (error) {
        signale.error(error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error
        });
    }
}


async function searchPerDay(req, res, TypeModel, valueFieldName) {
    try {
        const lastRecord = await TypeModel.findOne({
            order: [["fecha", "DESC"]]
        });

        if (!lastRecord) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron datos"
            });
        }

        const lastDate = new Date(lastRecord.fecha);

        // Buscar registros del día actual
        const currentDayRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("fecha")),
                sequelize.fn("DATE", lastDate)
            )
        });

        // Buscar registros del día anterior
        const prevDayRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("DATE", sequelize.col("fecha")),
                sequelize.fn("DATE", new Date(lastDate.setDate(lastDate.getDate() - 1)))
            )
        });

        // Calcular las medias
        const promActual = calculateMean(currentDayRecords, valueFieldName);
        const promAnterior = calculateMean(prevDayRecords, valueFieldName);

        return res.status(200).json({
            fechaActual: `${lastDate.getDate()}-${lastDate.getMonth() + 1}-${lastDate.getFullYear()}`,
            fechaAnterior: `${prevDayRecords[0].fecha.getDate()}-${prevDayRecords[0].fecha.getMonth() + 1}-${prevDayRecords[0].fecha.getFullYear()}`,
            promActual,
            promAnterior
        });
    } catch (error) {
        signale.error(error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error
        });
    }
}

async function searchPerWeek(req, res, TypeModel, valueFieldName) {
    try {
        const lastRecord = await TypeModel.findOne({
            order: [["fecha", "DESC"]]
        });

        if (!lastRecord) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron datos"
            });
        }

        const lastDate = new Date(lastRecord.fecha);
        const currentMonth = lastDate.getMonth(); // Mes actual (0-11)
        const currentYear = lastDate.getFullYear(); // Año actual

        // Función para obtener la semana del mes
        function getWeekOfMonth(date) {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const dayOfMonth = date.getDate();
            return Math.ceil((dayOfMonth + startOfMonth.getDay()) / 7);
        }

        // Obtener la semana actual y la semana anterior
        const currentWeek = getWeekOfMonth(lastDate); // Semana del mes actual
        const prevDate = new Date(lastDate);
        prevDate.setDate(lastDate.getDate() - 7); // Restar 7 días para obtener el día de la semana anterior
        const prevWeek = getWeekOfMonth(prevDate); // Semana del mes anterior

        // Buscar registros de la semana actual
        const currentWeekRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("WEEK", sequelize.col("fecha")),
                currentWeek
            )
        });

        // Buscar registros de la semana anterior
        const prevWeekRecords = await TypeModel.findAll({
            where: sequelize.where(
                sequelize.fn("WEEK", sequelize.col("fecha")),
                prevWeek
            )
        });

        // Calcular las medias
        const promActual = calculateMean(currentWeekRecords, valueFieldName);
        const promAnterior = calculateMean(prevWeekRecords, valueFieldName);

        return res.status(200).json({
            fechaActual: `semana ${currentWeek}`,
            fechaAnterior: `semana ${prevWeek}`,
            promActual,
            promAnterior
        });
    } catch (error) {
        signale.error(error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error
        });
    }
}


function getWeekNumber(date) {
    const startDate = new Date(date.getFullYear(), 0, 1); // Primer día del año
    const diff = date - startDate;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return Math.ceil((dayOfYear + 1) / 7); // Semana número
}



function calculateMean(records, valueFieldName) {
    if (!records || records.length === 0) {
        return 0;
    }
    const sum = records.reduce((acc, record) => acc + record[valueFieldName], 0);
    return sum / records.length;
}


/** 
 * @returns { Promise<[object] | object> }
 */
async function getFromDatabase(TypeModel, searchParams = {}) {
    try {
        const hasSearchParams = Object.keys(searchParams).length > 0;

        if (!hasSearchParams) {
            return await TypeModel.findAll();
        } else {
            return await TypeModel.findOne({ where: searchParams });
        }
    } catch (error) {
        signale.error(error);
        throw new Error("Error al obtener datos de la base de datos");
    }
}


const statisticController = {
    insertTemperatura,
    insertBpm, insertDistancia, insertToque,
    searchPerDay, searchPerMonth, searchPerWeek
};

export default statisticController;
