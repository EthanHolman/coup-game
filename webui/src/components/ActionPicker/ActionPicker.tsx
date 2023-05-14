import { useState } from "react";
import { GameEvent } from "../../../../shared/GameEvent";
import {
  ACTIONS_REQUIRING_TARGET_PLAYER,
  ALL_GAME_ACTION_MOVES,
  ALL_GAME_EVENT_TYPES,
  GameEventType,
} from "../../../../shared/enums";
import { ClientState } from "../../ClientState";
import { getAvailableActions } from "../../getAvailableActions";
import ActionButtons from "./ActionButtons";
import PlayerTargetButtons from "./PlayerTargetButtons";

type ActionPickerProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

enum ViewMode {
  Action,
  Player,
}

const ActionPicker = ({ state, sendEvent }: ActionPickerProps): JSX.Element => {
  const [viewMode, setViewMode] = useState(ViewMode.Action);
  const [action, setAction] = useState<any>();
  const [targetPlayer, setTargetPlayer] = useState<string>();

  // TODO: memoize or something.. i can't remember how to do it right in react
  const availableActions = getAvailableActions(state);

  const handleChooseAction = (action: any) => {
    setAction(action);
    if (ACTIONS_REQUIRING_TARGET_PLAYER.includes(action)) {
      setViewMode(ViewMode.Player);
    } else handleComplete();
  };

  const onPickPlayer = (username: string) => {
    setTargetPlayer(username);
    handleComplete();
  };

  const handleComplete = () => {
    if (ALL_GAME_ACTION_MOVES.includes(action)) {
      sendEvent({
        event: GameEventType.CHOOSE_ACTION,
        user: state.username,
        data: {
          action,
          targetPlayer,
        },
      });
    } else if (ALL_GAME_EVENT_TYPES.includes(action)) {
      sendEvent({
        event: action as GameEventType,
        user: state.username,
      });
    } else
      console.warn(`[ActionPicker] action ${action} was not handled properly`);

    setAction(undefined);
    setViewMode(ViewMode.Action);
    setTargetPlayer(undefined);
  };

  return (
    <div>
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
          players={state.players
            .map((x) => x.name)
            .filter((y) => y !== state.username)}
          onPickPlayer={onPickPlayer}
        />
      )}
    </div>
  );
};

export default ActionPicker;
