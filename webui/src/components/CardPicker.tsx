import { Card } from "../../../shared/Card";

type CardPickerProps = {
  cards: Card[];
  onPickCard: (card: Card) => void;
};

const CardPicker = ({ cards, onPickCard }: CardPickerProps): JSX.Element => {
  return (
    <>
      {cards.map((card) => (
        <button type="button" key={card} onClick={() => onPickCard(card)}>
          {card}
        </button>
      ))}
    </>
  );
};

export default CardPicker;
