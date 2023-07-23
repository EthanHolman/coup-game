import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameActionMove, GameEventType } from "../../../shared/enums";
import { newGame } from "../../src/eventHandlers/newGame";
import { generateStateWithNPlayers } from "../testHelpers/stateGenerators";
import { assert } from "chai";
import * as module_addNewPlayer from "../../src/actions/addNewPlayer";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { SERVER_USERNAME } from "../../../shared/globals";

describe("newGame event handler", function () {
  let mock_addNewPlayer: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_addNewPlayer = Sinon.stub(
      module_addNewPlayer,
      "addNewPlayer"
    ).returns();
  });

  this.afterEach(function () {
    mock_addNewPlayer.restore();
  });

  it("should return new blank gamestate", function () {
    const oldState = generateStateWithNPlayers(3);
    oldState.currentPlayerId = 1;
    oldState.currentAction = {
      action: GameActionMove.ASSASSINATE,
      targetPlayer: "tester-1",
    };
    oldState.blockAction = {
      event: GameEventType.BLOCK_ACTION,
      user: "tester-1",
      data: { card: Card.CONTESSA },
    };
    oldState.exchangeCards = [Card.ASSASSIN];
    oldState.playerLosingCard = { player: "tester-1", reason: "idk just cuz" };

    const result = newGame(oldState, Sinon.stub());

    assert.strictEqual(result.currentPlayerId, 0);
    assert.isFalse(result.isPaused);
    assert.notStrictEqual(oldState.deck, result.deck);
    assert.isUndefined(result.currentAction);
    assert.isUndefined(result.blockAction);
    assert.isUndefined(result.playerLosingCard);
    assert.isUndefined(result.exchangeCards);
  });

  it("should add all existing connected players to new gamestate", function () {
    const oldState = new GameState();
    oldState.addPlayer(new Player("roger", [Card.AMBASSADOR, Card.DUKE]));
    oldState.addPlayer(new Player("kody", [Card.AMBASSADOR, Card.DUKE]));

    newGame(oldState, Sinon.stub());

    Sinon.assert.callCount(mock_addNewPlayer, 2);
    Sinon.assert.calledWithExactly(
      mock_addNewPlayer.getCall(0),
      Sinon.match.any,
      "roger"
    );
    Sinon.assert.calledWithExactly(
      mock_addNewPlayer.getCall(1),
      Sinon.match.any,
      "kody"
    );
  });

  it("should send newgame event to all users", function () {
    const oldState = generateStateWithNPlayers(3);
    const stub_messageAllFn = Sinon.stub();

    newGame(oldState, stub_messageAllFn);

    Sinon.assert.calledOnceWithExactly(stub_messageAllFn, {
      event: GameEventType.NEW_GAME,
      user: SERVER_USERNAME,
      data: {},
    });
  });
});
