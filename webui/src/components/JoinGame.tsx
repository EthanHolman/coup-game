import { useState } from "react";
import img_cover from "../../assets/cover.jpg";
import styles from "./JoinGame.module.scss";

export type JoinGameProps = {
  onJoin: (username: string) => void;
  oldUsername: string;
};

const JoinGame = ({ onJoin, oldUsername }: JoinGameProps): JSX.Element => {
  const [username, setUsername] = useState(oldUsername ?? "");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value.replace(/[^A-Za-z0-9]/, ""));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onJoin(username);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Coup Online</h1>
      <form className={styles.joinForm} onSubmit={onSubmit}>
        <input
          type="text"
          value={username}
          onChange={onChange}
          placeholder="Your Name"
        />
        <button type="submit">Join The Game!</button>
      </form>
      <img
        src={img_cover}
        alt="Coup Game Cover Art"
        className={styles.coverArt}
      />
    </div>
  );
};

export default JoinGame;
