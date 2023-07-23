import { ClientState } from "../ClientState";
import { GameStatus } from "../../../shared/enums";
import styles from "./Header.module.scss";

type HeaderProps = {
  state: ClientState;
};

const Header = ({ state }: HeaderProps): JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.deckContainer}>
        {state.status !== GameStatus.PRE_GAME && (
          <>
            <div>Deck: {state.deckCount} Cards</div>
          </>
        )}
      </div>
      <h2 className={styles.title}>Coup Online</h2>
    </header>
  );
};

export default Header;
