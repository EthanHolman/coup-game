import { createUseStyles } from "react-jss";
import { ClientState } from "../ClientState";
import { GameStatus } from "../../../shared/enums";

const useStyles = createUseStyles({
  header: { display: "flex", backgroundColor: "#ddd", padding: "1rem" },
  title: { margin: 0 },
  deckContainer: { flexGrow: 1 },
});

type HeaderProps = {
  state: ClientState;
};

const Header = ({ state }: HeaderProps): JSX.Element => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <div className={classes.deckContainer}>
        {state.status !== GameStatus.PRE_GAME && (
          <>
            <div>DECK SIZE</div>
            <div>{state.deckCount}</div>
          </>
        )}
      </div>
      <h2 className={classes.title}>Coup Online</h2>
    </header>
  );
};

export default Header;
