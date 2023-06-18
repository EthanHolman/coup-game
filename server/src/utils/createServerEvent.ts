import { GameEventType } from "../../../shared/enums";
import { SERVER_USERNAME } from "../../../shared/globals";
import { GameEventData, GameEvent } from "../../../shared/GameEvent";

export function createServerEvent(
  event: GameEventType,
  data?: Partial<GameEventData>
): GameEvent {
  return {
    event,
    user: SERVER_USERNAME,
    data: data ?? {},
  };
}
