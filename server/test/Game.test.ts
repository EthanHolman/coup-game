import { assert } from "chai";
import Sinon from "sinon";
import { ALL_GAME_EVENT_TYPES, GameEventType } from "../../shared/enums";
import { ACTIONS_ALLOWED_WHILE_PAUSED, GameRunner } from "../src/Game";
import * as module_playerJoinGame from "../src/eventHandlers/playerJoinGame";
import { generateStateWithNPlayers } from "./testHelpers/stateGenerators";
import { IGameStateStore } from "../src/IGameStateStore";

describe("gamerunner", function () {
  let mock_playerJoinGame: Sinon.SinonStub;

  this.beforeEach(function () {
    mock_playerJoinGame = Sinon.stub(
      module_playerJoinGame,
      "playerJoinGame"
    ).returns();
  });

  this.afterEach(function () {
    mock_playerJoinGame.restore();
  });

  it("should be creatable", function () {
    const runner = new GameRunner({
      messagePlayer: Sinon.stub(),
      messageAll: Sinon.stub(),
      gameStateStore: Sinon.stub() as any,
      sendCurrentStateFn: Sinon.stub(),
    });

    assert.isNotNull(runner);
    assert.isObject(runner);
  });

  it("should not allow most actions while game is paused", function () {
    const state = generateStateWithNPlayers(2);
    state.pause();
    const gameStateStore = <IGameStateStore>{};
    gameStateStore.getState = Sinon.stub().returns(state);
    const runner = new GameRunner({
      messagePlayer: Sinon.stub(),
      messageAll: Sinon.stub(),
      gameStateStore,
      sendCurrentStateFn: Sinon.stub(),
    });

    const actionsNotAllowed = ALL_GAME_EVENT_TYPES.filter(
      (x) => !ACTIONS_ALLOWED_WHILE_PAUSED.includes(x)
    );

    actionsNotAllowed.forEach((event) => {
      assert.throws(function () {
        runner.onEvent("some-game-code", {
          event,
          user: "doesntmatter",
        });
      }, "no actions are allowed until the game is unpaused");
    });
  });

  it("should send out state updates to players after each event is handled", function () {
    const state = generateStateWithNPlayers(2);
    const gameStateStore = <IGameStateStore>{};
    gameStateStore.getState = Sinon.stub().returns(state);

    const sendCurrentStateFn = Sinon.stub();
    const messagePlayer = Sinon.stub();

    const runner = new GameRunner({
      messagePlayer,
      messageAll: Sinon.stub(),
      gameStateStore,
      sendCurrentStateFn,
    });

    runner.onEvent("some-game-code", {
      event: GameEventType.PLAYER_JOIN_GAME,
      user: "birdsarentreal",
    });

    Sinon.assert.calledOnceWithExactly(
      sendCurrentStateFn,
      state,
      messagePlayer
    );
  });
});
