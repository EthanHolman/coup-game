import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
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
  sendEvent: (event: GameEvent) => void;
};

const TableTopGame = ({
  state,
  dispatch,
  sendEvent,
}: TableTopGameProps): JSX.Element => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.playerRow}>
        {state.players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            isYou={state.username === player.name}
          />
        ))}
      </div>
      <div className={classes.tableCenter}>
        {state.gameStatus === "PRE_GAME" && (
          <StartGame state={state} sendEvent={sendEvent} />
        )}
        {state.gameStatus === "RUNNING" && <div>Deck: {state.deckCount}</div>}
      </div>
    </>
  );
};

export default TableTopGame;
