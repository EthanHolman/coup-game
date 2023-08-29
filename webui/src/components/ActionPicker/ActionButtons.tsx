import { ClientGameAction } from "../../getAvailableActions";
import { GameEventType } from "../../../../shared/enums";
import TimeoutConfirmActionButton from "./TimeoutConfirmActionButton";

export type ActionButtonsProps = {
  availableActions: ClientGameAction[];
  onPickAction: (action: ClientGameAction) => void;
};

const ActionButtons = ({
  availableActions,
  onPickAction,
}: ActionButtonsProps): JSX.Element => {
  return (
    <>
      {availableActions.length > 0 && <h2>Choose an action:</h2>}
      {availableActions.map((cga) =>
        cga.action === GameEventType.CONFIRM_ACTION && cga.timeout ? (
          <TimeoutConfirmActionButton
            key={cga.action}
            onClick={() => onPickAction(cga)}
          />
        ) : (
          <button
            type="button"
            key={cga.action}
            onClick={() => onPickAction(cga)}
          >
            {cga.action}
          </button>
        )
      )}
    </>
  );
};

export default ActionButtons;
