import { useReducer, useState } from "react";
import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { gameStateReducer, getInitialState } from "../ClientState";
import JoinGame from "./JoinGame";
import TableTopGame from "./TableTopGame";
import { GameEventType } from "../../../shared/enums";
import { eventToMessage, UIMessage } from "../eventsToMessages";
import Header from "./Header";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    textAlign: "center",
  },
});

const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(gameStateReducer, getInitialState());
  const [websocket, setWebsocket] = useState<WebSocket>();
  const [messages, setMessages] = useState<UIMessage[]>([]);

  const classes = useStyles();

  const sendEvent = (event: GameEvent) => {
    const toSend = JSON.stringify(event);
    console.debug("[ws] sending message:", toSend);
    websocket?.send(toSend);
  };

  const onUserJoinGame = (username: string) => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/${username}`);
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
            setMessages((msgs) => [...msgs, eventToMessage(gameEvent)]);
          }
        } catch (e) {
          console.error(e);
        }
      });
      ws.addEventListener("close", (event) => {
        console.log(event);
        dispatch({ type: "reset" });
        alert(
          "connection reset. please re-join the game with the same username"
        );
      });
      setWebsocket(ws);
      dispatch({ type: "joinGame", data: { username } });
    } catch (e) {
      alert("unable to connect!");
      console.error(e);
    }
  };

  return (
    <div className={classes.container}>
      <Header state={state} />
      {state.thisPlayer ? (
        <TableTopGame
          state={state}
          dispatch={dispatch}
          sendEvent={sendEvent}
          messages={messages}
        />
      ) : (
        <JoinGame onJoin={onUserJoinGame} />
      )}
    </div>
  );
};

export default Game;
