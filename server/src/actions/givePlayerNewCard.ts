import { Card } from "../../../shared/Card";
import { GameState } from "../GameState";
import { Player } from "../Player";

export function givePlayerNewCard(
  { deck }: GameState,
  player: Player,
  oldCard: Card
) {
  const newCard = deck.drawCard(1)[0];
  player.replaceCard(oldCard, newCard);
  deck.discardCard(oldCard);

  // TODO: should alert player they recieved a new card
}
