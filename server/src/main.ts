import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { GameEventType } from "../../shared/enums";
import { GameRunner } from "./Game";
import { SERVER_PORT } from "../../shared/globals";

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const clients = new Map<string, WebSocket.WebSocket>();

function getUserByWebsocket(
  websocket: WebSocket.WebSocket
): string | undefined {
  if (!websocket) throw "websocket cannot be null";
  let username: string | undefined;

  clients.forEach((value, key) => {
    if (value === websocket) username = key;
  });

  return username;
}

const messagePlayer = (username: string, data: any) => {
  const websocket = clients.get(username);
  if (!websocket) throw `[messageplayer] player ${username} not found`;

  if (websocket.readyState !== WebSocket.OPEN)
    throw `websocket not ready for user ${username}`;

  websocket.send(JSON.stringify(data));
};

const messageAll = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
    else {
      console.log(`[messageAll] a client is not ready`);
    }
  });
};

const gameRunner = new GameRunner({ messagePlayer, messageAll });

wss.on("connection", function connection(ws, req) {
  console.log(`[CONN] new client url="${req.url}"`);

  if (!req.url || req.url === "/") {
    console.log("[CONN] client disconnected -- missing username");
    ws.close(4002, "missing username in path");
    return;
  }

  const user = req.url.split("/")[1];

  if (clients.has(user)) {
    console.log(`disconnecting user ${user} -- already connected`);
    ws.close(4003, "player already connected");
    return;
  }

  try {
    clients.set(user, ws);
    gameRunner.onEvent({
      event: GameEventType.PLAYER_JOIN_GAME,
      user: user,
    });
  } catch (e: any) {
    console.warn(`user '${user}' was unable to join game: `, e);
    ws.close(4004, e);
    clients.delete(user);
  }

  ws.on("message", function (receivedData) {
    const user = getUserByWebsocket(ws);

    if (!user) {
      console.warn("received event from connection not associated with user");
      ws.close(4000, "this connection is not associated with a user");
      return;
    }

    try {
      const data = JSON.parse(receivedData.toString());
      console.debug(`[DEBUG] ${user} sent:`, data);
      data["user"] = user;
      gameRunner.onEvent(data);
    } catch (error) {
      console.error(error);
      ws.send(JSON.stringify({ error, receivedData }));
    }
  });

  ws.on("close", function (code, reason) {
    const user = getUserByWebsocket(ws);
    if (user) {
      console.info(`[CONN] closed user=${user} code=${code} reason=${reason}`);
      try {
        gameRunner.onEvent({ event: GameEventType.PLAYER_DISCONNECT, user });
      } catch (e) {
        console.error(e);
      }
      clients.delete(user);
    }
  });
});

server.on("upgrade", function upgrade(req, socket, head) {
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });
});

console.log(`Starting server on port ${SERVER_PORT}`);

server.listen(SERVER_PORT);
