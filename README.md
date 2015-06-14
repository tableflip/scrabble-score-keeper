# scrabble-score-keeper

```js
var ScoreKeeper = require('scrabble-score-keeper')

var keeper = new ScoreKeeper()

var points = keeper.play([
  {char: 'B', x: 0, y: 0},
  {char: 'I', x: 1, y: 0},
  {char: 'G', x: 2, y: 0}
], 'Player1')

console.log('Points for word BIG: ', points)
```

## Options

### points.board

```js
new ScoreKeeper({
  points: {
    board: [
      [{LS: 1, WS: 3}, /* ... */],
      /* ... */
    ]
  }
})
```

An array of rows/columns representing the scrabble board. Each item is an object with letter/word scores in [scrabble-board](https://www.npmjs.com/package/scrabble-board) format.

### points.letter

```js
new ScoreKeeper({
  points: {
    letter: {
      A: 1,
      B: 2,
      /* ... */
    }
  }
})
```

An object with letter => points mapping.

## API

### `ScoreKeeper.play(letters[, player])`

Place an array of letters on the board. Letters Look like this:

```js
{char: 'A', x: 0, y, 0}
```

`char` is the letter to play, `x` is the column, `y` is the row.

It returns the total points for the letters played and will cause a `play` event to be emitted.

### `ScoreKeeper.undo()`

Undo the last play, returning details of the play that was undone. Play details look like:

```js
{letters: [{char: 'A', x: 0, y: 0}, /* ... */], points: 13, player: 'team1'}
```

It causes a `undo` event to be emitted.

### `ScoreKeeper.score([player])`

Get the total score, or the total score for a particular player if passed.

## Events

### play

```js
var ScoreKeeper = require('scrabble-score-keeper')
var keeper = new ScoreKeeper()

keeper.on('play', function (play) {
  console.log(play.player, 'played', play.letters, 'and scored', play.points, 'points')
})
```

The `play` event is emitted after a play has been made.

### undo

The `undo` event is emitted after the last play has been undone.
