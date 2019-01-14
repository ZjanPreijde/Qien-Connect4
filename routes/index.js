let express = require("express"),
    app     = express(),
    Game    = require('../models/game')

const Constants = require('../constants/constants')

// Does not work, check this out later, probably to do with scoping? Revisit
//let checkRequestBody = require('../validations/checkRequestBody')

let resultMsg = { action: 0, value: 0, player: 0,
      status: true, message: "", state: {} },
    errorMsg  = {} // error_message:"", error_id:0

const consoleLog = false,
   myLog = (line) => {if (consoleLog) {console.log(line)}}

myLog("===================")
// Catch all
app.get('*', (req, res) => {
  // Check request body
  myLog("-------------------")
  async function processRequest() {
    try {
      myLog('calling checkRequestBody()')
      // Check request body for missing/invalid values
      await checkRequestBody(req, res)
      myLog('after checkRequestBody()')

      if (resultMsg.status) {
        // Check request in game context
        myLog('calling checkRequest()')
        await checkRequest()
        myLog('after checkRequest()')
      }

      if (resultMsg.status) {
        // Honour request
        myLog('calling playRequest()')
        await playRequest()
        myLog('after playRequest()')
      }

      // Return response
      res.setHeader('Content-Type', 'application/json')
      res.send( JSON.stringify( { ...resultMsg, ...errorMsg } ) )
    }
    catch (error) {
      myLog(error)
    }
  }

  processRequest()
})

const checkRequestBody = (req, res) => {
  myLog("checkRequestBody() called ...")
  // Reset messages
  resultMsg = { action: 0, value: 0, player: 0,
    status: true, message: "", state: {} }
  errorMsg  = {}

  // Check Action
  if ( req.body.action === undefined ) {
    errorMsg = Constants.ERRACTIONUNDEF
    resultMsg.status = false
  } else if ( !Number.isInteger(req.body.action) ) {
    errorMsg = Constants.ERRACTIONNOINT
    errorMsg.error_message += " (" + req.body.action + ")"
    resultMsg.status = false
  } else if ( ![Constants.NEWGAME, Constants.CANCELGAME, Constants.PLAYGAME]
      .includes(req.body.action) ) {
    errorMsg = Constants.ERRACTIONOUTOB
    errorMsg.error_message += " (" + req.body.action + ")"
    resultMsg.status = false
  } else {
    resultMsg.action = req.body.action
  }

  // Check value if playing game
  if (resultMsg.status && resultMsg.action === Constants.PLAYGAME) {
    if ( req.body.value === undefined ) {
      errorMsg = Constants.ERRVALUEUNDEF
      resultMsg.status = false
    } else if ( !Number.isInteger(req.body.value) ) {
      errorMsg = Constants.ERRVALUENOINT
      errorMsg.error_message += " (" + req.body.value + ")"
      resultMsg.status = false
    } else if ( req.body.value < Constants.MINVALUE ||
        req.body.value > Constants.MAXVALUE ) {
      errorMsg = Constants.ERRVALUEOUTOB
      errorMsg.error_message += " (" + req.body.value + ")"
      resultMsg.status = false
    } else {
      resultMsg.value = req.body.value
    }
  }

  // Check player if playing game
  if (resultMsg.status && resultMsg.action === Constants.PLAYGAME) {
    if ( req.body.player === undefined ) {
      errorMsg = Constants.ERRPLAYERUNDEF
      resultMsg.status = false
    } else if ( !Number.isInteger(req.body.player) ) {
      errorMsg = Constants.ERRPLAYERNOINT
      errorMsg.error_message += " (" + req.body.player + ")"
      resultMsg.status = false
    } else if ( req.body.player < Constants.MINPLAYER
        || req.body.player > Constants.MAXPLAYER ) {
      errorMsg = Constants.ERRPLAYEROUTOB
      errorMsg.error_message += " (" + req.body.player + ")"
      resultMsg.status = false
    } else {
      resultMsg.player = req.body.player
    }
  }
  myLog("leaving checkRequestBody()")
  return [resultMsg, errorMsg]
}

