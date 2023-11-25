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
import cors from "cors";
import {
  GameStateNotFoundError,
  PlayerAlreadyExistsError,
  WebsocketNotExistsError,
} from "./errors";
import { sendCurrentState } from "./actions/sendCurrentState";

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
  sendCurrentStateFn: sendCurrentState,
});

wss.on("connection", function connection(ws, req) {
  console.log(`[CONN] new client url="${req.url}"`);
  let username = "";
  let gameCode = "";
  try {
    const { query } = parse(req.url ?? "", true);
    username = `${query["username"]}`;
    if (!username) {
      ws.close(4002, "missing username");
      return;
    }
    gameCode = `${query["gameCode"]}`;
    if (!gameCode) {
      ws.close(4002, "missing gameCode");
      return;
    }
  } catch (e) {
    console.error(e);
    ws.close(4002, "error while joining");
    return;
  }

  try {
    userStore.addUser(ws, username, gameCode);
    gameRunner.onEvent(gameCode, {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: username,
    });
  } catch (e) {
    let message = `user ${username} was unable to join gameCode ${gameCode}`;

    if (e instanceof GameStateNotFoundError)
      message = `Gamecode '${gameCode}' was not found! Try starting a new game instead?`;
    if (e instanceof PlayerAlreadyExistsError)
      message = `Username '${username}' is already taken in game code ${gameCode}`;

    console.warn(`${message}: `, e);
    ws.close(4004, message);
  }

  ws.on("message", function (receivedData) {
    try {
      const { user, gameCode } = userStore.getByWebsocket(ws);

      const data = JSON.parse(receivedData.toString());
      console.debug(`[${gameCode}] ${username} sent:`, data);

      gameRunner.onEvent(gameCode, { ...data, user });
    } catch (error) {
      if (error instanceof WebsocketNotExistsError) {
        console.warn("received event from connection not associated with user");
        ws.close(4000, "this connection is not associated with a user");
      } else {
        console.error(error);
        ws.send(JSON.stringify({ error, receivedData }));
      }
    }
  });

  ws.on("close", function (code, reason) {
    try {
      const { user, gameCode } = userStore.getByWebsocket(ws);
      console.info(
        `[CONN] closed user=${user} gamecode=${gameCode} code=${code} reason=${reason}`
      );
      gameRunner.onEvent(gameCode, {
        event: GameEventType.PLAYER_DISCONNECT,
        user,
      });
    } catch (e) {
      console.error(e);
    } finally {
      console.info(`[CONN] closed user=UNKNOWN code=${code} reason=${reason}`);
      userStore.handleWebsocketClose(ws);
    }
  });
});

expressApp.options(
  "*",
  cors({ allowedHeaders: "*", optionsSuccessStatus: 200 })
);

expressApp.use(cors({ allowedHeaders: "*", optionsSuccessStatus: 200 }));

expressApp.get("/games", (req, res) => {
  const games = gameStateStore.listGameCodes();
  res.send({ games });
});

expressApp.post("/game", (req, res) => {
  const { gameCode } = gameStateStore.createNewGame();
  res.send({ gameCode });
});

expressApp.use("/", express.static("dist/webui"));

console.log(`Starting server on port ${SERVER_PORT}`);

server.listen(SERVER_PORT);
