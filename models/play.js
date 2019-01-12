let mongoose = require('mongoose')

let playSchema = new mongoose.Schema({
  player: {type: Number, required: true},
  column: {type: Number, required: true},
  state: [{type: mongoose.Schema.Types.ObjectId, ref: "Column"}]
})

module.exports = mongoose.model("Play", playSchema)
