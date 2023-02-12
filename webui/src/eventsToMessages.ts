import { GameEventType } from "../../shared/enums";
import { GameEvent } from "../../shared/GameEvent";

export type UIMessage = {
  user: string;
  message: string;
};

export function eventToMessage({ event, user, data }: GameEvent): UIMessage {
  switch (event) {
    case GameEventType.ACCEPT_BLOCK:
      return { user, message: "I accept your block" };
    case GameEventType.BLOCK_ACTION:
      return { user, message: "I'm blocking your action" };
    case GameEventType.CHALLENGE_ACTION:
      return { user, message: "BS! I'm challenging your action." };
    case GameEventType.CHALLENGE_BLOCK:
      return { user, message: "BS! I'm challenging your block." };
    case GameEventType.CHOOSE_ACTION:
      return { user, message: "[CHOSE ACTION]" };
    case GameEventType.CONFIRM_ACTION:
      return { user, message: "[CONFIRM ACTION]" };
    case GameEventType.PAUSE_GAME:
      return { user, message: `I've paused the game: ${data?.reason}` };
    case GameEventType.PLAYER_DISCONNECT:
      return { user, message: "See ya! I'm leaving" };
    case GameEventType.PLAYER_JOIN_GAME:
      return { user, message: "Howdy, I've joined the game!" };
    case GameEventType.PLAYER_LOSE_CARD:
      return { user, message: "[PLAYER LOSE CARD]" };
    case GameEventType.PLAYER_REVEAL_CARD:
      return { user, message: "[REVEAL CARD]" };
    case GameEventType.RESUME_GAME:
      return { user, message: `I've resumed the game: ${data?.reason}` };
    case GameEventType.START_GAME:
      return { user, message: "The game is starting! Hope you're ready" };

    default:
      throw `${event} doesn't have an eventToMessage handler`;
  }
}
