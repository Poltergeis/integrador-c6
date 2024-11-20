import { WebSocketServer } from "ws";
import signale from "signale";
import mqtt from "mqtt";

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

        client.subscribe(process.env.TOPIC_DISTANCIA, (err, message) => {
            if (err) {
                signale.error(err);
            }
        });

        client.subscribe(process.env.TOPIC_TOQUE, (err, message) => {
            if (err) {
                signale.error(err);
            }
        });

        client.subscribe("message/event", (err, message) => {
            if (err) {
                signale.error(err);
            }
        });

        client.on('message', (topic, payload) => {
            const parsedData = JSON.parse(payload.toString());
            signale.success(parsedData + " recibido de mqtt");
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({ message: "vales para pura verga python", topic, parsedData }));
            });
        });

    } catch (error) {
        signale.error(`error setting mqtt connection.\n${error.message}`);
    }
}