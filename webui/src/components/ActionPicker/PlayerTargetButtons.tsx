type PlayerTargetButtonsProps = {
  players: string[];
  onPickPlayer: (username: string) => void;
};

const PlayerTargetButtons = ({
  players,
  onPickPlayer,
}: PlayerTargetButtonsProps): JSX.Element => {
  return (
    <>
      {players.length > 0 && <h2>Choose a target player:</h2>}
      {players.map((player) => (
        <button type="button" key={player} onClick={() => onPickPlayer(player)}>
          {player}
        </button>
      ))}
    </>
  );
};

export default PlayerTargetButtons;
