let express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    // Adding ip="http://localhost" to .listen()
    //  throws an error locally :-|
    ip       = process.env.IP   || "",
    port     = process.env.PORT || 3000

// Check whether DB is available
const dbUrl = process.env.DBNAME || 'mongodb://localhost:27017/connect_four'
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then( (db) => {
    console.log('connected to ', dbUrl)
    startServer()
  })
  .catch( (err) => {
    console.log('error connecting to', dbUrl)
    console.log(err)
  })

// Middleware
app.use(express.json())

// Routes
let routes = require('./routes/index')
app.use('/', routes)

// Start server
const startServer = () => {
  app.listen(port, ip, () => {
    console.log('Server listening on port', port, ' ....')
  })
}
