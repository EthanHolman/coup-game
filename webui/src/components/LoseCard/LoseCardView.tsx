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
  const handleLoseCard = (cards: Card[]) => {
    if (cards.length !== 1)
      throw `expecting 1 card in handleLoseCard, got ${cards.length} instead`;

    sendEvent({
      event: GameEventType.PLAYER_REVEAL_CARD,
      user: username,
      data: { card: cards[0] },
    });
  };

  return (
    <>
      <h2>Choose a card to lose:</h2>
      {reason && <p>Reason: {reason}</p>}
      <CardPicker
        cards={playerCards}
        onPickCards={handleLoseCard}
        selectCount={1}
      />
    </>
  );
};

export default LoseCardView;
