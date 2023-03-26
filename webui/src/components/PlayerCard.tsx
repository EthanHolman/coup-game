import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { Card } from "../../../shared/Card";
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
      Cards: {player.cards.map((card) => Card[card]).join(", ")}
    </div>
  );
};

export default PlayerCard;
