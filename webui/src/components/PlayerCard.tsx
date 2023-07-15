import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { ClientPlayer } from "../../../shared/ClientGameState";
import { Card } from "../../../shared/Card";
import img_ambassador from "../../assets/ambassador.jpg";
import img_assassin from "../../assets/assassin.jpg";
import img_captain from "../../assets/captain.jpg";
import img_contessa from "../../assets/contessa.jpg";
import img_duke from "../../assets/duke.jpg";
import img_hidden_card from "../../assets/hidden_card.jpg";

function getCardImage(card: Card) {
  if (card === Card.AMBASSADOR) return img_ambassador;
  if (card === Card.ASSASSIN) return img_assassin;
  if (card === Card.CAPTAIN) return img_captain;
  if (card === Card.CONTESSA) return img_contessa;
  if (card === Card.DUKE) return img_duke;
  return img_hidden_card;
}

const useStyles = createUseStyles({
  container: {
    border: "1px solid #aaa",
    borderRadius: "5px",
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "row",
  },
  thisPlayer: {},
  isCurrentPlayer: {
    border: "2px solid #0c6",
  },
  playerDetails: {
    flex: 1,
  },
  card: {
    height: "72px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginLeft: "1rem",
    overflow: "hidden",

    "& > img": {
      height: "100%",
    },
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
      <div className={classes.playerDetails}>
        {isYou ? <>You ({player.name})</> : player.name}
        <br />
        Coins: {player.coins}
      </div>
      {player.cards.map((x, i) => (
        <div key={i} title={x.card} className={clsx(classes.card, {})}>
          <img src={getCardImage(x.card)} alt={x.card.toString()} />
        </div>
      ))}
    </div>
  );
};

export default PlayerCard;
