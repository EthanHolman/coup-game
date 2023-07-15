import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState, GameStateAction } from "../ClientState";
import PlayerCard from "./PlayerCard";
import StartGame from "./StartGame";
import React, { useState } from "react";
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
  playerRows: { flex: 1, overflowY: "auto" },
  playerRow: {},
  deckContainer: {
    padding: "1rem",
    borderTop: "1px solid #ddd",
  },
  actionContainer: {
    padding: "1rem",
    backgroundColor: "#eee",
    borderTop: "1px solid #ddd",
  },
  tabContainer: {
    backgroundColor: "#ddd",
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "stretch",

    "& > button": {
      flex: 1,
      margin: "0.25rem",
    },
  },
});

enum ViewMode {
  Players,
  ChatLog,
}

const TableTopGame = ({
  state,
  sendEvent,
  messages,
}: TableTopGameProps): JSX.Element => {
  const classes = useStyles();
  const [viewMode, setViewMode] = useState(ViewMode.Players);

  const isThisPlayerLosingCard =
    state.status === GameStatus.PLAYER_LOSING_CARD &&
    state.playerLosingCard?.player === state.username;

  const isThisPlayerExchangingCard =
    state.status === GameStatus.AWAITING_EXCHANGE && state.isMyTurn;

  return (
    <>
      {viewMode === ViewMode.Players && (
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
          {state.status !== GameStatus.PRE_GAME && (
            <div className={classes.deckContainer}>
              <div>Deck: {state.deckCount} cards</div>
            </div>
          )}
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
        </>
      )}
      {viewMode === ViewMode.ChatLog && (
        <MessageViewer events={messages} state={state} />
      )}
      <div className={classes.tabContainer}>
        <button type="button" onClick={() => setViewMode(ViewMode.Players)}>
          Players
        </button>
        <button type="button" onClick={() => setViewMode(ViewMode.ChatLog)}>
          Chat Log
        </button>
      </div>
    </>
  );
};

export default TableTopGame;
