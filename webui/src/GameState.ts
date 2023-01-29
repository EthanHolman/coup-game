import { Card } from "../../shared/Card";

export type Player = {
  username: string;
  coins: number;
  cards: Card[];
};

export type GameState = {
  username: string;
  players: Player[];
};

export type GameStateAction =
  | {
      type: "joinGame";
      data: { username: string };
    }
  | { type: "reset" };

export const getInitialState = (): GameState => ({
  username: "",
  players: [],
});

export const gameStateReducer = (
  state: GameState,
  action: GameStateAction
): GameState => {
  switch (action.type) {
    case "joinGame":
      return { ...state, username: action.data.username };
    case "reset":
      return getInitialState();
    default:
      return state;
  }
};
