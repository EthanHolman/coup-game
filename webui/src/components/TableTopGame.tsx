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
import { UIMessage } from "../UIMessage";
import GameOver from "./GameOver";
import Header from "./Header";
import styles from "./TableTopGame.module.scss";

type TableTopGameProps = {
  state: ClientState;
  dispatch: React.Dispatch<GameStateAction>;
  sendEvent: (event: GameEvent) => void;
  messages: UIMessage[];
};

const TableTopGame = ({
  state,
  sendEvent,
  messages,
}: TableTopGameProps): JSX.Element => {
  const isThisPlayerLosingCard =
    state.status === GameStatus.PLAYER_LOSING_CARD &&
    state.playerLosingCard?.player === state.username;

  const isThisPlayerExchangingCard =
    state.status === GameStatus.AWAITING_EXCHANGE && state.isMyTurn;

  return (
    <>
      <Header state={state} />
      <div className={styles.playerRows}>
        {state.players.map((player) => (
          <PlayerCard
            key={player.name}
            player={player}
            isYou={state.username === player.name}
            isCurrentPlayer={state.currentPlayerName === player.name}
          />
        ))}
      </div>
      <div className={styles.actionContainer}>
        {state.status === GameStatus.PRE_GAME && (
          <StartGame state={state} sendEvent={sendEvent} />
        )}
        {state.status === GameStatus.GAME_OVER && (
          <GameOver state={state} sendEvent={sendEvent} />
        )}
        {isThisPlayerExchangingCard && (
          <ExchangeCard state={state} sendEvent={sendEvent} />
        )}
        {isThisPlayerLosingCard && (
          <LoseCard state={state} sendEvent={sendEvent} />
        )}
        <ActionPicker state={state} sendEvent={sendEvent} />
      </div>
      <div className={styles.messageContainer}>
        <MessageViewer events={messages} state={state} />
      </div>
    </>
  );
};

export default TableTopGame;
