import { WebSocketServer } from "ws";
import signale from "signale";
import mqtt from "mqtt";
import ToqueModel from "./models/Toques.js";
import DistanciaModel from "./models/Distancias.js";
import TempModel from "./models/Temperatura.js";
import BPMModel from "./models/BPM.js";

/**
 * @param {WebSocketServer} wss 
 */
export async function setMqtt(wss) {
    try {
        const client = await mqtt.connectAsync(process.env.MQTT_URL, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        });
        signale.success("connected to mqtt");

        client.on('connect', (event) => {
            signale.info("connection to mqtt");
        });

        client.subscribe(process.env.TOPIC_DISTANCIA, (err, a) => {
            if (err) {
                signale.error(err);
            }
        });

        client.subscribe(process.env.TOPIC_TOQUE, (err, a) => {
            if (err) {
                signale.error(err);
            }
        });

        client.subscribe(process.env.TOPIC_TEMPERATURA, (err, a) => {
            if (err) {
                signale.error(err);
            }
        });

        client.subscribe(process.env.TOPIC_BPM, (err, a) => {
            if (err) {
                signale.error(err);
            }
        });

        

        client.subscribe("message/event", (err, a) => {
            if (err) {
                signale.error(err);
            }
        });

        client.on('message', async (topic, payload) => {
            const parsedData = JSON.parse(payload.toString());
            signale.success(parsedData + " recibido de mqtt");
            switch (topic) {
                case process.env.TOPIC_DISTANCIA:
                    await DistanciaModel.create({
                        distancia: parsedData.valor, fecha: new Date().toLocaleTimeString()
                    });
                
                case process.env.TOPIC_TOQUE:
                    await ToqueModel.create({
                        toque: parsedData.valor, fecha: new Date().toLocaleTimeString()
                    });

                case process.env.TOPIC_BPM:
                    await BPMModel.create({
                        bpm: parsedData.valor, fecha: new Date().toLocaleTimeString()
                    });

                case process.env.TOPIC_TEMPERATURA:
                    await TempModel.create({
                        temperatura: parsedData.valor, fecha: new Date().toLocaleTimeString()
                    });
            }
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({ topic, parsedData }));
            });
        });

    } catch (error) {
        signale.error(`error setting mqtt connection.\n${error.message}`);
    }
}