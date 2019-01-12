let express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    Game     = require('./models/game'),
    Column   = require('./models/column'),
    Play     = require('./models/play'),
    // Adding ip="http://localhost" to .listen()
    //  throws an error locally :-|
    ip       = process.env.IP   || "",
    port     = process.env.PORT || 3000

let dbUrl = 'mongodb://localhost:27017/connect_four'
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then( (db) => {
    console.log('connected to ', dbUrl)
    startServer()
  })
  .catch( (err) => {
    console.log('error connecting to', dbUrl)
    console.log(err)
  })

// Start server
const startServer = () => {
  // Catch all
  app.get('*', (req, res) => {
    res.send("Hi, welcome to Connect Four")
  })
  app.listen(port, ip, () => {
    console.log('Server listening on port', port, ' ....')
  })
}
