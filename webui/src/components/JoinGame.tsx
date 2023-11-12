import { useState } from "react";
import img_cover from "../../assets/cover.jpg";
import styles from "./JoinGame.module.scss";
import { USERNAME_NOT_ALLOWED_CHARS_REGEX } from "../../../shared/globals";
import Help from "./Help/Help";
import settings from "../../settings";

export type JoinGameProps = {
  onJoin: (username: string, gameCode: string) => void;
  existingUsername: string;
};

enum ViewMode {
  Default,
  JoinGame,
  NewGame,
}

const JoinGame = ({ onJoin, existingUsername }: JoinGameProps): JSX.Element => {
  const [username, setUsername] = useState(existingUsername ?? "");
  const [viewMode, setViewMode] = useState(ViewMode.Default);
  const [gameCode, setGameCode] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const onChangeUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(
      event.target.value.replace(USERNAME_NOT_ALLOWED_CHARS_REGEX, "")
    );

  const onChangeGameCodeInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setGameCode(event.target.value);

  const onClickCreateNewGame = () => {
    try {
      fetch(`${settings.apiBaseUrl}/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) =>
        res.json().then((data) => {
          const gameCode = data["gameCode"];
          if (gameCode) {
            setGameCode(data["gameCode"]);
            setViewMode(ViewMode.NewGame);
          } else throw "Game code missing from API response";
        })
      );
    } catch (err) {
      console.error(err);
      alert("Error creating game");
    }
  };

  const onClickJoinGame = () => setViewMode(ViewMode.JoinGame);

  const onSubmit = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) return;
    setUsername(trimmedUsername);
    onJoin(trimmedUsername, gameCode);
  };

  return (
    <>
      <Help show={showHelp} onClose={() => setShowHelp(false)} />
      <div className={styles.container}>
        <img
          src={img_cover}
          alt="Coup Game Cover Art"
          className={styles.coverArt}
        />
        {viewMode === ViewMode.Default && (
          <div className={styles.hostOrJoin}>
            <input
              type="text"
              value={username}
              onChange={onChangeUsernameInput}
              placeholder="Your Name"
            />
            <button type="button" onClick={onClickJoinGame}>
              Join Game
            </button>
            <button type="button" onClick={onClickCreateNewGame}>
              Host New Game
            </button>
          </div>
        )}
        {viewMode === ViewMode.NewGame && (
          <div>
            <h3>{gameCode}</h3>
            <p>
              This is your new game code. Share it with your friends so they can
              join you!
            </p>
            <button type="button" onClick={onSubmit}>
              Got it!
            </button>
          </div>
        )}
        {viewMode === ViewMode.JoinGame && (
          <div>
            <input
              type="text"
              value={gameCode}
              onChange={onChangeGameCodeInput}
              placeholder="Game Code"
            />
            <button type="button" onClick={onSubmit}>
              Join Game
            </button>
          </div>
        )}
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
