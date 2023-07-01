import { GameEvent } from "../../../../shared/GameEvent";
import { ClientState } from "../../ClientState";
import { getAvailableActions } from "../../getAvailableActions";
import { getTargetPlayers } from "../../getTargetPlayers";
import ActionPickerView from "./ActionPickerView";

/*  The goal of splitting ActionPicker and ActionPickerView is
    to keep state (ClientState) decoupled from the actual view
    and underlying view-related logic
*/

type ActionPickerProps = {
  state: ClientState;
  sendEvent: (event: GameEvent) => void;
};

const ActionPicker = ({ state, sendEvent }: ActionPickerProps): JSX.Element => {
  // TODO: memoize or something.. i can't remember how to do it right in react
  const availableActions = getAvailableActions(state);

  const targetPlayers = getTargetPlayers(state);

  return (
    <ActionPickerView
      availableActions={availableActions}
      targetPlayers={targetPlayers}
      username={state.username}
      sendEvent={sendEvent}
    />
  );
};

export default ActionPicker;
