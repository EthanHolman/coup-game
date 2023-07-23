import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { UIMessage } from "../eventsToMessages";
import { ClientState } from "../ClientState";

const useStyles = createUseStyles({
  container: {
    flex: 1,
    padding: "1rem",
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "flex-start",
  },
  messageBubble: {
    marginBottom: "0.25rem",
    padding: "0.25rem",
    borderRadius: "10px",
    backgroundColor: "#c4c4c4",
  },
  selfMessage: {
    backgroundColor: "#6464df",
    color: "white",
    alignSelf: "flex-end",
  },
  errorMessage: {
    backgroundColor: "#d44",
    color: "white",
  },
});

type MessageViewerProps = {
  events: UIMessage[];
  state: ClientState;
};

const MessageViewer = ({ events, state }: MessageViewerProps): JSX.Element => {
  const classes = useStyles();

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
    </div>
  );
};

export default MessageViewer;
