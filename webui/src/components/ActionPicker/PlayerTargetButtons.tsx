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
      {players.map((player) => (
        <button type="button" key={player} onClick={() => onPickPlayer(player)}>
          {player}
        </button>
      ))}
    </>
  );
};

export default PlayerTargetButtons;
