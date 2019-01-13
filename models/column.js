let mongoose = require('mongoose')

let columnSchema = new mongoose.Schema({
  columnNumber: {type: Number, required: true},
  moves:        [Number]
})

module.exports = mongoose.model("Column", columnSchema)
