import { useEffect, useState } from "react";
import { GameEvent, GameEventData } from "../../../../shared/GameEvent";
import {
  TARGETED_ACTIONS,
  ALL_GAME_ACTION_MOVES,
  ALL_GAME_EVENT_TYPES,
  GameEventType,
} from "../../../../shared/enums";
import { ClientGameAction } from "../../getAvailableActions";
import ActionButtons from "./ActionButtons";
import PlayerTargetButtons from "./PlayerTargetButtons";
import CardButtons from "./CardButtons";
import { ALL_CARDS, Card } from "../../../../shared/Card";

type ActionPickerViewProps = {
  availableActions: ClientGameAction[];
  targetPlayers: string[];
  username: string;
  sendEvent: (event: GameEvent) => void;
};

enum ViewMode {
  Action,
  Player,
  Card,
}

const ActionPickerView = ({
  availableActions,
  targetPlayers,
  username,
  sendEvent,
}: ActionPickerViewProps): JSX.Element => {
  const [viewMode, setViewMode] = useState(ViewMode.Action);
  const [action, setAction] = useState<any>();
  const [targetPlayer, setTargetPlayer] = useState<string>();
  const [blockAsCard, setBlockAsCard] = useState<Card>();
  const [blockAsCardOptions, setBlockAsCardOptions] = useState<Card[]>([]);

  const handleChooseAction = (cga: ClientGameAction) => {
    setAction(cga.action);
    if (TARGETED_ACTIONS.includes(cga.action as any))
      setViewMode(ViewMode.Player);
    else if (cga.action === GameEventType.BLOCK_ACTION) {
      let tempCards = cga.blockAsCards;
      if (!tempCards) {
        tempCards = ALL_CARDS;
        console.error(`missing blockAsCards on ClientGameAction ${action}`);
      }

      if (tempCards.length > 1) {
        setBlockAsCardOptions(tempCards);
        setViewMode(ViewMode.Card);
      } else setBlockAsCard(tempCards[0]);
    }
  };

  const onPickPlayer = (username: string) => setTargetPlayer(username);

  const onPickCard = (card: Card) => setBlockAsCard(card);

  useEffect(() => {
    if (
      !action ||
      (action && viewMode === ViewMode.Player && !targetPlayer) ||
      (action && viewMode === ViewMode.Card && blockAsCard === undefined)
    )
      return;

    if (ALL_GAME_ACTION_MOVES.includes(action)) {
      sendEvent({
        event: GameEventType.CHOOSE_ACTION,
        user: username,
        data: {
          action,
          targetPlayer,
        },
      });
    } else if (ALL_GAME_EVENT_TYPES.includes(action)) {
      const data: Partial<GameEventData> = {};
      if (blockAsCard !== undefined) data["card"] = blockAsCard;

      sendEvent({
        event: action as GameEventType,
        user: username,
        data: data,
      });
    } else
      console.warn(`[ActionPicker] action ${action} was not handled properly`);

    setAction(undefined);
    setViewMode(ViewMode.Action);
    setTargetPlayer(undefined);
    setBlockAsCard(undefined);
    setBlockAsCardOptions(ALL_CARDS);
  }, [action, targetPlayer, blockAsCard]);

  return (
    <div role="toolbar">
      {viewMode === ViewMode.Action && (
        <ActionButtons
          availableActions={availableActions}
          onPickAction={handleChooseAction}
        />
      )}
      {viewMode === ViewMode.Player && (
        <PlayerTargetButtons
          players={targetPlayers}
          onPickPlayer={onPickPlayer}
        />
      )}
      {viewMode === ViewMode.Card && (
        <CardButtons cards={blockAsCardOptions} onPickCard={onPickCard} />
      )}
    </div>
  );
};

export default ActionPickerView;
