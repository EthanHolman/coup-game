import { GameEvent } from "../../../shared/GameEvent";
import { GameEventType } from "../../../shared/enums";
import { ClientState } from "../ClientState";

type GameOverProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

const GameOver = ({ state, sendEvent }: GameOverProps): JSX.Element => {
  const handleNewGame = () => {
    sendEvent({ event: GameEventType.NEW_GAME, user: state.username });
  };

  return (
    <>
      <h2>The Game is Over!</h2>
      {state.thisPlayer.isHost && (
        <button type="button" onClick={handleNewGame}>
          Create New Game
        </button>
      )}
    </>
  );
};

export default GameOver;
