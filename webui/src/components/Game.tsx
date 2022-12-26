import { useReducer, useState } from "react";
import { createUseStyles } from "react-jss";
import { gameStateReducer, getInitialState } from "../GameState";
import JoinGame from "./JoinGame";
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
  const [lastMessage, setLastMessage] = useState<any>();

  const classes = useStyles();

  const onUserJoinGame = (username: string) => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/${username}`);
      ws.addEventListener("message", (event) => {
        console.log(event);
        try {
          const data = JSON.parse(event.data);
          if (data) setLastMessage(event.data);
        } catch (e) {
          setLastMessage({
            description: "unable to parse last message",
            error: e,
          });
        }
      });
      ws.addEventListener("close", (event) => {
        console.log(event);
        dispatch({ type: "reset", data: { username: "" } });
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
      <div>{lastMessage}</div>
    </div>
  );
};

export default Game;
