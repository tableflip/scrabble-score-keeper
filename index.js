var boardScores = require('scrabble-board')()
var letterScores = require('scrabble-score').letterScores
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

var Direction = {
  Horizontal: 0,
  Vertical: 1
}

function Letter (char, x, y) {
  this.char = char
  this.x = x
  this.y = y
}

function Play (letters, points, player) {
  this.letters = letters
  this.points = points
  this.player = player
}

function Score (opts) {
  opts = opts || {}
  opts.points = opts.points || {}

  // Allows for custom boards and letter scores
  this._points = {
    board: opts.points.board || boardScores,
    letter: opts.points.letter || letterScores
  }

  // Create an empty played letters grid based on the board
  this._letters = this._points.board.slice().reduce(function (row, letters) {
    row.push(letters.map(function () { return null }))
    return row
  }, [])

  this._plays = []
}
inherits(Score, EventEmitter)

Score.prototype.play = function (letters, player) {
  if (!letters.length) throw new Error('You must play at least one letter')

  this._validateLetters(letters)

  // Infer direction
  var dir = Direction.Horizontal

  if (letters[1] && letters[0].x === letters[1].x) {
    dir = Direction.Vertical
  }

  var points = 0

  if (dir === Direction.Horizontal) {
    points = this._pointsHorizontal(letters)
  } else {
    points = this._pointsVertical(letters)
  }

  this._placeLetters(letters)

  var play = new Play(letters, points, player)

  this._plays.push(play)
  this.emit('play', play)

  return points
}

// Get the current score, optionally filtered by player
Score.prototype.score = function (player) {
  var points = 0

  for (var i = 0; i < this._plays.length; i++) {
    if (player) {
      if (player === this._plays[i].player) {
        points += this._plays[i].points
      }
    } else {
      points += this._plays[i].points
    }
  }

  return points
}

// Undo the last play
Score.prototype.undo = function () {
  if (!this._plays.length) return

  var play = this._plays.pop()

  play.letters.forEach(function (letter) {
    this._letters[letter.x][letter.y] = null
  }.bind(this))

  this.emit('undo', play)

  return play
}

Score.prototype._pointsHorizontal = function (letters) {
  var mainWord = this._getWord(letters[0].x, letters[0].y, Direction.Horizontal, letters)

  var otherWords = letters.reduce(function (words, letter) {
    var word = this._getWord(letter.x, letter.y, Direction.Vertical, letters)
    if (word) words.push(word)
    return words
  }.bind(this), [])

  var allWords = (mainWord ? [mainWord].concat(otherWords) : otherWords)

  // console.log(allWords)

  return allWords.reduce(function (points, word) {
    return points + this._wordPoints(word, letters)
  }.bind(this), 0)
}

Score.prototype._pointsVertical = function (letters) {
  var mainWord = this._getWord(letters[0].x, letters[0].y, Direction.Vertical, letters)

  var otherWords = letters.reduce(function (words, letter) {
    var word = this._getWord(letter.x, letter.y, Direction.Horizontal, letters)
    if (word) words.push(word)
    return words
  }.bind(this), [])

  var allWords = (mainWord ? [mainWord].concat(otherWords) : otherWords)

  // console.log(allWords)

  return allWords.reduce(function (points, word) {
    return points + this._wordPoints(word, letters)
  }.bind(this), 0)
}

// Get a word on the scrabble board comprised of existing board letters and new ones passed
Score.prototype._getWord = function (startX, startY, dir, letters) {
  var word = []
  var startLetter = this._findLetter(startX, startY, letters) || this._getLetter(startX, startY)
  var x = startLetter.x
  var y = startLetter.y
  var letter = null

  if (dir === Direction.Horizontal) {
    // Move left until we find a square with no letter
    while (this._findLetter(x - 1, y, letters) || this._getLetter(x - 1, y)) {
      startLetter = this._letters[x - 1][y]
      x--
    }

    // Move right until we find a square with no letter
    letter = startLetter

    while (letter) {
      word.push(letter)
      x++
      letter = this._findLetter(x, y, letters) || this._getLetter(x, y)
    }
  } else {
    // Move up until we find a square with no letter
    while (this._findLetter(x, y - 1, letters) || this._getLetter(x, y - 1)) {
      startLetter = this._letters[x][y - 1]
      y--
    }

    // Move down until we find a square with no letter
    letter = startLetter

    while (letter) {
      word.push(letter)
      y++
      letter = this._findLetter(x, y, letters) || this._getLetter(x, y)
    }
  }

  return word.length > 1 ? word : null
}

// Get an existing letter on the board
Score.prototype._getLetter = function (x, y) {
  if (x < 0 || x > this._letters.length - 1) return null
  if (y < 0 || y > this._letters[0].length - 1) return null
  return this._letters[x][y]
}

// Find a letter with the given coords in the list of letters
Score.prototype._findLetter = function (x, y, letters) {
  for (var i = 0; i < letters.length; i++) {
    if (x === letters[i].x && y === letters[i].y) return letters[i]
  }
}

Score.prototype._validateLetters = function (letters) {
  letters.forEach(function (letter) {
    if (letter.x < 0 || letter.x > this._letters.length) {
      throw new RangeError('Letter x coord is not on the board')
    }

    if (letter.y < 0 || letter.y > this._letters[0].length) {
      throw new RangeError('Letter y coord is not on the board')
    }

    var exists = this._letters[letter.x][letter.y]

    if (exists) {
      throw new Error('Letter space ' + letter.x + ',' + letter.y + ' is already taken')
    }
  }.bind(this))
}

Score.prototype._placeLetters = function (letters) {
  letters.forEach(function (letter) {
    this._letters[letter.x][letter.y] = letter
  }.bind(this))
}

Score.prototype._wordPoints = function (word, letters) {
  var points = 0
  var multipliers = []

  word.forEach(function (letter) {
    var boardPoints = this._points.board[letter.x][letter.y]

    // Only use multipliers if it is one of the letters we placed
    if (this._findLetter(letter.x, letter.y, letters)) {
      points += (this._points.letter[letter.char] * boardPoints.LS)
      multipliers.push(boardPoints.WS)
    } else {
      points += this._points.letter[letter.char]
    }
  }.bind(this))

  multipliers.forEach(function (multiplier) {
    points = points * multiplier
  })

  return points
}

module.exports = Score
module.exports.Score = Score
module.exports.Letter = Letter
