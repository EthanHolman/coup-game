import clsx from "clsx";
import { createUseStyles } from "react-jss";
import { UIMessage } from "../eventsToMessages";
import { GameState } from "../GameState";

const useStyles = createUseStyles({
  container: {
    flex: 1,
    margin: "0.5rem 10rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  messageBubble: {
    margin: "0.5rem 0",
    padding: "0.5rem",
    borderRadius: "50px",
    backgroundColor: "#c4c4c4",
  },
  selfMessage: {
    backgroundColor: "#6464df",
    color: "white",
    alignSelf: "flex-end",
  },
});

type MessageViewerProps = {
  events: UIMessage[];
  state: GameState;
};

const MessageViewer = ({ events, state }: MessageViewerProps): JSX.Element => {
  const classes = useStyles();

  console.log({ [classes.container]: true });

  return (
    <div className={classes.container}>
      {!!state.thisPlayer &&
        events.map((event, index) => (
          <div
            className={clsx([
              classes.messageBubble,
              { [classes.selfMessage]: event.user === state.thisPlayer.name },
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
