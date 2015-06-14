var test = require('tape')
var ScoreKeeper = require('./')

test('Should calculate correct score for horizontal word', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 2, y: 1}, // 3
    {char: 'I', x: 3, y: 1}, // 1
    {char: 'G', x: 4, y: 1} // 2
  ])

  t.equal(points, 6)
  t.end()
})

test('Should calculate correct score for vertical word', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 1, y: 2}, // 3
    {char: 'I', x: 1, y: 3}, // 1
    {char: 'G', x: 1, y: 4} // 2
  ])

  t.equal(points, 6)
  t.end()
})

test('Should calculate correct score with double letter multiplier', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 3, y: 0}, // 3 & double letter
    {char: 'I', x: 4, y: 0}, // 1
    {char: 'G', x: 5, y: 0} // 2
  ])

  t.equal(points, 9)
  t.end()
})

test('Should calculate correct score with triple letter multiplier', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 5, y: 1}, // 3 & triple letter
    {char: 'I', x: 6, y: 1}, // 1
    {char: 'G', x: 7, y: 1} // 2
  ])

  t.equal(points, 12)
  t.end()
})

test('Should calculate correct score with double word multiplier', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 1, y: 1}, // 3 & double word
    {char: 'I', x: 2, y: 1}, // 1
    {char: 'G', x: 3, y: 1} // 2
  ])

  t.equal(points, 12)
  t.end()
})

test('Should calculate correct score with triple word multiplier', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 0, y: 0}, // 3 & triple word
    {char: 'I', x: 1, y: 0}, // 1
    {char: 'G', x: 2, y: 0} // 2
  ])

  t.equal(points, 18)
  t.end()
})

test('Should apply letter multipliers before word multipliers', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
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

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'T', x: 5, y: 7}, // 1
    {char: 'A', x: 6, y: 7}, // 1
    {char: 'B', x: 7, y: 7}, // 3 & double word
    {char: 'L', x: 8, y: 7}, // 1
    {char: 'E', x: 9, y: 7} // 1
  ])

  t.equal(points, 14)

  points = score.play([
    {char: 'F', x: 8, y: 6}, // 4 & double letter
    {char: 'I', x: 8, y: 8}, // 1 & double letter
    {char: 'P', x: 8, y: 9} // 3
  ])

  t.equal(points, 14)

  t.end()
})
