import { GameEvent } from "../../../../shared/GameEvent";
import { ClientState } from "../../ClientState";
import LoseCardView from "./LoseCardView";

type LoseCardProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

const LoseCard = ({ state, sendEvent }: LoseCardProps): JSX.Element => {
  const playerCards = state.thisPlayer.cards
    .filter((card) => !card.isRevealed)
    .map((card) => card.card);

  return (
    <LoseCardView
      playerCards={playerCards}
      username={state.username}
      reason={state.playerLosingCard?.reason}
      sendEvent={sendEvent}
    />
  );
};

export default LoseCard;
