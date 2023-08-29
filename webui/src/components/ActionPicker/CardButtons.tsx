import { Card } from "../../../../shared/Card";

export type CardButtonsProps = {
  cards: Card[];
  onPickCard: (card: Card) => void;
};

const CardButtons = ({ cards, onPickCard }: CardButtonsProps): JSX.Element => {
  return (
    <>
      <h2>Choose a card to block with:</h2>
      {cards.map((card) => (
        <button
          type="button"
          key={card.toString()}
          onClick={() => onPickCard(card)}
        >
          {card}
        </button>
      ))}
    </>
  );
};

export default CardButtons;
