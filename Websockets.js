import { WebSocketServer } from "ws";
import signale from "signale";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function setWebsocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (socket, req) => {
        signale.info("new client connected to wss");

        /*const cookies = req.headers.cookie;
        const authToken = extractCookieValue(cookies, 'authToken');

        if (!authToken) {
            signale.error("user was not authorized");
            socket.close(1008, JSON.stringify({
                message: "user was not authorized"
            }));
        }*/

        //const user = jwt.decode(authToken, JWT_SECRET); 

        socket.onmessage = async function (event) {
            const parsedData = JSON.parse(event.data);
        }
    });

    return wss;
}

function extractCookieValue(cookieHeader, cookieName) {
    const match = cookieHeader.match(new RegExp(`(?:^|; )${cookieName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}