# Coup-Game

# About the Game

## The Deck

As part of game initialization, a deck of cards is created and shuffled. New players are dealt 2 cards and 2 coins upon joining the game. The deck is represented in memory as a list of card ids, with list[0] being the 'top of deck' and list[list.length] being the bottom of deck. Cards are drawn from top of deck, i.e., list[0]

## Game Flow

When a new game is initialized, players can join up until the max number of players is hit, or the game is started. When players connect, they will send their username as a unique identifier. If someone joins with a username that's already in use, they will be prompted to choose a new username. The game 'host' is the first person to join, and is the one who can start the game.

Once the game starts, players will take their turns in the order they joined (i.e., host goes first, then the 2nd player to join, and so on). Turns will continue until only one player is left in the game, at which point they are declared the WINNER!

For a turn, the current player chooses any action to take. If they choose an action for which they don't have the required card, they will be vulnerable to a challenge if someone calls their bluff. This action will be sent to all players. If the action is not 'Income' or 'Coup', other players will have the option to Challenge or Block it. If none of these counters are taken against the action, the current player will be allowed to take ("confirm") the action. A minimum of 5 seconds must pass before confirmation. After this, their turn is over -- onto the next player.

If a player starts the round with 10 coins, they must Coup another player.

More details on server's implementation around handing actions, challenges, and blocks can be found below under the "Server Action Handling" heading.

### Challenging an Action

If the original action taker HAS the required card for their action, the challenger will lose a card (see 'Losing a Card'), and the action will go through. Then, action taker will discard the required card and draw a new one from the deck.

If the original action taker DOES NOT have the required card, they must choose a card to lose (see 'Losing a Card'). Further, the action will not go through.

### Blocking an Action

If someone blocks an action, they must choose which card they are using to block. This block action will now replace the original action as the "current action". The block event will be sent to all players -- anyone can challenge it. After a minimum of 5 seconds, the blocker will be allowed to "confirm" the block.

- If the block is allowed/confirmed, nothing becomes of the entire turn (next player's turn)
- If the action is challenged, follow the same rules under "Challenging an Action". (IE, if someone blocks foreign aid as Duke but doesn't have the Duke, they lose a card)

### Losing a Card

Players can lose a card when they are Assassinated, Coup'ed, or if they incorrectly challenge another player's action. In any of these events, the player to lose a card becomes the 'current secondary player', and the game awaits them to choose a card to lose. If they only have one card remaining, they must choose that card.

After processing the card loss: if the player has no cards left (IE, they are all revealed), then the player is out of the game, and all players will be notified. If this leaves only one player in the game, all players will be notified of the WINNER!

## Actions

### Assassinate

Card: Assasin
Blocked By: Contessa
Coins: -3

Player chooses a target player to lose a card

### Coup

Card: n/a
Blocked By: n/a
Coins: -7

Player chooses a target player to lose a card

### Exchange

Card: Ambassador
Blocked By: n/a
Coins: 0

Player may draw two cards from the deck so they temporarily have four cards. They get to choose any two to keep, and discard the others to the bottom of the deck.

### Foreign Aid

Card: n/a
Blocked By: Duke
Coins: +2

### Income

Card: n/a
Blocked By: n/a
Coins: +1

### Steal

Card: Captain
Blocked By: Ambassador, Captain
Coins: +2 (up to)

Player chooses a target player from whom they steal up to 2 coins

### Tax

Card: Duke
Blocked By: n/a
Coins: +3

# Events & Connections

## Server events (broadcast to all):

All events include {event, data}. Fields noted below are members of the data object.

- playerJoined: {playerName, turnOrder, publicCards}
- START_GAME: {}
- CHOOSE_ACTION: {action, targetPlayer}
- CONFIRM_ACTION: {targetPlayer}
- passAction: {}
- revealCards: {playerName, card} // called after coup, challenging, assassination, etc
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
- CHOOSE_ACTION: {action, targetPlayer?}
- CONFIRM_ACTION: {}
- CHALLENGE_ACTION: {}
- BLOCK_ACTION: {blockAs: Card}
- PLAYER_LOSE_CARD: {card: Card}

## Internal Server Events:

These internal events occur between the websocket server and game server components

- PAUSE_GAME {reason}
- RESUME_GAME {reason}
- PLAYER_DISCONNECT {}
- PLAYER_RECONNECT {}

## Server Action Handling:

chooseAction event comes in, and is saved as `currentEvent`

`{event: chooseAction, user: someName, data: { action: assassinate, target: anotherName }`

Game is now waiting for one of the following events: [confirmAction, challenge, or block]:

- confirmAction: executes `currentEvent`
- challenge: does `currentEvent.user` have required card for `currentEvent.data.action`? yes ??? challenger loses card, execute `currentEvent`. no ??? `currentEvent.user` loses a card, end of turn
- block: save this event as `blockEvent`. Game is now waiting for one of the following events: [acceptBlock, challengeBlock]
  - acceptBlock: next turn. _this can be done only by who?_
  - challengeBlock: does `blockEvent.user` have `blockEvent.data.card`?
    - yes ??? `challengeBlockEvent.user` loses a card. block succeeds. end of turn.
    - no ??? `blockEvent.user` loses card, and execute `currentEvent`

## Clients losing connection:

If a client/player loses their connection before the game has started, they will be removed from the game and their cards re-added to the deck.
In the event any client/player loses their connection after the game has started, the game will enter a 'paused' state. The player will have the option to re-join the game using the same username. In case they can't reconnect, the game host will have the option to kick them from the game and resume gameplay. Kicking the player will mark them as 'online' again, and reveal all their cards -- rendering them 'out' of the game.

## Easter eggs

- Sound board
