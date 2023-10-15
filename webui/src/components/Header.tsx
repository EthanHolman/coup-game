import { ClientState } from "../ClientState";
import { GameStatus } from "../../../shared/enums";
import styles from "./Header.module.scss";
import Help from "./Help/Help";
import { useState } from "react";

type HeaderProps = {
  state: ClientState;
};

const Header = ({ state }: HeaderProps): JSX.Element => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <Help show={showHelp} onClose={() => setShowHelp(false)} />
      <header className={styles.header}>
        <div className={styles.deckContainer}>
          {state.status !== GameStatus.PRE_GAME && (
            <>
              <div>Deck: {state.deckCount} Cards</div>
            </>
          )}
        </div>
        <h2 className={styles.title}>Coup Online</h2>
        <button type="button" onClick={() => setShowHelp(true)}>
          ?
        </button>
      </header>
    </>
  );
};

export default Header;
