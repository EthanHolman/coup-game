import { ALL_CARDS, Card } from "../../../../shared/Card";

type CardButtonsProps = {
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
          {Card[card]}
        </button>
      ))}
    </>
  );
};

export default CardButtons;