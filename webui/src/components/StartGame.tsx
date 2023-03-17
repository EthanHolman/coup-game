import { createUseStyles } from "react-jss";
import { GameEventType } from "../../../shared/enums";
import { GameEvent } from "../../../shared/GameEvent";
import { GameState } from "../GameState";

const useStyles = createUseStyles({});

export type StartGameProps = {
  state: GameState;
  sendEvent: (event: GameEvent) => void;
};

const StartGame = ({ state, sendEvent }: StartGameProps): JSX.Element => {
  const classes = useStyles();

  const onStartGame = () => {
    sendEvent({ event: GameEventType.START_GAME, user: state.username });
  };

  return (
    <div>
      {state.thisPlayer.isHost ? (
        <>
          Ready?{" "}
          <button type="button" onClick={onStartGame}>
            Start Game!
          </button>
        </>
      ) : (
        <>Waiting for host to start the game!</>
      )}
    </div>
  );
};

export default StartGame;
