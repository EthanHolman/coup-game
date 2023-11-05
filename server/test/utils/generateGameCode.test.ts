import Sinon from "sinon";
import { generateGameCode } from "../../src/utils/generateGameCode";
import { assert } from "chai";

describe("generateGameCode util", function () {
  it("should call nanoid", function () {
    const result = generateGameCode();
    assert.isString(result);
    assert.lengthOf(result, 5);
  });
});
