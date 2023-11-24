import { GameEventType } from "../../../shared/enums";
import { GameEvent } from "../../../shared/GameEvent";
import { ClientState } from "../ClientState";

export type StartGameProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

const StartGame = ({ state, sendEvent }: StartGameProps): JSX.Element => {
  const onStartGame = () => {
    sendEvent({ event: GameEventType.START_GAME, user: state.username });
  };

  return (
    <div>
      <p>
        Waiting for players to join. Game code is <b>{state.gameCode}</b>
      </p>
      {state.thisPlayer.isHost ? (
        <>
          {`Once everyone's ready, you can`}
          <button type="button" className="text" onClick={onStartGame}>
            Start the Game
          </button>
        </>
      ) : (
        <>{`Once everyone's ready, the host can start the game!`}</>
      )}
    </div>
  );
};

export default StartGame;
