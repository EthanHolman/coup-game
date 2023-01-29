import { useReducer, useState } from "react";
import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";
import { gameStateReducer, getInitialState } from "../GameState";
import JoinGame from "./JoinGame";
import EventViewer from "./EventViewer";
import TableTop from "./TableTop";
import TableTopGame from "./TableTopGame";

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
  const [messages, setMessages] = useState<GameEvent[]>([]);

  const classes = useStyles();

  const onUserJoinGame = (username: string) => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/${username}`);
      ws.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data) as GameEvent;
          if (data) {
            console.info("[WS]", data);
            setMessages((msgs) => [...msgs, data]);
          }
        } catch (e) {
          alert("unable to connect!");
          console.error(e);
        }
      });
      ws.addEventListener("close", (event) => {
        console.log(event);
        dispatch({ type: "reset" });
      });
      setWebsocket(ws);
      dispatch({ type: "joinGame", data: { username } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>Coup ONLINE</h1>
      <TableTop>
        {state.username ? (
          <TableTopGame state={state} dispatch={dispatch} />
        ) : (
          <JoinGame onJoin={onUserJoinGame} />
        )}
      </TableTop>
      <EventViewer events={messages} />
    </div>
  );
};

export default Game;
