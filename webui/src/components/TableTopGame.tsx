import { createUseStyles } from "react-jss";
import { GameActionMove } from "../../../shared/enums";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState, GameStateAction } from "../ClientState";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";

type ClientGameAction = {
  action: GameActionMove;
  friendlyTitle: string;
};

function getAvailableActions(state: ClientState): ClientGameAction[] {
  const actions: ClientGameAction[] = [];

  if (state.gameStatus !== "RUNNING") return [];

  if (state.isMyTurn) {
  }

  return actions;
}

const useStyles = createUseStyles({
  playerRow: { flex: 1, display: "flex", justifyContent: "space-around" },
  tableCenter: { height: "3rem" },
});

type TableTopGameProps = {
  state: ClientState;
  dispatch: React.Dispatch<GameStateAction>;
  sendEvent: (event: GameEvent) => void;
};

const TableTopGame = ({
  state,
  dispatch,
  sendEvent,
}: TableTopGameProps): JSX.Element => {
  const classes = useStyles();

  const handleChooseAction = (action: ClientGameAction) => {
    alert(action.action);
  };

  return (
    <>
      <div className={classes.playerRow}>
        {state.players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            isYou={state.username === player.name}
            isCurrentPlayer={state.currentPlayerName === player.name}
          />
        ))}
      </div>
      <div className={classes.tableCenter}>
        {state.gameStatus === "PRE_GAME" && (
          <StartGame state={state} sendEvent={sendEvent} />
        )}
        {state.gameStatus === "RUNNING" && (
          <div>Deck: {state.deckCount} cards</div>
        )}
      </div>
      {state.currentPlayerName === state.username &&
        state.gameStatus === "RUNNING" && (
          <div>
            <h2>Choose an action</h2>
            {getAvailableActions(state).map((action) => (
              <button
                type="button"
                key={action.friendlyTitle}
                onClick={() => handleChooseAction(action)}
              >
                {action.friendlyTitle}
              </button>
            ))}
          </div>
        )}
    </>
  );
};

export default TableTopGame;
