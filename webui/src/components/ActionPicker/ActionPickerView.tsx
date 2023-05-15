import { useEffect, useState } from "react";
import { GameEvent } from "../../../../shared/GameEvent";
import {
  TARGETED_ACTIONS,
  ALL_GAME_ACTION_MOVES,
  ALL_GAME_EVENT_TYPES,
  GameEventType,
} from "../../../../shared/enums";
import { ClientGameAction } from "../../getAvailableActions";
import ActionButtons from "./ActionButtons";
import PlayerTargetButtons from "./PlayerTargetButtons";

type ActionPickerViewProps = {
  availableActions: ClientGameAction[];
  targetPlayers: string[];
  username: string;
  sendEvent: (event: GameEvent) => void;
};

enum ViewMode {
  Action,
  Player,
}

const ActionPickerView = ({
  availableActions,
  targetPlayers,
  username,
  sendEvent,
}: ActionPickerViewProps): JSX.Element => {
  const [viewMode, setViewMode] = useState(ViewMode.Action);
  const [action, setAction] = useState<any>();
  const [targetPlayer, setTargetPlayer] = useState<string>();

  const handleChooseAction = (action: any) => {
    setAction(action);
    if (TARGETED_ACTIONS.includes(action)) {
      setViewMode(ViewMode.Player);
    }
  };

  const onPickPlayer = (username: string) => setTargetPlayer(username);

  useEffect(() => {
    if (!action || (action && viewMode === ViewMode.Player && !targetPlayer))
      return;

    if (ALL_GAME_ACTION_MOVES.includes(action)) {
      sendEvent({
        event: GameEventType.CHOOSE_ACTION,
        user: username,
        data: {
          action,
          targetPlayer,
        },
      });
    } else if (ALL_GAME_EVENT_TYPES.includes(action)) {
      sendEvent({
        event: action as GameEventType,
        user: username,
      });
    } else
      console.warn(`[ActionPicker] action ${action} was not handled properly`);

    setAction(undefined);
    setViewMode(ViewMode.Action);
    setTargetPlayer(undefined);
  }, [action, targetPlayer]);

  return (
    <div role="toolbar">
      {availableActions.length > 0 && (
        <h2>
          {viewMode === ViewMode.Action
            ? "Choose an action"
            : "Choose a target"}
        </h2>
      )}
      {viewMode === ViewMode.Action && (
        <ActionButtons
          availableActions={availableActions}
          onPickAction={handleChooseAction}
        />
      )}
      {viewMode === ViewMode.Player && (
        <PlayerTargetButtons
          players={targetPlayers}
          onPickPlayer={onPickPlayer}
        />
      )}
    </div>
  );
};

export default ActionPickerView;
