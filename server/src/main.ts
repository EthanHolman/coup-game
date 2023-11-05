import { createServer } from "http";
import WebSocket from "ws";
import { parse } from "url";
import { GameEventType } from "../../shared/enums";
import { GameRunner } from "./Game";
import { SERVER_PORT } from "../../shared/globals";
import express from "express";
import { InMemoryUserConnectionStore } from "./InMemoryUserConnectionStore";
import { InMemoryGameStateStore } from "./InMemoryGameStateStore";
import { GameEvent } from "../../shared/GameEvent";

const expressApp = express();
const server = createServer(expressApp);
const wss = new WebSocket.Server({ server, path: "/ws" });

const userStore = new InMemoryUserConnectionStore();
const gameStateStore = new InMemoryGameStateStore();

const messagePlayer = (gameCode: string, user: string, data: GameEvent) => {
  const websocket = userStore.getUserWebsocket({ user, gameCode });

  if (websocket.readyState !== WebSocket.OPEN)
    throw `websocket not ready for user ${user}`;

  websocket.send(JSON.stringify(data));
};

const messageAll = (gameCode: string, data: GameEvent) => {
  userStore.getGameCodeUserWebsockets(gameCode).forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
    else {
      console.error(`[messageAll] a client is not ready`);
    }
  });
};

const gameRunner = new GameRunner({
  messagePlayer,
  messageAll,
  gameStateStore,
});

wss.on("connection", function connection(ws, req) {
  console.log(`[CONN] new client url="${req.url}"`);
  let user = "";
  let gameCode = "";
  try {
    const { query } = parse(req.url ?? "", true);
    user = `${query["username"]}`;
    gameCode = `${query["gameCode"]}`;
  } catch (e) {
    console.log("[CONN] client disconnected -- missing username");
    ws.close(4002, "missing username in path");
    return;
  }

  try {
    userStore.addUser(ws, user, gameCode);
    gameRunner.onEvent(gameCode, {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: user,
    });
  } catch (e: any) {
    console.warn(`user '${user}' was unable to join game: `, e);
    ws.close(4004, e);
    userStore.handleWebsocketClose(ws);
  }

  ws.on("message", function (receivedData) {
    const userMetadata = userStore.getByWebsocket(ws);

    if (!user) {
      console.warn("received event from connection not associated with user");
      ws.close(4000, "this connection is not associated with a user");
      return;
    }

    try {
      const data = JSON.parse(receivedData.toString());
      console.debug(`[DEBUG] ${user} sent:`, data);
      data["user"] = user;
      gameRunner.onEvent(userMetadata.gameCode, data);
    } catch (error) {
      console.error(error);
      ws.send(JSON.stringify({ error, receivedData }));
    }
  });

  ws.on("close", function (code, reason) {
    const { user, gameCode } = userStore.getByWebsocket(ws);
    if (user) {
      console.info(`[CONN] closed user=${user} code=${code} reason=${reason}`);
      try {
        gameRunner.onEvent(gameCode, {
          event: GameEventType.PLAYER_DISCONNECT,
          user,
        });
      } catch (e) {
        console.error(e);
      }
      userStore.handleWebsocketClose(ws);
    }
  });
});

// server.on("upgrade", function upgrade(req, socket, head) {
//   const { pathname, ...x } = parse(req.url ?? "");

//   if (pathname?.startsWith("/ws/")) {
//     wss.handleUpgrade(req, socket, head, function done(ws) {
//       wss.emit("connection", ws, req);
//     });
//   }
// });

// setup rest api

expressApp.get("/games", (req, res) => {
  const games = gameStateStore.listGameCodes();
  res.send({ games });
});

expressApp.post("/game", (req, res) => {
  const newGameId = gameStateStore.createNewGame();
  res.send({ newGameId });
});

console.log(`Starting server on port ${SERVER_PORT}`);

server.listen(SERVER_PORT);
