import { useReducer, useState } from "react";
import { GameEvent } from "../../../shared/GameEvent";
import { gameStateReducer, getInitialState } from "../ClientState";
import JoinGame from "./JoinGame";
import TableTopGame from "./TableTopGame";
import { GameEventType } from "../../../shared/enums";
import { UIMessage } from "../UIMessage";
import settings from "../../settings";
import styles from "./Game.module.scss";

const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(gameStateReducer, getInitialState());
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<UIMessage[]>([]);

  const sendEvent = (event: GameEvent) => {
    const toSend = JSON.stringify(event);
    console.debug("[ws] sending message:", toSend);
    websocket?.send(toSend);
  };

  const onUserJoinGame = (username: string) => {
    try {
      const ws = new WebSocket(`${settings.apiBaseUrl}/${username}`);
      ws.addEventListener("message", (event) => {
        try {
          const gameEvent = JSON.parse(event.data) as GameEvent;
          console.info("[WS]", gameEvent);
          if (gameEvent.error) console.error(gameEvent.error);
          if (gameEvent.event === GameEventType.CURRENT_STATE) {
            dispatch({ type: "updateGameState", data: gameEvent.data!.state! });
          } else if (gameEvent.event === GameEventType.NEW_GAME) {
            setMessages([]);
          } else {
            setMessages((msgs) => [...msgs, new UIMessage(gameEvent)]);
          }
        } catch (e) {
          console.error(e);
        }
      });
      ws.addEventListener("close", (event) => {
        console.warn(event);
        dispatch({ type: "reset" });
        const msg = event.reason
          ? event.reason
          : "Connection lost! Please try re-connecting with the same name.";
        alert(msg);
      });
      setWebsocket(ws);
      dispatch({ type: "joinGame", data: { username } });
    } catch (e) {
      alert("unable to connect!");
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      {state.thisPlayer ? (
        <TableTopGame
          state={state}
          dispatch={dispatch}
          sendEvent={sendEvent}
          messages={messages}
        />
      ) : (
        <JoinGame onJoin={onUserJoinGame} existingUsername={state.username} />
      )}
    </div>
  );
};

export default Game;
