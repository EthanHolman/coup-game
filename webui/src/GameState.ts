export type GameState = {
  username: string;
  players: string[];
};

export type GameStateAction = {
  type: "joinGame" | "reset";
  data: { username: string };
};

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
