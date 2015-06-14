# scrabble-score-keeper

```js
var ScoreKeeper = require('scrabble-score-keeper')

var score = new ScoreKeeper()

var points = score.play([
  {char: 'B', x: 0, y: 0},
  {char: 'I', x: 1, y: 0},
  {char: 'G', x: 2, y: 0}
], 'Player1')

console.log('Points for word TABLEFLIP: ', points)
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

Place letters on the board. Letters Look like this:

```js
{char: 'A', x: 0, y, 0}
```

`char` is the letter to play, `x` is the column, `y` is the row.

### `ScoreKeeper.score([player])`

Get the total score, or the total score for a particular player if passed.

## Events

### play

```js
var ScoreKeeper = require('scrabble-score-keeper')
var score = new ScoreKeeper()

score.on('play', function (play) {
  conosle.log(play.player, 'played', play.letters, 'and scored', play.points, 'points')
})
```

The `play` event is emitted after a play has been made.