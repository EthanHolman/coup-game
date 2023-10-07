import { useMemo, useState } from "react";
import { Card } from "../../../shared/Card";
import clsx from "clsx";
import styles from "./CardPicker.module.scss";

type IndexedCard = {
  card: Card;
  index: number;
};

type CardPickerProps = {
  cards: Card[];
  onPickCards: (card: Card[]) => void;
  selectCount: number;
};

const CardPicker = ({
  cards,
  onPickCards,
  selectCount,
}: CardPickerProps): JSX.Element => {
  const [selectedCards, setSelectedCards] = useState<IndexedCard[]>([]);

  const indexedCards = useMemo(() => {
    return cards.map((card, index) => ({ card, index }));
  }, [cards]);

  const onSelectCard = (card: IndexedCard) => {
    setSelectedCards((prevSelectedCards) => {
      const tempSelectedCards = [...prevSelectedCards];
      const index = tempSelectedCards.findIndex((x) => x.index === card.index);

      if (index === -1) tempSelectedCards.push(card);
      else tempSelectedCards.splice(index, 1);

      return tempSelectedCards;
    });
  };

  const onConfirm = () => {
    onPickCards(selectedCards.map((x) => x.card));
    setSelectedCards([]);
  };

  return (
    <>
      {indexedCards.map((card) => (
        <button
          type="button"
          key={card.index}
          onClick={() => onSelectCard(card)}
          className={clsx({ [styles.selected]: selectedCards.includes(card) })}
          disabled={
            selectedCards.length >= selectCount && !selectedCards.includes(card)
          }
        >
          {card.card}
        </button>
      ))}
      <button
        type="submit"
        onClick={onConfirm}
        disabled={selectedCards.length !== selectCount}
      >
        [Confirm]
      </button>
    </>
  );
};

export default CardPicker;
