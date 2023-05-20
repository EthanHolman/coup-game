import { ClientGameAction } from "../../getAvailableActions";

type ActionButtonsProps = {
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
      {availableActions.map((action) => (
        <button type="button" key={action} onClick={() => onPickAction(action)}>
          {action}
        </button>
      ))}
    </>
  );
};

export default ActionButtons;
