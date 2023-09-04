import clsx from "clsx";
import { UIMessage, UIMessageType } from "../UIMessage";
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
      {events.map((event, index) =>
        event.type === UIMessageType.User ? (
          <div
            className={clsx([
              classes.message,
              classes.messageBubble,
              { [classes.selfMessage]: event.user === state.thisPlayer.name },
            ])}
            key={index}
          >
            {<span>{event.user}: </span>}
            {event.message}
          </div>
        ) : (
          <div
            className={clsx([
              classes.message,
              classes.alert,
              { [classes.alertError]: event.type === UIMessageType.Error },
            ])}
            key={index}
          >
            {event.message}
          </div>
        )
      )}
      {events.length === 0 && (
        <div className={classes.messageBubble}>Welcome to Coup Online!</div>
      )}
      <div ref={bottomEl}></div>
    </div>
  );
};

export default MessageViewer;
