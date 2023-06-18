import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { ClientPlayer } from "../../../shared/ClientGameState";

const useStyles = createUseStyles({
  container: {
    border: "1px solid #aaa",
    borderRadius: "5px",
    width: "10rem",
    height: "10rem",
  },
  thisPlayer: {},
  isCurrentPlayer: {
    border: "2px solid #0c6",
  },
  cardRevealed: {
    textDecoration: "line-through",
  },
});

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
  const classes = useStyles();

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
      {isYou ? <>You ({player.name})</> : player.name}
      <br />
      Coins: {player.coins}
      <br />
      Cards:{" "}
      {player.cards.map((x, i) => (
        <div key={i} className={x.isRevealed ? classes.cardRevealed : ""}>
          {x.card}
        </div>
      ))}
    </div>
  );
};

export default PlayerCard;
