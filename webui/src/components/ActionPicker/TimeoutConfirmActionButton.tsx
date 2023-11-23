import { useEffect, useRef, useState } from "react";
import { CONFIRM_TIMER_SEC } from "../../../../shared/globals";

type TimeoutConfirmActionButtonProps = {
  onClick: () => void;
};

const TimeoutConfirmActionButton = (
  props: TimeoutConfirmActionButtonProps
): JSX.Element => {
  const [timer, setTimer] = useState(CONFIRM_TIMER_SEC);
  const intervalId = useRef<number | undefined>();

  const endTimer = () => {
    clearInterval(intervalId.current);
    intervalId.current = undefined;
  };

  useEffect(() => {
    intervalId.current = window.setInterval(() => {
      setTimer((cur) => cur - 1);
    }, 1000);

    return () => {
      if (intervalId.current) endTimer();
    };
  }, []);

  useEffect(() => {
    if (timer <= 0) endTimer();
  }, [timer]);

  const isDisabled = timer > 0;

  return (
    <>
      <button type="button" disabled={isDisabled} onClick={props.onClick}>
        Confirm action
        {isDisabled && ` (${timer})`}
      </button>
    </>
  );
};

export default TimeoutConfirmActionButton;
