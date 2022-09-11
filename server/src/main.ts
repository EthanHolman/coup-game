import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { GameRunner } from "./Game";

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

type ClientMetadata = { username: string };

const clients = new Map<WebSocket.WebSocket, ClientMetadata>();

function getUserWebsocket(username: string): WebSocket.WebSocket {
  let ws: WebSocket.WebSocket = undefined!;

  clients.forEach((x, k) => {
    if (x.username === username) ws = k;
  });

  return ws;
}

const messagePlayer = (playerName: string, data: any) => {
  const playerWs = getUserWebsocket(playerName);
  if (!playerWs) throw "[messageplayer] player not found"; // convert to exception

  if (playerWs.readyState === WebSocket.OPEN)
    playerWs.send(JSON.stringify(data));
  else {
    // add queue here?
    // when user reconnects, check in queue if they've got any waiting notifications
  }
};

const messageAll = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
    else {
      // queue
    }
  });
};

const gameRunner = new GameRunner({ messagePlayer, messageAll });

function handleMessage(message: any, clientMetadata: ClientMetadata) {
  console.debug(`[MESSAGE] ${clientMetadata.username} -- ${message.action}`);
  gameRunner.onEvent(message);
}

wss.on("connection", function connection(ws, req) {
  console.log(`[CONN] new client url="${req.url}"`);

  if (!req.url) {
    ws.close(4003, "missing username in path");
    return;
  }

  const metadata: ClientMetadata = {
    username: req.url.split("/")[1],
  };

  // prevent same username from joining twice
  if (getUserWebsocket(metadata.username)) {
    ws.close(4003, "player name already exists");
    return;
  }

  clients.set(ws, metadata);

  ws.on("message", function (rawData) {
    const client = clients.get(ws);

    if (!client) {
      console.warn("received msg from unregistered websocket");
      ws.close(4000, "this connection is not registered with server");
      return;
    }

    try {
      const data = JSON.parse(rawData.toString());
      handleMessage(data, client);
    } catch (e) {
      ws.send(
        JSON.stringify({
          error: "error occurred processing message",
          receivedData: rawData,
        })
      );
    }
  });
  ws.on("close", function (code, reason) {
    const client = clients.get(ws);
    console.log(
      `[CLOSED] clientId=${
        client?.username ?? ""
      } code=${code} reason=${reason}`
    );
    clients.delete(ws);
  });
});

server.on("upgrade", function upgrade(req, socket, head) {
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });
});

setInterval(() => {
  const client = getUserWebsocket("ethan");
  if (client) client.send("hey ethan, server here..");
}, 5000);

const serverPort = 8080;
console.log(`Starting server on port ${serverPort}`);

server.listen(serverPort);
