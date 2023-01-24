import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {},
  messageBubble: {}
});

type EventViewerProps = {
  events: string[];
};

const EventViewer = ({ events }: EventViewerProps): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {events.map(event => (
        <div className={classes.messageBubble}>{event}</div>
      ))}
    </div>
  );
};

export default EventViewer;
