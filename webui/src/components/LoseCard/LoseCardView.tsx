import { Card } from "../../../../shared/Card";
import { GameEvent } from "../../../../shared/GameEvent";
import { GameEventType } from "../../../../shared/enums";
import CardPicker from "../CardPicker";

type LoseCardViewProps = {
  playerCards: Card[];
  username: string;
  reason?: string;
  sendEvent: (event: GameEvent) => void;
};

const LoseCardView = ({
  playerCards,
  username,
  reason,
  sendEvent,
}: LoseCardViewProps): JSX.Element => {
  const handleLoseCard = (card: Card) => {
    sendEvent({
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: username,
      data: { card },
    });
  };

  return (
    <>
      <h2>Choose a card to lose:</h2>
      {reason && <p>Reason: {reason}</p>}
      <CardPicker cards={playerCards} onPickCard={handleLoseCard} />
    </>
  );
};

export default LoseCardView;
