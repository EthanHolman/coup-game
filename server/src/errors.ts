export class PlayerAlreadyExistsError extends Error {
  constructor(player = "") {
    super(player ? `${player} already exists` : "");
    this.name = "PlayerAlreadyExistsError";
    Object.setPrototypeOf(this, PlayerAlreadyExistsError.prototype);
  }
}

export class PlayerNotExistsError extends Error {
  constructor(player = "") {
    super(player ? `${player} does not exist` : "");
    this.name = "PlayerNotExistsError";
    Object.setPrototypeOf(this, PlayerNotExistsError.prototype);
  }
}

export class WebsocketNotExistsError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "WebsocketNotExistsError";
    Object.setPrototypeOf(this, WebsocketNotExistsError.prototype);
  }
}

export class WebsocketAlreadyExistsError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "WebsocketAlreadyExistsError";
    Object.setPrototypeOf(this, WebsocketAlreadyExistsError.prototype);
  }
}
export class GameStateNotFoundError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "GameStateNotFoundError";
    Object.setPrototypeOf(this, GameStateNotFoundError.prototype);
  }
}
