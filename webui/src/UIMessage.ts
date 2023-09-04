import { GameActionMove, GameEventType } from "../../shared/enums";
import { GameEvent, GameEventData } from "../../shared/GameEvent";
import { SERVER_USERNAME } from "../../shared/globals";

export enum UIMessageType {
  User,
  Server,
  Error,
}

export class UIMessage {
  user: string;
  message: string;
  type: UIMessageType;

  constructor(event: GameEvent) {
    this.user = event.user;
    this.message = this.getMessageForEvent(event);

    if (!!event.error) {
      this.type = UIMessageType.Error;
      this.message = event.error;
    } else if (event.user === SERVER_USERNAME) this.type = UIMessageType.Server;
    else this.type = UIMessageType.User;
  }

  getMessageForEvent({ event, data }: GameEvent): string {
    switch (event) {
      case GameEventType.ACCEPT_BLOCK:
        return "I accept your block";
      case GameEventType.BLOCK_ACTION:
        return `I'm blocking with ${data?.card}`;
      case GameEventType.CHALLENGE_ACTION:
        return "BS! I'm challenging your action.";
      case GameEventType.CHALLENGE_BLOCK:
        return "BS! I'm challenging your block.";
      case GameEventType.CHOOSE_ACTION:
        return this.getMsgChooseAction(data);
      case GameEventType.CONFIRM_ACTION:
        return "I'm confirming the action";
      case GameEventType.PAUSE_GAME:
        return `Game Paused: ${data?.reason}`;
      case GameEventType.PLAYER_DISCONNECT:
        return "See ya! I'm leaving";
      case GameEventType.PLAYER_JOIN_GAME:
        return "Howdy, I've joined the game!";
      case GameEventType.PLAYER_LOSE_CARD:
        return `${data?.targetPlayer} must chose a card to reveal, because ${data?.reason}.`;
      case GameEventType.PLAYER_REVEAL_CARD:
        return `I have revealed my ${data?.card}.`;
      case GameEventType.RESUME_GAME:
        return `Game Resumed: ${data?.reason}`;
      case GameEventType.START_GAME:
        return "The game is starting! Hope you're ready";
      case GameEventType.PLAYER_OUT:
        return `${data?.name} is out of the game.`;
      case GameEventType.GAME_OVER:
        return `The game is over! ${data?.name} is the winner!`;
      case GameEventType.NEXT_TURN:
        return `Now it's ${data?.name}'s turn`;
      case GameEventType.EXCHANGE_CARDS:
        return `My exchange is done!`;

      default:
        return `${event} doesn't have a handler`;
    }
  }

  getMsgChooseAction(data: Partial<GameEventData> | undefined): string {
    if (!data) throw `[getMsgChooseAction] data is missing: ${data}`;
    switch (data.action) {
      case GameActionMove.INCOME:
        return "I'm just taking income";
      case GameActionMove.COUP:
        return `${data.targetPlayer}, you're dead to me. I want to coup you!`;
      case GameActionMove.FOREIGN_AID:
        return "I would like to take foreign aid";
      case GameActionMove.STEAL:
        return `I would like to steal from ${data.targetPlayer}!`;
      case GameActionMove.ASSASSINATE:
        return `${data.targetPlayer}, I want to assassinate you. Plz don't take it personally.`;
      case GameActionMove.TAX:
        return "I would like to tax! (Totally the duke)";
      case GameActionMove.EXCHANGE:
        return "I want new cards, so I'd like to exchange.";
      default:
        return `${data.action}`;
    }
  }
}
