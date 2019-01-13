let mongoose = require('mongoose')

let gameSchema = new mongoose.Schema({
  finished:   {type: Boolean, default: false},
  cancelled:  {type: Boolean, default: false},
  won:        {type: Boolean, default: false},
  lastPlayer: {type: Number, default: 0},
  nrOfPlays:  {type: Number, default: 0},
  plays: [{ 
    player: {type: Number, required: true},
    column: {type: Number, required: true},
    state: [{
      columnNumber: {type: Number, required: true},
      moves:        [Number]
    }]
  }],
  state: [{
    columnNumber: {type: Number, required: true},
    moves:        [Number]
  }]
})

module.exports = mongoose.model("Game", gameSchema)
