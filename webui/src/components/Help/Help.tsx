import { Card } from "../../../../shared/Card";
import HelpCard from "./HelpCard";
import styles from "./Help.module.scss";

type HelpProps = {
  show: boolean;
  onClose: () => void;
};

const Help = (props: HelpProps) =>
  props.show ? (
    <div className={styles.container}>
      <header>
        <h1>How To Play Coup</h1>
        <button type="button" onClick={props.onClose}>
          Close
        </button>
      </header>
      <div className={styles.content}>
        <p>
          Coup is a card game of deception. The deck contains 3 copies of 5
          different characters.
          <br />
          <br />
          At the beginning of the game, each player is dealt 2 cards. These
          cards, face-down, determine the actions you may take on your turn, and
          what actions you may block.
          <br />
          <br />
          However, you can lie about which cards you actually have! Just don't
          get caught bluffing — if another player challenges your bluff, you'll
          be forced to reveal (lose) one of your cards!
          <br />
          <br />
          The game is over when only one player is left with an unrevealed card.
        </p>
        <h2>Actions:</h2>
        <HelpCard title="Tax" cardRequired={Card.DUKE} coins="+3" />
        <HelpCard
          title="Coup"
          coins="-7"
          description="Choose player to lose influence"
        />
        <HelpCard
          title="Assassinate"
          cardRequired={Card.ASSASSIN}
          coins="-3"
          blockedByCards={[Card.CONTESSA]}
          description="Choose player to lose influence"
        />
        <HelpCard title="Foreign Aid" coins="+2" blockedByCards={[Card.DUKE]} />
        <HelpCard
          title="Exchange"
          cardRequired={Card.AMBASSADOR}
          coins="0"
          description="Get new cards: exchange with deck"
        />
        <HelpCard title="Income" coins="+1" />
        <HelpCard
          title="Steal"
          cardRequired={Card.CAPTAIN}
          coins="up to +2"
          blockedByCards={[Card.CAPTAIN, Card.AMBASSADOR]}
          description="Steal coins from another player"
        />
      </div>
    </div>
  ) : (
    <></>
  );

export default Help;
