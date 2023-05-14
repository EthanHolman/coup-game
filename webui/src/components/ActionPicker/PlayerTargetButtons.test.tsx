import { render } from "@testing-library/react"
import PlayerTargetButtons from "./PlayerTargetButtons"

describe("PlayerTargetButtons component", function() {
    it ("should trigger callback when user btn is clicked", function() {
        const players = ["test1", "test2"]
        const mockPickPlayer = // add sinon
        render(<PlayerTargetButtons players={players} onPickPlayer={})
    })
})