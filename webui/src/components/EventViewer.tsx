import { createUseStyles } from "react-jss";
import { GameEvent } from "../../../shared/GameEvent";

const useStyles = createUseStyles({
  container: {},
  messageBubble: {},
});

type EventViewerProps = {
  events: GameEvent[];
};

const EventViewer = ({ events }: EventViewerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {events.map((event, index) => (
        <div className={classes.messageBubble} key={index}>
          {event.user}: {event.event} - {JSON.stringify(event.data)}
        </div>
      ))}
    </div>
  );
};

export default EventViewer;
