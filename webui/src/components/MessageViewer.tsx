import clsx from "clsx";
import { UIMessage } from "../eventsToMessages";
import { ClientState } from "../ClientState";
import classes from "./MessageViewer.module.scss";
import { useEffect, useMemo, useRef } from "react";

type MessageViewerProps = {
  events: UIMessage[];
  state: ClientState;
};

const MessageViewer = ({ events, state }: MessageViewerProps): JSX.Element => {
  const bottomEl = useRef<HTMLDivElement>(null);

  const eventsCount = useMemo(() => events.length, [events]);

  useEffect(() => {
    bottomEl.current?.scrollIntoView({ behavior: "smooth" });
  }, [eventsCount]);

  return (
    <div className={classes.container}>
      {!!state.thisPlayer &&
        events.map((event, index) => (
          <div
            className={clsx([
              classes.messageBubble,
              { [classes.selfMessage]: event.user === state.thisPlayer.name },
              { [classes.errorMessage]: event.isError },
            ])}
            key={index}
          >
            {event.user !== state.thisPlayer.name && <>{event.user}: </>}
            {event.message}
          </div>
        ))}
      {events.length === 0 && (
        <div className={classes.messageBubble}>Welcome to Coup Online!</div>
      )}
      <div ref={bottomEl}></div>
    </div>
  );
};

export default MessageViewer;
