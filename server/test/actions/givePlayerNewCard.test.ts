import Sinon from "sinon";
import { Card } from "../../../shared/Card";
import { GameState } from "../../src/GameState";
import { Player } from "../../src/Player";
import { assert } from "chai";
import { givePlayerNewCard } from "../../src/actions/givePlayerNewCard";

describe("givePlayerNewCard action", function () {
  it("should call deck to get new card, trigger replacement on player, discard old card to deck", function () {
    const state = new GameState();
    state.addPlayer(
      new Player("tester-0", [Card.AMBASSADOR, Card.ASSASSIN], true)
    );
    state.addPlayer(new Player("tester-1", [Card.CONTESSA, Card.ASSASSIN]));
    state.start();
    const player = state.players[1];

    const fake_drawCard = Sinon.fake.returns([Card.AMBASSADOR]);
    Sinon.replace(state.deck, "drawCard", fake_drawCard);
    const fake_discardCard = Sinon.fake.returns(undefined);
    Sinon.replace(state.deck, "discardCard", fake_discardCard);

    givePlayerNewCard(state, player, Card.CONTESSA);

    assert.isTrue(state.players[1].hasCard(Card.AMBASSADOR));
    Sinon.assert.calledOnce(fake_drawCard);
    Sinon.assert.calledOnceWithExactly(fake_discardCard, Card.CONTESSA);
  });
});
