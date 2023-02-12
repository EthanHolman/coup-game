import { createUseStyles } from "react-jss";
import { ClientPlayer } from "../../../shared/ClientGameState";

const useStyles = createUseStyles({
  container: {
    border: "1px solid #aaa",
    borderRadius: "5px",
    width: "10rem",
    height: "5rem",
  },
});

export type PlayerCardProps = {
  player: ClientPlayer;
};

const PlayerCard = ({ player }: PlayerCardProps): JSX.Element => {
  const classes = useStyles();

  return <div className={classes.container}>{player.name}</div>;
};

export default PlayerCard;
