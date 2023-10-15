import { Card } from "../../shared/Card";

import img_ambassador from "../assets/ambassador.jpg";
import img_assassin from "../assets/assassin.jpg";
import img_captain from "../assets/captain.jpg";
import img_contessa from "../assets/contessa.jpg";
import img_duke from "../assets/duke.jpg";
import img_hidden_card from "../assets/hidden_card.jpg";

export function getCardImage(card: Card) {
  if (card === Card.AMBASSADOR) return img_ambassador;
  if (card === Card.ASSASSIN) return img_assassin;
  if (card === Card.CAPTAIN) return img_captain;
  if (card === Card.CONTESSA) return img_contessa;
  if (card === Card.DUKE) return img_duke;
  return img_hidden_card;
}
