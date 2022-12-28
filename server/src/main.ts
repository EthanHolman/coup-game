import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { GameEventType } from "./enums";
import { GameRunner } from "./Game";
import { SERVER_USERNAME } from "./globals";

class ClientConnectionData {
  websocket: WebSocket.WebSocket | null;
  isConnected: boolean;

  constructor(websocket: WebSocket.WebSocket) {
    this.websocket = websocket;
    this.isConnected = true;
  }
}

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const clients = new Map<string, ClientConnectionData>();

function updateUserWebsocket(username: string, ws: WebSocket.WebSocket | null) {
  const client = clients.get(username)!;
  client.websocket = ws;
}

function getUsernameFromWebsocket(websocket: WebSocket.WebSocket): string {
  if (!websocket) throw "websocket cannot be null";
  let username: string | undefined;

  clients.forEach((value, key) => {
    if (value.websocket === websocket) username = key;
  });

  if (!username) throw `user ${username} not found`;

  return username;
}

const messagePlayer = (username: string, data: any) => {
  const userConnectionData = clients.get(username);
  if (!userConnectionData) throw `[messageplayer] player ${username} not found`;

  const { websocket } = userConnectionData;
  if (!websocket || websocket.readyState !== WebSocket.OPEN)
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
    const client = clients.get(user)!;

    if (client.isConnected) {
      console.log(`disconnecting user ${user} -- already connected`);
      ws.close(4003, "player already connected");
      return;
    } else {
      console.log(`reconnecting user ${user}`);
      updateUserWebsocket(user, ws);
      client.isConnected = true;
      gameRunner.onEvent({
        event: GameEventType.RESUME_GAME,
        user: SERVER_USERNAME,
        data: { reason: `player ${user} has reconnected` },
      });
    }
  } else {
    try {
      clients.set(user, new ClientConnectionData(ws));
      gameRunner.onEvent({
        event: GameEventType.PLAYER_JOIN_GAME,
        user: user,
      });
    } catch (e: any) {
      ws.close(4004, e);
      console.warn(`user ${user} was unable to join game`, e);
      clients.delete(user);
    }
  }

  ws.on("message", function (receivedData) {
    const user = getUsernameFromWebsocket(ws);

    if (!user) {
      console.warn("received event from unregistered websocket");
      ws.close(4000, "this connection is not registered with server");
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
    const user = getUsernameFromWebsocket(ws);
    console.log(`[CONN] closed clientId=${user} code=${code} reason=${reason}`);

    updateUserWebsocket(user, null);
    const client = clients.get(user)!;
    client.isConnected = false;
    gameRunner.onEvent({
      event: GameEventType.PAUSE_GAME,
      user: SERVER_USERNAME,
      data: { reason: `player ${user} lost connection` },
    });
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
