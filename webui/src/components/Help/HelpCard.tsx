import { Card } from "../../../../shared/Card";
import { getCardImage } from "../../getCardImage";
import styles from "./HelpCard.module.scss";

type HelpCardProps = {
  title: string;
  cardRequired?: Card;
  coins: string;
  blockedByCards?: Card[];
  description?: string;
};

const HelpCard = (props: HelpCardProps) => {
  return (
    <div className={styles.helpCard}>
      <img
        src={getCardImage(props.cardRequired ?? Card.HIDDEN_CARD)}
        alt={(props.cardRequired ?? Card.HIDDEN_CARD).toString()}
      />
      <div className={styles.details}>
        <h3>
          {props.title}
          {props.cardRequired && ` (${props.cardRequired.toString()})`}
        </h3>
        {props.description && <p>{props.description}</p>}
        <p>
          <b>Coins:</b> {props.coins}
          <br />
          {props.blockedByCards && (
            <span>
              <b>Blocked by:</b> {props.blockedByCards.join(", ")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default HelpCard;
