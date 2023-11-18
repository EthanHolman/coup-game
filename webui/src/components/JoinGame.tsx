import { useState } from "react";
import img_cover from "../../assets/cover.jpg";
import styles from "./JoinGame.module.scss";
import { USERNAME_NOT_ALLOWED_CHARS_REGEX } from "../../../shared/globals";
import Help from "./Help/Help";
import clsx from "clsx";
import { createNewGame } from "../api";

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
    createNewGame()
      .then((data) => {
        const gameCode = data["gameCode"];
        if (gameCode) {
          setGameCode(data["gameCode"]);
          setViewMode(ViewMode.NewGame);
        } else throw "Game code missing from API response";
      })
      .catch((e) => {
        console.error(e);
        alert("Error creating game");
      });
  };

  const onClickJoinGame = () => {
    setViewMode(ViewMode.JoinGame);
  };

  const backToDefault = () => {
    setViewMode(ViewMode.Default);
    setGameCode("");
  };

  const onSubmit = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) return;
    setUsername(trimmedUsername);
    onJoin(trimmedUsername, gameCode);
  };

  const disableJoinHostBtns = username.trim().length === 0;

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
          <div className={clsx(styles.content, styles.hostOrJoin)}>
            <input
              type="text"
              value={username}
              onChange={onChangeUsernameInput}
              placeholder="Your Name"
            />
            <button
              type="button"
              className="primary"
              disabled={disableJoinHostBtns}
              onClick={onClickJoinGame}
            >
              Join Game
            </button>
            <button
              type="button"
              className="primary"
              disabled={disableJoinHostBtns}
              onClick={onClickCreateNewGame}
            >
              Host New Game
            </button>
          </div>
        )}
        {viewMode === ViewMode.NewGame && (
          <div className={clsx(styles.content, styles.hostGame)}>
            <h2 className="text-center">{gameCode}</h2>
            <p>
              This is your new game code. Share it with your friends so they can
              join you!
            </p>
            <button type="button" className="primary" onClick={onSubmit}>
              Got it!
            </button>
          </div>
        )}
        {viewMode === ViewMode.JoinGame && (
          <div className={clsx(styles.content, styles.hostOrJoin)}>
            <input
              type="text"
              value={gameCode}
              onChange={onChangeGameCodeInput}
              placeholder="Game Code"
            />
            <button type="button" className="text" onClick={backToDefault}>
              Back
            </button>
            <button
              type="button"
              className="primary"
              disabled={gameCode.trim().length === 0}
              onClick={onSubmit}
            >
              Join Game
            </button>
          </div>
        )}
        <p>
          First time playing?&nbsp;
          <button
            type="button"
            className="text"
            onClick={() => setShowHelp(true)}
          >
            See the Rules
          </button>
        </p>
      </div>
    </>
  );
};

export default JoinGame;
