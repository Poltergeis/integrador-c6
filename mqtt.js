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
    const client = await mqtt.connectAsync(process.env.MQTT_BROKER, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    });
    signale.success("connected to mqtt");

    client.on("connect", (event) => {
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

    client.on("message", async (topic, payload) => {
      try {
        const parsedData = JSON.parse(payload.toString());
        signale.success(
          parsedData.Event + ": " + parsedData.valor + " recibido de mqtt"
        );

        wss.clients.forEach((client) => {
          client.send(JSON.stringify({ topic, parsedData }));
        });
      } catch (error) {
        signale.error(error);
      }
    });
  } catch (error) {
    signale.error(`error setting mqtt connection.\n${error.message}`);
  }
}
