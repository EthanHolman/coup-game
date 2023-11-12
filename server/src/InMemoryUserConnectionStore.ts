import { WebSocket } from "ws";
import {
  InvalidParameterError,
  PlayerAlreadyExistsError,
  PlayerNotExistsError,
  WebsocketAlreadyExistsError,
  WebsocketNotExistsError,
} from "./errors";

export type UserMetadata = {
  user: string;
  gameCode: string;
};

export class InMemoryUserConnectionStore {
  map_wsToPlayer = new Map<WebSocket, UserMetadata>();
  map_playerToWs = new Map<string, WebSocket>();

  addUser(ws: WebSocket, user: string, gameCode: string): void {
    if (!user) throw new InvalidParameterError("user must be provided");
    if (!gameCode) throw new InvalidParameterError("gameCode must be provided");

    const playerStr = this.formatPlayerStr({ user, gameCode });

    if (this.map_playerToWs.has(playerStr))
      throw new PlayerAlreadyExistsError();

    if (this.map_wsToPlayer.has(ws))
      throw new WebsocketAlreadyExistsError(
        "ws already exists in store, this should not be possible?"
      );

    this.map_wsToPlayer.set(ws, { user, gameCode });
    this.map_playerToWs.set(playerStr, ws);
  }

  handleWebsocketClose(ws: WebSocket): void {
    const playerData = this.map_wsToPlayer.get(ws);
    if (playerData)
      this.map_playerToWs.delete(this.formatPlayerStr(playerData));

    this.map_wsToPlayer.delete(ws);
  }

  getByWebsocket(ws: WebSocket): UserMetadata {
    const result = this.map_wsToPlayer.get(ws);
    if (!result) throw new WebsocketNotExistsError();
    return result;
  }

  getUserWebsocket(userMetadata: UserMetadata): WebSocket {
    const playerStr = this.formatPlayerStr(userMetadata);
    const result = this.map_playerToWs.get(playerStr);
    if (!result) throw new PlayerNotExistsError(playerStr);
    return result;
  }

  getGameCodeUserWebsockets(gameCode: string): WebSocket[] {
    const toReturn: WebSocket[] = [];
    this.map_playerToWs.forEach((value, key) => {
      if (key.split("#")[0] === gameCode) toReturn.push(value);
    });
    return toReturn;
  }

  formatPlayerStr({ user, gameCode }: UserMetadata): string {
    return `${gameCode}#${user}`;
  }
}