async function checkRequest() {
  myLog("checkRequest() called ...")
  if (resultMsg.action === Constants.NEWGAME) {
    try {
      // This does not work!! Allows to create new game even if game is active.
      await Game.findOne({finished: false})
        .then( game => {
          if (!game === null) {
            resultMsg.status = false
            errorMsg = Constants.ERRNEWSTILLACTIVE
          }
          return game
        })
        .catch( err => {
          myLog("Error: ", err)
          resultMsg.status = false
          errorMsg = Constants.ERRNEWERROR2
          return err
        })
    } catch (err) {
      myLog("Error: ", err)
      resultMsg.status = false
      errorMsg = Constants.ERRNEWERROR2
      return err
    }
  }

  if (resultMsg.action === Constants.CANCELGAME) {
    try {
      await Game.findOne({finished: false})
        .then( game => {
          if (game === null) {
            resultMsg.status = false
            errorMsg = Constants.ERRCNCNOACTIVE
          }
          return game
        })
        .catch( err => {
          myLog("Error: ", err)
          resultMsg.status = false
          errorMsg = Constants.ERRCNCNOERROR2
          return err
        })
    } catch (err) {
      myLog("Error: ", err)
      resultMsg.status = false
      errorMsg = Constants.ERRCNCNOERROR1
      return err
    }
  }

  if (resultMsg.action === Constants.PLAYGAME) {
    try {
      await Game.findOne({finished: false})
        .then( game => {
          if (game === null) {
            resultMsg.status = false
            errorMsg = Constants.ERRPLAYNOACTIVE
          } else if (game.nrOfPlays === Constants.MAXNROFPLAYS ) {
            resultMsg.status = false
            errorMsg = Constants.ERRPLAYMAXREACHED
          } else if (game.lastPlayer === resultMsg.player) {
            resultMsg.status = false
            errorMsg = Constants.ERRPLAYSAMEPLAYER
          } else if (game.lastPlayer === 0 && resultMsg.player !== 1) {
            resultMsg.status = false
            errorMsg = Constants.ERRPLAYSTARTFIRST
          } else {
            let column = game.state.filter(
              ( col ) => col.columnNumber === resultMsg.value
            )
            // Why is this [0]?
            let moves = column[0].moves
            myLog(moves)
            if (moves.length >= 6) {
              resultMsg.status = false
              errorMsg = Constants.ERRPLAYCOLUMNFULL
            }
          }
        })
        .catch( err => {
          myLog("Error: ", err)
          resultMsg.status = false
          errorMsg = Constants.ERRPLAYERROR2
        })
    } catch (err) {
      myLog("Error: ", err)
      resultMsg.status = false
      errorMsg = Constants.ERRPLAYERROR1
    }
  }
}

async function playRequest() {
  myLog("playRequest() called ...")
  if (resultMsg.action === Constants.NEWGAME) {
    try {
      await newGame()
    } catch (err) {
      myLog("Error: ", err)
    }
    finally {
      myLog('leaving checkRequest()')
    }
  }
  if (resultMsg.action === Constants.CANCELGAME) {
    try {
      await cancelGame()
    } catch (err) {
      myLog("Error: ", err)
    }
  }
  if (resultMsg.action === Constants.PLAYGAME) {
    try {
      await playGame()
    } catch (err) {
      myLog("Error: ", err)
    }
  }

  myLog("leaving playRequest()")
}

