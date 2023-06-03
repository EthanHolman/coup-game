import { GameStatus } from "../../server/src/GameState";
import { ClientGameState, ClientPlayer } from "../../shared/ClientGameState";

export type ClientState = ClientGameState & {
  username: string;
  thisPlayer: ClientPlayer;
  isMyTurn: boolean;
};

export type GameStateAction =
  | {
      type: "joinGame";
      data: { username: string };
    }
  | { type: "reset" }
  | { type: "updateGameState"; data: ClientGameState };

export const getInitialState = (): ClientState => ({
  username: "",
  thisPlayer: undefined as any,
  isMyTurn: false,
  currentPlayerName: "",
  isPaused: false,
  status: GameStatus.PRE_GAME,
  players: [],
  deckCount: 0,
});

export const gameStateReducer = (
  state: ClientState,
  action: GameStateAction
): ClientState => {
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
        isMyTurn: action.data.currentPlayerName === state.username,
        ...action.data,
      };
    default:
      return state;
  }
};
