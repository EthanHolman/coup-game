import { createUseStyles } from "react-jss";
import { GameState, GameStateAction } from "../GameState";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";

const useStyles = createUseStyles({
  playerRow: { flex: 1, display: "flex", justifyContent: "space-around" },
  tableCenter: { height: "3rem" },
});

type TableTopGameProps = {
  state: GameState;
  dispatch: React.Dispatch<GameStateAction>;
};

const TableTopGame = ({ state, dispatch }: TableTopGameProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.playerRow}>
        {state.players.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
      </div>
      <div className={classes.tableCenter}>
        {state.gameStatus === "PRE_GAME" && <StartGame state={state} />}
        {state.gameStatus === "RUNNING" && <div>Deck: {state.deckCount}</div>}
      </div>
      <div className={classes.playerRow}>Placeholder</div>
    </>
  );
};

export default TableTopGame;
