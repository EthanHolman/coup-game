import { ClientGameAction, GameEventOrAction } from "../../getAvailableActions";
import { GameEventType } from "../../../../shared/enums";
import TimeoutConfirmActionButton from "./TimeoutConfirmActionButton";

export type ActionButtonsProps = {
  availableActions: ClientGameAction[];
  onPickAction: (action: GameEventOrAction) => void;
};

const ActionButtons = ({
  availableActions,
  onPickAction,
}: ActionButtonsProps): JSX.Element => {
  return (
    <>
      {availableActions.length > 0 && <h2>Choose an action:</h2>}
      {availableActions.map(({ action, timeout }) =>
        action === GameEventType.CONFIRM_ACTION && timeout ? (
          <TimeoutConfirmActionButton
            key={action}
            onClick={() => onPickAction(action)}
          />
        ) : (
          <button
            type="button"
            key={action}
            onClick={() => onPickAction(action)}
          >
            {action}
          </button>
        )
      )}
    </>
  );
};

export default ActionButtons;
