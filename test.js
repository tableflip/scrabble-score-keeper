var test = require('tape')
var ScoreKeeper = require('./')

test('Should calculate correct score for horizontal word', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 2, y: 1}, // 3
    {char: 'I', x: 3, y: 1}, // 1
    {char: 'G', x: 4, y: 1} // 2
  ])

  t.equal(points, 6)
  t.end()
})

test('Should calculate correct score for vertical word', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 1, y: 2}, // 3
    {char: 'I', x: 1, y: 3}, // 1
    {char: 'G', x: 1, y: 4} // 2
  ])

  t.equal(points, 6)
  t.end()
})

test('Should calculate correct score with double letter multiplier', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 3, y: 0}, // 3 & double letter
    {char: 'I', x: 4, y: 0}, // 1
    {char: 'G', x: 5, y: 0} // 2
  ])

  t.equal(points, 9)
  t.end()
})

test('Should calculate correct score with triple letter multiplier', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 5, y: 1}, // 3 & triple letter
    {char: 'I', x: 6, y: 1}, // 1
    {char: 'G', x: 7, y: 1} // 2
  ])

  t.equal(points, 12)
  t.end()
})

test('Should calculate correct score with double word multiplier', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 1, y: 1}, // 3 & double word
    {char: 'I', x: 2, y: 1}, // 1
    {char: 'G', x: 3, y: 1} // 2
  ])

  t.equal(points, 12)
  t.end()
})

test('Should calculate correct score with triple word multiplier', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'B', x: 0, y: 0}, // 3 & triple word
    {char: 'I', x: 1, y: 0}, // 1
    {char: 'G', x: 2, y: 0} // 2
  ])

  t.equal(points, 18)
  t.end()
})

test('Should apply letter multipliers before word multipliers', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'F', x: 0, y: 0}, // 4 & triple word
    {char: 'L', x: 1, y: 0}, // 1
    {char: 'I', x: 2, y: 0}, // 1
    {char: 'P', x: 3, y: 0} // 3 & double letter
  ])

  t.equal(points, 36)
  t.end()
})

test('Should calculate correct score for second play', function (t) {
  t.plan(2)

  var keeper = new ScoreKeeper()

  var points = keeper.play([
    {char: 'T', x: 5, y: 7}, // 1
    {char: 'A', x: 6, y: 7}, // 1
    {char: 'B', x: 7, y: 7}, // 3 & double word
    {char: 'L', x: 8, y: 7}, // 1
    {char: 'E', x: 9, y: 7} // 1
  ])

  t.equal(points, 14)

  points = keeper.play([
    {char: 'F', x: 8, y: 6}, // 4 & double letter
    {char: 'I', x: 8, y: 8}, // 1 & double letter
    {char: 'P', x: 8, y: 9} // 3
  ])

  t.equal(points, 14)

  t.end()
})

test('Should store scores per player', function (t) {
  t.plan(3)

  var keeper = new ScoreKeeper()

  keeper.play([
    {char: 'B', x: 0, y: 0}, // 3 & triple word
    {char: 'I', x: 1, y: 0}, // 1
    {char: 'G', x: 2, y: 0} // 2
  ], 'player1')

  keeper.play([
    {char: 'A', x: 0, y: 1}, // 1
    {char: 'P', x: 0, y: 2} // 3
  ], 'player2')

  t.equal(keeper.score(), 25)
  t.equal(keeper.score('player1'), 18)
  t.equal(keeper.score('player2'), 7)

  t.end()
})

test('Should not allow two letters to be placed in the same space', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  t.throws(function () {
    keeper.play([{char: 'A', x: 0, y: 0}])
    keeper.play([{char: 'A', x: 0, y: 0}])
  })

  t.end()
})

test('Should count other words aside from main word', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  keeper.play([
    {char: 'M', x: 0, y: 1}, // 3
    {char: 'A', x: 0, y: 2}, // 1
    {char: 'D', x: 0, y: 3} // 2 & double letter
  ])

  var points = keeper.play([
    {char: 'S', x: 1, y: 2}, // 1
    {char: 'O', x: 1, y: 3}, // 1
    {char: 'N', x: 1, y: 4} // 1
  ])

  // SON, AS, DO
  t.equal(points, 8)

  t.end()
})

test('Should not count multipliers that are not on tiles we placed', function (t) {
  t.plan(1)

  var keeper = new ScoreKeeper()

  keeper.play([
    {char: 'M', x: 0, y: 1}, // 3
    {char: 'A', x: 0, y: 2}, // 1
    {char: 'D', x: 0, y: 3} // 2 & double letter
  ])

  var points = keeper.play([
    {char: 'O', x: 1, y: 3}, // 1
    {char: 'G', x: 2, y: 3} // 2
  ])

  t.equal(points, 5)

  t.end()
})

test('Should be able to undo the last play', function (t) {
  t.plan(3)

  var keeper = new ScoreKeeper()

  keeper.play([
    {char: 'M', x: 0, y: 1}, // 3
    {char: 'A', x: 0, y: 2}, // 1
    {char: 'D', x: 0, y: 3} // 2 & double letter
  ])

  var play = keeper.undo()

  t.equal(play.points, 8)
  t.equal(play.letters.map(function (l) { return l.char }).join(''), 'MAD')

  // Should be allowed to play new letters in the same places
  t.doesNotThrow(function () {
    keeper.play([
      {char: 'D', x: 0, y: 1}, // 2
      {char: 'A', x: 0, y: 2}, // 1
      {char: 'D', x: 0, y: 3} // 2 & double letter
    ])
  })

  t.end()
})
