import { ClientGameState, ClientPlayer } from "../../shared/ClientGameState";

export type GameState = ClientGameState & {
  username: string;
  thisPlayer: ClientPlayer;
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
  thisPlayer: undefined as any,
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
      const thisPlayer = action.data.players.find(
        (x) => x.name === state.username
      );
      if (!thisPlayer)
        throw `could not find username ${state.username} in returned player list`;
      return {
        username: state.username,
        thisPlayer,
        ...action.data,
      };
    default:
      return state;
  }
};
