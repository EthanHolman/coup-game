import { useReducer, useState } from "react";
import { gameStateReducer, getInitialState } from "../GameState";
import JoinGame from "./JoinGame";

const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(gameStateReducer, getInitialState());
  const [websocket, setWebsocket] = useState<WebSocket>();

  const onUserJoinGame = (username: string) => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/${username}`);
      setWebsocket(ws);
      dispatch({ type: "joinGame", data: { username } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Coup ONLINE</h1>
      {state.username ? (
        <h2>{state.username}, the game will begin shortly!</h2>
      ) : (
        <JoinGame onJoin={onUserJoinGame} />
      )}
    </div>
  );
};

export default Game;
