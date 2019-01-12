let mongoose = require('mongoose')

let columnSchema = new mongoose.Schema({
  columnNumber: {type: Number, required: true},
  rows:         {type: Number, required: true},
  full:         {type: Boolean, default: false},
  player:       [Number]
})

module.exports = mongoose.model("Column", columnSchema)
