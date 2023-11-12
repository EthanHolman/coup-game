import Sinon from "sinon";
import { InMemoryUserConnectionStore } from "../src/InMemoryUserConnectionStore";
import { assert } from "chai";
import {
  InvalidParameterError,
  PlayerAlreadyExistsError,
  PlayerNotExistsError,
  WebsocketAlreadyExistsError,
  WebsocketNotExistsError,
} from "../src/errors";

function getDummyWs() {
  return Sinon.stub() as any;
}

describe("InUserMemoryConnectionStore", function () {
  it("should allow adding users", function () {
    const dummyWs = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");
  });

  it("shouldn't allow adding user without user or gamecode", function () {
    const dummyWs = getDummyWs();
    const store = new InMemoryUserConnectionStore();

    assert.throws(
      () => store.addUser(dummyWs, "", "some-code"),
      InvalidParameterError
    );
    assert.throws(
      () => store.addUser(dummyWs, "user", ""),
      InvalidParameterError
    );
  });

  it("should throw exception when trying to add duplicate user or websocket", function () {
    const dummyWs = getDummyWs();
    const dummyWs2 = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");

    assert.throw(
      () => store.addUser(dummyWs, "ronald mcdonald", "asdf"),
      WebsocketAlreadyExistsError
    );

    assert.throw(
      () => store.addUser(dummyWs2, "tim horton", "sts9"),
      PlayerAlreadyExistsError
    );
  });

  it("should get users by their metadata", function () {
    const dummyWs = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");

    assert.strictEqual(
      store.getUserWebsocket({ user: "tim horton", gameCode: "sts9" }),
      dummyWs
    );
  });

  it("should throw exception if attempting to get non-existent user", function () {
    const dummyWs = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");

    assert.throw(
      () => store.getUserWebsocket({ user: "not there", gameCode: "sts9" }),
      PlayerNotExistsError
    );
  });

  it("should return user metadata based on websocket", function () {
    const dummyWs = getDummyWs();
    const dummyWs2 = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");
    store.addUser(dummyWs2, "tim horton", "blackmill");

    assert.deepStrictEqual(store.getByWebsocket(dummyWs), {
      user: "tim horton",
      gameCode: "sts9",
    });
  });

  it("should throw exception when trying to get user metadata w bad websocket", function () {
    const dummyWs = getDummyWs();
    const dummyWs2 = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");

    assert.throw(() => store.getByWebsocket(dummyWs2), WebsocketNotExistsError);
  });

  it("should only return valid users for a gamecode", function () {
    const dummyWs = getDummyWs();
    const dummyWs2 = getDummyWs();
    const dummyWs3 = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");
    store.addUser(dummyWs2, "tim horton", "blackmill");
    store.addUser(dummyWs3, "ronald mcdonald", "sts9");

    assert.sameDeepMembers(store.getGameCodeUserWebsockets("sts9"), [
      dummyWs,
      dummyWs3,
    ]);
    assert.sameDeepMembers(store.getGameCodeUserWebsockets("blackmill"), [
      dummyWs2,
    ]);
  });

  it("should remove websocket and user references when websocket closes", function () {
    const dummyWs = getDummyWs();
    const store = new InMemoryUserConnectionStore();
    store.addUser(dummyWs, "tim horton", "sts9");

    // sanity check
    assert.deepStrictEqual(store.getByWebsocket(dummyWs), {
      user: "tim horton",
      gameCode: "sts9",
    });

    store.handleWebsocketClose(dummyWs);

    assert.throw(() => store.getByWebsocket(dummyWs), WebsocketNotExistsError);
    assert.throw(
      () => store.getUserWebsocket({ user: "tim horton", gameCode: "sts9" }),
      PlayerNotExistsError
    );
  });
});
