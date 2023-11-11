import { assert } from "chai";
import { InMemoryGameStateStore } from "../src/InMemoryGameStateStore";
import { Player } from "../src/Player";
import { Card } from "../../shared/Card";
import { GameState } from "../src/GameState";
import { GameStateNotFoundError, WrongGameCodeError } from "../src/errors";

describe("InMemoryGameStateStore", function () {
  it("should list all game codes", function () {
    const store = new InMemoryGameStateStore();
    const gs1 = store.createNewGame();
    const gs2 = store.createNewGame();

    const result = store.listGameCodes();
    assert.sameMembers(result, [gs1.gameCode, gs2.gameCode]);
  });

  it("should return state by gameCode", function () {
    const store = new InMemoryGameStateStore();
    const gs = store.createNewGame();

    const result = store.getState(gs.gameCode);
    assert.strictEqual(result.gameCode, gs.gameCode);
  });

  it("should allow updating an existing game code with new state", function () {
    const store = new InMemoryGameStateStore();
    const gs = store.createNewGame();

    const state = store.getState(gs.gameCode);
    state.addPlayer(new Player("bob", [Card.AMBASSADOR, Card.ASSASSIN], true));
    state.addPlayer(new Player("tim", [Card.AMBASSADOR, Card.ASSASSIN], false));
    state.deck.drawCard(1);
    state.start();

    const gs2 = new GameState(state.gameCode);

    const result = store.setState(state.gameCode, gs2);

    assert.lengthOf(result.players, 0);
    assert.strictEqual(result.gameCode, state.gameCode);

    const check = store.getState(state.gameCode);
    assert.lengthOf(check.players, 0);
    assert.strictEqual(check.gameCode, state.gameCode);
  });

  it("shouldn't allow updating gameState with incorrect gameState gameCode", function () {
    const store = new InMemoryGameStateStore();
    const gs1 = store.createNewGame();
    const gs2 = new GameState("not-same-code");

    assert.throw(() => store.setState(gs1.gameCode, gs2), WrongGameCodeError);
  });

  it("should throw exception if attempting to get invalid gamecode", function () {
    const store = new InMemoryGameStateStore();

    assert.throw(() => store.getState("doesntexist"), GameStateNotFoundError);
  });
});
