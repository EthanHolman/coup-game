import { PlayerAlreadyExistsError } from "../src/errors";

describe("errors", function () {
  it("PlayerAlreadyExistsError", function () {
    // exploratory test to ensure error handling works as expected
    try {
      throw new PlayerAlreadyExistsError("somePlayer");
    } catch (e) {
      if (!(e instanceof PlayerAlreadyExistsError))
        throw "expected error to be instanceof correct error class";
    }
  });
});
