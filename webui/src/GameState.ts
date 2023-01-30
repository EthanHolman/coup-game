import { ClientGameState } from "../../shared/ClientGameState";

export type GameState = ClientGameState & {
  username: string;
};

export type GameStateAction =
  | {
      type: "joinGame";
      data: { username: string };
    }
  | { type: "reset" }
  | { type: "updateGameState"; data: ClientGameState };

export const getInitialState = (): GameState => ({
  username: "",
  currentPlayerName: "",
  gameStatus: "",
  players: [],
  deckCount: 0,
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
    case "updateGameState":
      return { username: state.username, ...action.data };
    default:
      return state;
  }
};
