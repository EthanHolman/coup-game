import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { GameEventType } from "../../shared/enums";
import { GameRunner } from "./Game";

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const clients = new Map<string, WebSocket.WebSocket>();

function getUserByWebsocket(websocket: WebSocket.WebSocket): string {
  if (!websocket) throw "websocket cannot be null";
  let username: string | undefined;

  // TODO: this can probably be cleaned up
  clients.forEach((value, key) => {
    if (value === websocket) username = key;
  });

  if (!username) throw `user ${username} not found`;

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

  // TODO: sanitize this username & make sure its not server_username
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
    ws.close(4004, e);
    console.warn(`user ${user} was unable to join game`, e);
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
      console.debug(`[DEBUG] ${user} sent:`, receivedData);
      const data = JSON.parse(receivedData.toString());
      data["user"] = user;
      gameRunner.onEvent(data);
    } catch (error) {
      console.warn("[WARN] exception in main runner:", error);
      ws.send(JSON.stringify({ error, receivedData }));
    }
  });

  ws.on("close", function (code, reason) {
    const user = getUserByWebsocket(ws);
    console.log(`[CONN] closed clientId=${user} code=${code} reason=${reason}`);
    gameRunner.onEvent({ event: GameEventType.PLAYER_DISCONNECT, user });
    clients.delete(user);
  });
});

server.on("upgrade", function upgrade(req, socket, head) {
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });
});

const serverPort = 8080;
console.log(`Starting server on port ${serverPort}`);

server.listen(serverPort);
