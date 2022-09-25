import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  heading: {
    textAlign: "center",
  },
});

const JoinGame = (): JSX.Element => {
  const classes = useStyles();

  return <h2 className={classes.heading}>Hello world!</h2>;
};

export default JoinGame;
