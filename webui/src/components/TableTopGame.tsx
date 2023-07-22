import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState, GameStateAction } from "../ClientState";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";
import React from "react";
import ActionPicker from "./ActionPicker/ActionPicker";
import { GameStatus } from "../../../shared/enums";
import LoseCard from "./LoseCard/LoseCard";
import ExchangeCard from "./ExchangeCard/ExchangeCard";
import MessageViewer from "./MessageViewer";
import { UIMessage } from "../eventsToMessages";

type TableTopGameProps = {
  state: ClientState;
  dispatch: React.Dispatch<GameStateAction>;
  sendEvent: (event: GameEvent) => void;
  messages: UIMessage[];
};

const useStyles = createUseStyles({
  playerRows: { flex: 3, overflowY: "auto" },
  playerRow: {},
  actionContainer: {
    padding: "1rem",
    backgroundColor: "#eee",
    borderTop: "1px solid #ddd",
  },
  messageContainer: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: "#ddd",
  },
});

const TableTopGame = ({
  state,
  sendEvent,
  messages,
}: TableTopGameProps): JSX.Element => {
  const classes = useStyles();

  const isThisPlayerLosingCard =
    state.status === GameStatus.PLAYER_LOSING_CARD &&
    state.playerLosingCard?.player === state.username;

  const isThisPlayerExchangingCard =
    state.status === GameStatus.AWAITING_EXCHANGE && state.isMyTurn;

  return (
    <>
      <div className={classes.playerRows}>
        {state.players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            isYou={state.username === player.name}
            isCurrentPlayer={state.currentPlayerName === player.name}
          />
        ))}
      </div>
      <div className={classes.actionContainer}>
        {state.status === GameStatus.PRE_GAME && (
          <StartGame state={state} sendEvent={sendEvent} />
        )}
        {isThisPlayerExchangingCard && (
          <ExchangeCard state={state} sendEvent={sendEvent} />
        )}
        {isThisPlayerLosingCard && (
          <LoseCard state={state} sendEvent={sendEvent} />
        )}
        <ActionPicker state={state} sendEvent={sendEvent} />
      </div>
      <div className={classes.messageContainer}>
        <MessageViewer events={messages} state={state} />
      </div>
    </>
  );
};

export default TableTopGame;
