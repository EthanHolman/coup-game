import { ALL_CARDS, Card } from "../../../../shared/Card";

export type CardButtonsProps = {
  onPickCard: (card: Card) => void;
};

const CardButtons = ({ onPickCard }: CardButtonsProps): JSX.Element => {
  return (
    <>
      <h2>Choose a card to block with:</h2>
      {ALL_CARDS.map((card) => (
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
