import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState, GameStateAction } from "../ClientState";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";
import React from "react";
import ActionPicker from "./ActionPicker/ActionPicker";
import { GameStatus } from "../../../server/src/GameState";

const useStyles = createUseStyles({
  playerRow: { flex: 1, display: "flex", justifyContent: "space-around" },
  tableCenter: { height: "3rem" },
});

type TableTopGameProps = {
  state: ClientState;
  dispatch: React.Dispatch<GameStateAction>;
  sendEvent: (event: GameEvent) => void;
};

const TableTopGame = ({ state, sendEvent }: TableTopGameProps): JSX.Element => {
  const classes = useStyles();

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
        {state.status === GameStatus.PRE_GAME && (
          <StartGame state={state} sendEvent={sendEvent} />
        )}
        {state.status !== GameStatus.PRE_GAME && (
          <div>Deck: {state.deckCount} cards</div>
        )}
      </div>
      <ActionPicker state={state} sendEvent={sendEvent} />
    </>
  );
};

export default TableTopGame;