async function newGame() {
  myLog('newGame() called ...')
  try {
    myLog("creating new game")
    await Game.deleteMany({}).exec()
    await Game.create({})
      .then( (newGame) => {
        let newColumns = [1,2,3,4,5,6,7].map( function(col) {
          return  { columnNumber: col, moves: [] }
        })
        newColumns.forEach( newColumn => {
           newGame.state.push(newColumn) }
        )
        newGame.save()
        resultMsg.message = "New game started"
        resultMsg.state   = newGame.state.map( function(col) {
          return col.moves
        })
        // resultMsg.stateParsed = newGame.state.map(function(col) {
        //   return "col " + col.columnNumber + ": "
        //     + col.moves.reduce(
        //         (acc, cur) => { acc + cur.toString() }
        //       , "")
        // })
      })
      .catch( (err) => {
        myLog(err)
        resultMsg.status = false
        errorMsg = { error_message: 'New game could not be created'
          , error_id: 302 }
      })
  }
  catch (err) {
    myLog("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'New game could not be created'
      , error_id: 301 }
  }
  finally {
    myLog('leaving newGame()')
    return
  }
}

async function cancelGame() {
  myLog('cancelGame() called ...')
  try {
    myLog("cancelling game")
    await Game.findOne({finished: false})
      .then( game => {
        game.set( { finished: true, cancelled: true } )
        game.save()
        resultMsg.message = "Game cancelled"
      })
      .catch( err => {
        myLog("Error:", err)
        resultMsg.status = false
        errorMsg = { error_message: 'Game could not be cancelled'
          , error_id: 304 }
      })
  }
  catch (err) {
    myLog("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'Game could not be cancelled'
      , error_id: 303 }
  }
  finally {
    myLog('leaving cancelGame()')
  }
}

async function playGame() {
  myLog('playGame() called ...')
  try {
    myLog("playing game")
    await Game.findOne({finished: false})
      .then( game => {
        game.lastPlayer = resultMsg.player
        game.nrOfPlays += 1
        if (game.nrOfPlays === Constants.MAXNROFPLAYS ) {
          game.finished = true
        }
        let column = game.state.filter(
          ( col ) => col.columnNumber === resultMsg.value
        )
        // Why is this [0]?
        column[0].moves.push(resultMsg.player)
        let newState = game.state
        let play = {
            player: resultMsg.player
          , column: resultMsg.value
          , state:  newState
          }
        game.plays.push(play)
        resultMsg.message     = "Game played"
        resultMsg.state       = game.state.map(function(col) {
          return col.moves
        })
        // resultMsg.stateParsed = game.state.map(function(col) {
        //   // col.moves.reduce() does not work here for CoreMongooseArray
        //   let movesString = ""
        //   for (i = 0; i < col.moves.length; i++) {
        //     movesString += col.moves[i].toString()
        //   }
        //   return "col " + col.columnNumber + ": " +  movesString
        // })
        return game
      })
      .then( game => {
        checkGame(game)
        game.save()
      })
      .catch( err => {
        myLog("Error:", err)
        resultMsg.status = false
        errorMsg = { error_message: 'Game could not be played'
          , error_id: 306 }
        return error
      })
  }
  catch (err) {
    myLog("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'Game could not be played'
      , error_id: 305 }
    myLog(errorMsg)
    return err
  }
  finally {
    myLog('leaving playGame()')
    return
  }
}

async function checkGame(game) {
  myLog('checkGame() called ...')
  try {
    let checkPlayer = game.lastPlayer

    // Check vertical
    let columns = []
    game.state.forEach(column => {
      columns.push(column.moves.reduce((acc, el) => acc += el.toString(), ""))
    })
    columns.forEach(vertical => {
      if (vertical.indexOf(checkPlayer.toString().repeat(4)) > -1 ) {
        game.finished = true
        game.won      = true
        resultMsg.message = "Game won by Player " + checkPlayer + "!"
      }
    })
    if (!game.finished) {
      // Check horizontal
    }
    if (!game.finished) {
      // Check diagonal
    }
  } catch (err) {
    myLog("Error:", err)
    resultMsg.status = false
    errorMsg = Constants.ERRCHKERROR1
  }
  finally {
    myLog('leaving checkGame()')
  }
}

module.exports = app
