import { useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  heading: {
    textAlign: "center",
  },
});

export type JoinGameProps = {
  onJoin: (username: string) => void;
};

const JoinGame = ({ onJoin }: JoinGameProps): JSX.Element => {
  const classes = useStyles();

  const [username, setUsername] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value.replace(/[^A-Za-z0-9]/, ""));
  };

  const onSubmit = () => onJoin(username);

  return (
    <>
      <h2 className={classes.heading}>Welcome to Coup Online!</h2>
      <p>Choose a username to begin</p>
      <p>If you were disconnected, use the same username to re-join</p>
      <input type="text" value={username} onChange={onChange} />
      <button type="button" onClick={onSubmit}>
        Join the game!
      </button>
    </>
  );
};

export default JoinGame;
