import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { ClientPlayer } from "../../../shared/ClientGameState";

const useStyles = createUseStyles({
  container: {
    border: "1px solid #aaa",
    borderRadius: "5px",
    width: "10rem",
    height: "5rem",
  },
  thisPlayer: {},
});

export type PlayerCardProps = {
  player: ClientPlayer;
  isYou: boolean;
};

const PlayerCard = ({ player, isYou }: PlayerCardProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={clsx([classes.container, { [classes.thisPlayer]: isYou }])}>
      {isYou ? <>You ({player.name})</> : player.name}
    </div>
  );
};

export default PlayerCard;
