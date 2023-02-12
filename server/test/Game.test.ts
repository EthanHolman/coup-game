import { assert } from "chai";
import Sinon from "sinon";
import { ALL_GAME_EVENT_TYPES, GameEventType } from "../../shared/enums";
import { ACTIONS_ALLOWED_WHILE_PAUSED, GameRunner } from "../src/Game";
import * as module_sendCurrentState from "../src/actions/sendCurrentState";
import * as module_playerJoinGame from "../src/eventHandlers/playerJoinGame";
import { generateStateWithNPlayers } from "./testHelpers/stateGenerators";

describe("gamerunner", function () {
  let mock_sendCurrentState: Sinon.SinonStub;
  let mock_playerJoinGame: Sinon.SinonStub;
  this.beforeEach(function () {
    mock_sendCurrentState = Sinon.stub(
      module_sendCurrentState,
      "sendCurrentState"
    ).returns();
    mock_playerJoinGame = Sinon.stub(
      module_playerJoinGame,
      "playerJoinGame"
    ).returns();
  });

  this.afterEach(function () {
    mock_sendCurrentState.restore();
    mock_playerJoinGame.restore();
  });

  it("should be creatable", function () {
    const runner = new GameRunner({
      messagePlayer: Sinon.fake(),
      messageAll: Sinon.fake(),
    });

    assert.isNotNull(runner);
    assert.isObject(runner);
  });

  it("should not allow most actions while game is paused", function () {
    const runner = new GameRunner({
      messagePlayer: Sinon.fake(),
      messageAll: Sinon.fake(),
    });

    runner._gameState.pause();

    const actionsNotAllowed = ALL_GAME_EVENT_TYPES.filter(
      (x) => !ACTIONS_ALLOWED_WHILE_PAUSED.includes(x)
    );

    actionsNotAllowed.forEach((event) => {
      assert.throws(function () {
        runner.onEvent({
          event,
          user: "doesntmatter",
        });
      }, "no actions are allowed until the game is unpaused");
    });
  });

  it("should send out state updates after each event is handled", function () {
    const messageAll = Sinon.fake();

    const runner = new GameRunner({
      messagePlayer: Sinon.fake(),
      messageAll,
    });

    runner._gameState = generateStateWithNPlayers(2);

    runner.onEvent({
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    });

    Sinon.assert.calledOnce(mock_sendCurrentState);
  });
});
