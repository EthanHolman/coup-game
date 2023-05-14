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
      {availableActions.map((action) => (
        <button type="button" key={action} onClick={() => onPickAction(action)}>
          {action}
        </button>
      ))}
    </>
  );
};

export default ActionButtons;
