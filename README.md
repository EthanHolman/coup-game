# Coup-Game

## Game flow overview (from a server perspective)

### Pre-Game

When a new game is initialized, players can join up until the max number of players is hit, or the game is started. When players connect, they will send their username as a unique identifier. If someone joins with a username that's already in use, they will be prompted to choose a new username. The game 'host' is the first person to join, and is the one who can start the game.

Once the game starts, players will take their turns in the order they joined (i.e., host goes first, then the 2nd player to join, and so on). Turns will continue until only one player is left in the game, at which point they are declared the WINNER!

### The Deck

As part of game initialization, a deck of cards is created and shuffled. New players are dealt 2 cards and 2 coins upon joining the game. The deck is represented in memory as a list of card ids, with list[0] being the 'top of deck' and list.length being the bottom of deck. Cards are drawn from top of deck, i.e., list[0]

### A Turn

Current player proposes an action to take. They may choose any action, but if they don't have the card required for an action, they will be vulnerable if someone calls their bluff. If their action is not 'Income' or 'Coup', their action proposal will be sent to all other players -- who will have the option to 'allow' or 'call BS' on this action. If the action is blockable, a 'block' option will also be available. If the action is allowed to go thru, the player will be allowed to take the action after waiting a minimum of 5 seconds. After this, their turn is over.

#### Calling BS on an Action

If someone calls BS on an action, the action will not occur, and someone will end up losing a card. After this, the turn is over:

- If the action taker has the required card for the proposed action, the BS caller will choose a card to lose.
- If the action taker doesn't have the required card, they must choose a card to lose.

#### Blocking an Action

If someone blocks an action, they must choose which card they are using to block. This block action will now replace the original action as the "current action". The block event will be sent to all the players, and just like a regular action, the block can be 'allowed' or 'call BS'.

- If the block is allowed, nothing becomes of the entire turn
- If the action is challenged, follow the same rules under "Calling BS on an Action"

#### Losing a Card

Players can lose a card when they are Assassinated, Coup'ed, or if they incorrectly call BS on another player's action. In any of these events, the player to lose a card becomes the 'current secondary player', and the game awaits them to chose a card to lose. If they only have one card remaining, they are out of the game immediately. x` x

### Available Actions

#### Assassinate

Card: Assasin
Player may choose a target player to lose a card. This action will cost the player 3 coins. Can be blocked by a contessa.

#### Coup

Card: n/a
Player chooses a target player to lose a card. This action cannot be blocked. It costs 7 coins.

#### Exchange

Card: Ambassador
Player may draw two cards from the deck so they temporarily have four cards. They get to choose any two to keep, and discard the others to the bottom of the deck.

#### Foreign Aid

Card: n/a
Player receives 2 coins. Blocked by Duke.

#### Income

Card: n/a
Player takes the safe route. They receive 1 coin. Cannot be blocked.

#### Steal

Card: Captain
Player chooses a target player from whom they steal 2 coins. Blocked by Ambassador and Captain.

#### Tax

Card: Duke
Player receives 3 coins.

## Server events (broadcast to all):

All events include {event, data}. Fields noted below are members of the data object.

- playerJoined: {playerName, turnOrder, publicCards}
- START_GAME: {}
- PROPOSE_ACTION: {action, targetPlayer}
- CONFIRM_ACTION: {targetPlayer}
- passAction: {}
- callBSResult: {accuser, wasCorrect}
- revealCards: {playerName, card} // called after coup, calling BS, assassination, etc
- nextTurn: {currentPlayerName}
- PLAYER_DISCONNECT {} if received during pre-game, clients should delete player from state, as said player has left
- PLAYER_RECONNECT {}

## Server events (broadcast to single player):

All events include {event, data}. Fields noted below are members of the data object.

- PLAYER_LOSE_CARD: {}
- WELCOME: {playerNames} used during pre-game to update clients on the list of players
- GAME_PAUSED: {}

## Client events:

All events include {event, user, data}. Fields noted below are members of the data object.

- PLAYER_JOIN_GAME: {}
- PROPOSE_ACTION: {action, targetPlayer}
- CONFIRM_ACTION: {action, targetPlayer}
- CALL_BS: {}
- BLOCK_ACTION: {blockAs: Card}
- PLAYER_LOSE_CARD: {card: Card}

## Internal Server Events:

These internal events occur between the websocket server and game server components

- PAUSE_GAME {reason}
- RESUME_GAME {reason}
- PLAYER_DISCONNECT {}
- PLAYER_RECONNECT {}

## Clients losing connection:

If a client/player loses their connection before the game has started, they will be removed from the game and their cards re-added to the deck.
In the event any client/player loses their connection after the game has started, the game will enter a 'paused' state. The player will have the option to re-join the game using the same username. In case they can't reconnect, the game host will have the option to kick them from the game and resume gameplay. Kicking the player will mark them as 'online' again, and reveal all their cards -- rendering them 'out' of the game.

## Easter eggs

- Sound board
