import { GameActionMove, GameEventType } from "../../shared/enums";
import { GameEvent, GameEventData } from "../../shared/GameEvent";
import { SERVER_USERNAME } from "../../shared/globals";

export type UIMessage = {
  user: string;
  message: string;
  isError?: boolean;
};

function getMsgChooseAction(data: Partial<GameEventData> | undefined): string {
  if (!data) throw `[getMsgChooseAction] data is missing: ${data}`;
  switch (data.action) {
    case GameActionMove.INCOME:
      return "I'm just taking income";
    case GameActionMove.COUP:
      return `${data.targetPlayer}, you're dead to me. I'm coup'ing you!`;
    case GameActionMove.FOREIGN_AID:
      return "I'm taking foreign aid";
    case GameActionMove.STEAL:
      return `I'm stealing! Hand 'em over, ${data.targetPlayer}!`;
    case GameActionMove.ASSASSINATE:
      return `${data.targetPlayer}, I'm assassinating you! Plz don't take it personally`;
    case GameActionMove.TAX:
      return "I'm totally the duke... gonna tax and take my 3...";
    case GameActionMove.EXCHANGE:
      return "I want new cards, so I'm going to exchange";
    default:
      return `${data.action}`;
  }
}

export function eventToMessage({
  event,
  user,
  data,
  error,
}: GameEvent): UIMessage {
  if (error) return { user: "[Error]", message: error, isError: true };

  if (user === SERVER_USERNAME) user = "Server";

  switch (event) {
    case GameEventType.ACCEPT_BLOCK:
      return { user, message: "I accept your block" };
    case GameEventType.BLOCK_ACTION:
      return { user, message: `I'm blocking with ${data?.card}` };
    case GameEventType.CHALLENGE_ACTION:
      return { user, message: "BS! I'm challenging your action." };
    case GameEventType.CHALLENGE_BLOCK:
      return { user, message: "BS! I'm challenging your block." };
    case GameEventType.CHOOSE_ACTION:
      return { user, message: getMsgChooseAction(data) };
    case GameEventType.CONFIRM_ACTION:
      return { user, message: "[CONFIRM ACTION]" };
    case GameEventType.PAUSE_GAME:
      return { user, message: `I've paused the game: ${data?.reason}` };
    case GameEventType.PLAYER_DISCONNECT:
      return { user, message: "See ya! I'm leaving" };
    case GameEventType.PLAYER_JOIN_GAME:
      return { user, message: "Howdy, I've joined the game!" };
    case GameEventType.PLAYER_LOSE_CARD:
      return {
        user,
        message: `${data?.targetPlayer} must chose a card to reveal, because ${data?.reason}.`,
      };
    case GameEventType.PLAYER_REVEAL_CARD:
      return { user, message: `I have revealed my ${data?.card}.` };
    case GameEventType.RESUME_GAME:
      return { user, message: `I've resumed the game: ${data?.reason}` };
    case GameEventType.START_GAME:
      return { user, message: "The game is starting! Hope you're ready" };

    default:
      const message = `${event} doesn't have an eventToMessage handler`;
      console.warn(message);
      return { user: "[UI]", message, isError: true };
  }
}
