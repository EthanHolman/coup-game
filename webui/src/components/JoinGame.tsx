import { useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({});

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
      <p>Choose a username to begin</p>
      <input type="text" value={username} onChange={onChange} />
      <button type="button" onClick={onSubmit}>
        Join the game!
      </button>
      <p>If you were disconnected, use the same username to re-join</p>
    </>
  );
};

export default JoinGame;
