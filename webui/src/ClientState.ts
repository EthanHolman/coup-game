import { ClientGameState, ClientPlayer } from "../../shared/ClientGameState";
import { GameStatus } from "../../shared/enums";

export type ClientState = ClientGameState & {
  username: string;
  gameCode: string;
  thisPlayer: ClientPlayer;
  isMyTurn: boolean;
};

export type GameStateAction =
  | {
      type: "joinGame";
      data: { username: string; gameCode: string };
    }
  | { type: "reset" }
  | { type: "updateGameState"; data: ClientGameState };

export const getInitialState = (): ClientState => ({
  // local state
  username: "",
  gameCode: "",
  thisPlayer: undefined as any,
  isMyTurn: false,

  // from server
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
      return {
        ...state,
        username: action.data.username,
        gameCode: action.data.gameCode,
      };
    case "reset":
      return { ...getInitialState(), username: state.username };
    case "updateGameState":
      const thisPlayer = action.data.players.find(
        (x) => x.name === state.username
      );
      if (!thisPlayer)
        throw `could not find username ${state.username} in returned player list`;
      return {
        ...state,
        thisPlayer,
        isMyTurn: action.data.currentPlayerName === state.username,
        ...action.data,
      };
    default:
      return state;
  }
};
