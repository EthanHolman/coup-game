import clsx from "clsx";
import { ClientPlayer } from "../../../shared/ClientGameState";
import { Card } from "../../../shared/Card";
import classes from "./PlayerCard.module.scss";
import img_ambassador from "../../assets/ambassador.jpg";
import img_assassin from "../../assets/assassin.jpg";
import img_captain from "../../assets/captain.jpg";
import img_contessa from "../../assets/contessa.jpg";
import img_duke from "../../assets/duke.jpg";
import img_hidden_card from "../../assets/hidden_card.jpg";
import { PlayerCard as Type_PlayerCard } from "../../../shared/PlayerCard";

function getCardImage(card: Card) {
  if (card === Card.AMBASSADOR) return img_ambassador;
  if (card === Card.ASSASSIN) return img_assassin;
  if (card === Card.CAPTAIN) return img_captain;
  if (card === Card.CONTESSA) return img_contessa;
  if (card === Card.DUKE) return img_duke;
  return img_hidden_card;
}

function getCardTitle(card: Type_PlayerCard): string {
  return `${card.card.toString()}${card.isRevealed ? " (Revealed)" : ""}`;
}

export type PlayerCardProps = {
  player: ClientPlayer;
  isYou: boolean;
  isCurrentPlayer: boolean;
};

const PlayerCard = ({
  player,
  isYou,
  isCurrentPlayer,
}: PlayerCardProps): JSX.Element => {
  return (
    <div
      className={clsx([
        classes.container,
        {
          [classes.thisPlayer]: isYou,
          [classes.isCurrentPlayer]: isCurrentPlayer,
        },
      ])}
    >
      <div className={classes.playerDetails}>
        {isYou ? <>You ({player.name})</> : player.name}
        <br />
        Coins: {player.coins}
      </div>
      {player.cards.map((x, i) => (
        <div
          key={i}
          title={getCardTitle(x)}
          className={clsx(classes.card, { [classes.revealed]: x.isRevealed })}
        >
          <img src={getCardImage(x.card)} alt={getCardTitle(x)} />
        </div>
      ))}
    </div>
  );
};

export default PlayerCard;
