import { ClientState } from "./ClientState";

export function getTargetPlayers(state: ClientState) {
  return state.players
    .filter((player) => player.name !== state.username && !player.isOut)
    .map((player) => player.name);
}
