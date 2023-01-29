import { Card } from "../../../shared/Card";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";

export function generateStateWithNPlayers(numPlayers: number) {
  const state = new GameState();
  for (let i = 0; i < numPlayers; i++)
    state.addPlayer(new Player(`tester-${i}`, [Card.CONTESSA, Card.CONTESSA]));
  state.start();
  return state;
}
