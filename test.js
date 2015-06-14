var test = require('tape')
var ScoreKeeper = require('./')

test('Should calculate correct score for horizontal word', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 2, y: 1},
    {char: 'I', x: 3, y: 1},
    {char: 'G', x: 4, y: 1}
  ])

  t.equal(points, 6)
  t.end()
})

test('Should calculate correct score for vertical word', function (t) {
  t.plan(1)

  var score = new ScoreKeeper()

  var points = score.play([
    {char: 'B', x: 1, y: 2},
    {char: 'I', x: 1, y: 3},
    {char: 'G', x: 1, y: 4}
  ])

  t.equal(points, 6)
  t.end()
})
