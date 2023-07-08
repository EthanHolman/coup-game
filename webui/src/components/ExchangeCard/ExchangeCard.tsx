import { Card } from "../../../../shared/Card";
import { GameEvent } from "../../../../shared/GameEvent";
import { GameEventType } from "../../../../shared/enums";
import { ClientState } from "../../ClientState";
import CardPicker from "../CardPicker";

type ExchangeCardProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

const ExchangeCard = ({ state, sendEvent }: ExchangeCardProps): JSX.Element => {
  const unrevealedCards = state.thisPlayer.cards.filter((x) => !x.isRevealed);
  const maxSelectable = unrevealedCards.length;

  const cards = [
    ...unrevealedCards.map((x) => x.card),
    ...state.exchangeCards!,
  ];

  const onPickCards = (cards: Card[]) => {
    sendEvent({
      event: GameEventType.EXCHANGE_CARDS,
      user: state.username,
      data: { exchangeKeeping: cards },
    });
  };

  return (
    <>
      <h2>Choose {maxSelectable} cards to keep</h2>
      <CardPicker
        cards={cards}
        onPickCards={onPickCards}
        selectCount={maxSelectable}
      />
    </>
  );
};

export default ExchangeCard;
