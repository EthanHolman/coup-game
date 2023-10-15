import clsx from "clsx";
import { ClientPlayer } from "../../../shared/ClientGameState";
import classes from "./PlayerCard.module.scss";
import { PlayerCard as Type_PlayerCard } from "../../../shared/PlayerCard";
import { getCardImage } from "../getCardImage";

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
