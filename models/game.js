let mongoose = require('mongoose')

let gameSchema = new mongoose.Schema({
  finished:   {type: Boolean, default: false},
  cancelled:  {type: Boolean, default: false},
  won:        {type: Boolean, default: false},
  lastPlayer: {type: Number, default: 0},
  nrOfPlays:  {type: Number, default: 0},
  plays:     [{type: mongoose.Schema.Types.ObjectId, ref: "Play"}],
  state:     [{type: mongoose.Schema.Types.ObjectId, ref: "Column"}]
})

module.exports = mongoose.model("Game", gameSchema)
