import { createUseStyles } from "react-jss";
import { GameState } from "../GameState";

const useStyles = createUseStyles({});

export type StartGameProps = {
  state: GameState;
};

const StartGame = ({ state }: StartGameProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div>
      {state.thisPlayer.isHost ? (
        <>
          Ready? <button type="button">Start Game!</button>
        </>
      ) : (
        <>Waiting for host to start the game!</>
      )}
    </div>
  );
};

export default StartGame;
