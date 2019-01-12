let express = require('express'),
    app     = express(),
    // Adding ip="http://localhost" to .listen()
    //  throws an error locally :-|
    ip      = process.env.IP   || "",
    port    = process.env.PORT || 3000

// Catch all
app.get('*', (req, res) => {
  res.send("Hi, welcome to Connect Four")
})

// Start server
app.listen(port, ip, () => {
  console.log('Server listening on port', port, ' ....')
})
