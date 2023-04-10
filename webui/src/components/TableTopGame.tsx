import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState, GameStateAction } from "../ClientState";
import { ClientGameAction, getFriendlyActionName } from "../ClientGameAction";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";
import { getAvailableActions } from "../getAvailableActions";
import React from "react";

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

  // TODO: memoize or something.. i can't remember how to do it right in react
  const availableActions = getAvailableActions(state);

  const handleChooseAction = (action: ClientGameAction) => {
    alert(action);
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
      <div>
        {availableActions.length > 0 && <h2>Choose an action</h2>}
        {availableActions.map((action) => (
          <button
            type="button"
            key={action}
            onClick={() => handleChooseAction(action)}
          >
            {getFriendlyActionName(action)}
          </button>
        ))}
      </div>
    </>
  );
};

export default TableTopGame;
