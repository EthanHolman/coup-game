import { GameState, GameStateAction } from "../GameState";

type TableTopGameProps = {
  state: GameState;
  dispatch: React.Dispatch<GameStateAction>;
};

const TableTopGame = ({ state, dispatch }: TableTopGameProps): JSX.Element => {
  return <>The game will start soon!</>;
};

export default TableTopGame;
