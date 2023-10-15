import { useState } from "react";
import img_cover from "../../assets/cover.jpg";
import styles from "./JoinGame.module.scss";
import { USERNAME_NOT_ALLOWED_CHARS_REGEX } from "../../../shared/globals";
import Help from "./Help/Help";

export type JoinGameProps = {
  onJoin: (username: string) => void;
  existingUsername: string;
};

const JoinGame = ({ onJoin, existingUsername }: JoinGameProps): JSX.Element => {
  const [username, setUsername] = useState(existingUsername ?? "");
  const [showHelp, setShowHelp] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(
      event.target.value.replace(USERNAME_NOT_ALLOWED_CHARS_REGEX, "")
    );
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) return;
    setUsername(trimmedUsername);
    onJoin(trimmedUsername);
  };

  return (
    <>
      <Help show={showHelp} onClose={() => setShowHelp(false)} />
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Coup Online</h1>
        <form className={styles.joinForm} onSubmit={onSubmit}>
          <input
            type="text"
            value={username}
            onChange={onChange}
            placeholder="Your Name"
          />
          <button type="submit" disabled={username.trim().length === 0}>
            Join The Game!
          </button>
        </form>
        <img
          src={img_cover}
          alt="Coup Game Cover Art"
          className={styles.coverArt}
        />
        <p>
          First time playing?&nbsp;
          <button type="button" onClick={() => setShowHelp(true)}>
            See the Rules
          </button>
        </p>
      </div>
    </>
  );
};

export default JoinGame;
