import { GameState } from "../GameState";
import { Player } from "../Player";

export function addNewPlayer(state: GameState, name: string) {
  if (state.players.map((x) => x.name).includes(name))
    throw `the username ${name} has already been taken`;

  const newPlayerCards = state.deck.drawCard(2);
  const newPlayer = new Player(name, newPlayerCards);

  if (state.players.length === 0) newPlayer.isHost = true;

  state.addPlayer(newPlayer);
}
