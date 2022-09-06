import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

type ClientMetadata = { id: string; username: string };

const clients = new Map<WebSocket.WebSocket, ClientMetadata>();

function handleMessage(
  message: any,
  clientMetadata: ClientMetadata,
  ws: WebSocket.WebSocket
) {
  console.log(`[MESSAGE] ${clientMetadata.username} -- ${message.action}`);

  switch (message.action) {
    case "closeme":
      ws.close();
      break;
    default:
      console.log(message.data);
  }
}

wss.on("connection", function connection(ws, req) {
  console.log(`[CONN] new client url="${req.url}"`);

  const metadata: ClientMetadata = {
    id: uuidv4(),
    username: req.url.split("/")[1],
  };
  clients.set(ws, metadata);

  ws.on("message", function (data) {
    const client = clients.get(ws);
    handleMessage(JSON.parse(data.toString()), client, ws);
  });
  ws.on("close", function (code, reason) {
    const client = clients.get(ws);
    console.log(
      `[CLOSED] clientId=${client.username} code=${code} reason=${reason}`
    );
    clients.delete(ws);
  });
});

server.on("upgrade", function upgrade(req, socket, head) {
  wss.handleUpgrade(req, socket, head, function done(ws) {
    wss.emit("connection", ws, req);
  });
});

server.listen(8080);

// const doStuff = () => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) client.send("hey there");
//   });
// };

// setInterval(doStuff, 5000);
