let express  = require("express"),
    app      = express(),
    mongoose = require('mongoose'),
    Game     = require('../models/game'),
    Column   = require('../models/column'),
    Play     = require('../models/play')

// check this out later, probably to do with scoping or async? Revisit
//let checkRequestBody = require('../validations/checkRequestBody')

let resultMsg = { action: 0, value: 0, player: 0,
      status: true, message: "", state: {} },
    errorMsg  = {} // error_message:"", error_id:0

console.log("===================")
// Catch all
app.get('*', (req, res) => {
  // Check reqeuest body
  console.log("-------------------")
  async function processRequest() {
    try {
      console.log('calling checkRequestBody()')
      await checkRequestBody(req, res)
      console.log('after checkRequestBody()')
      // let [result, error] =
      if (resultMsg.status) {
        console.log('calling checkRequest()')
        await checkRequest()
        console.log('after checkRequest()')
      }
      if (resultMsg.status) {
        console.log('calling playRequest()')
        await playRequest()
        console.log('after playRequest()')
      }

      // Temp
      errorMsg = { ...errorMsg, reqBody: req.body }

      // Return response
      res.setHeader('Content-Type', 'application/json')
      res.send( JSON.stringify( { ...resultMsg, ...errorMsg } ) )
    }
    catch (error) {
      console.log(error)
    }
  }

  processRequest()
})

async function newGame() {
  console.log('newGame() called ...')
  try {
    console.log("creating new game")
    await Game.deleteMany({}).exec()
    await Game.create({})
      .then( (newGame) => {
        let newColumns = [1,2,3,4,5,6,7].map( function(col) {
          return new Column( { columnNumber: col, moves: [] } )
        })
        newColumns.forEach( newColumn => {
           newGame.state.push(newColumn) }
        )
        newGame.save()
        resultMsg.message = "New game started"
        resultMsg.state   = newGame.state.map(function(col) {
          return "col " + col.columnNumber + ": "
            + col.moves.reduce(
                (acc, cur) => { acc + cur.toString() }
              , "")
        })
        // return newGame
      })
      .catch( (err) => {
        console.log(err)
        resultMsg.status = false
        errorMsg = { error_message: 'New game could not be created'
          , error_id: 302 }
        // return err
      })
  }
  catch (err) {
    console.log("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'New game could not be created'
      , error_id: 301 }
    // return error
  }
  finally {
    console.log('leaving newGame()')
    return
  }
}

async function cancelGame() {
  console.log('cancelGame() called ...')
  try {
    console.log("cancelling game")
    await Game.findOne({finished: false})
      .then( game => {
        game.set( { finished: true, cancelled: true } )
        game.save()
        resultMsg.message = "Game cancelled"
      })
      .catch( err => {
        console.log("Error:", err)
        resultMsg.status = false
        errorMsg = { error_message: 'Game could not be cancelled'
          , error_id: 304 }
        return error
      })
  }
  catch (err) {
    console.log("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'Game could not be cancelled'
      , error_id: 303 }
    console.log(errorMsg)
    return err
  }
  finally {
    console.log('leaving cancelGame()')
    return
  }
}

async function playGame() {
  console.log('playGame() called ...')
  try {
    console.log("playing game")
    await Game.findOne({finished: false})
      .then( game => {
        let col = game.state.filter(
          ( col ) => col.columnNumber === resultMsg.value
        )
        col.push(resultMsg.value)
        let state = game.state
        let play = new Play({
            player: resultMsg.player
          , column: resultMsg.value
          , state:  state
          })
        game.plays.push(play)
        game.save()
        resultMsg.message = "Game played"
        resultMsg.state   = game.state.map(function(col) {
          return "col " + col.columnNumber + ": "
            + col.moves.reduce(
                (acc, cur) => { acc + cur.toString() }
              , "")
              })
      })
      .catch( err => {
        console.log("Error:", err)
        resultMsg.status = false
        errorMsg = { error_message: 'Game could not be played'
          , error_id: 306 }
        return error
      })
  }
  catch (err) {
    console.log("Error:", err)
    resultMsg.status = false
    errorMsg = { error_message: 'Game could not be played'
      , error_id: 305 }
    console.log(errorMsg)
    return err
  }
  finally {
    console.log('leaving cancelGame()')
    return
  }
}

async function playRequest() {
  console.log("playRequest() called ...")
  const NEWGAME    = 1
  const CANCELGAME = 2
  const PLAYGAME   = 3

  if (resultMsg.action === NEWGAME) {
    try {
      await newGame()
    } catch (err) {
      console.log("Error: ", err)
    }
    finally {
      console.log('leaving checkRequest()')
    }
  }
  if (resultMsg.action === CANCELGAME) {
    try {
      await cancelGame()
    } catch (err) {
      console.log("Error: ", err)
    }
  }
  if (resultMsg.action === PLAYGAME) {
    try {
      await playGame()
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  console.log("leaving playRequest()")
}

async function checkRequest() {
  console.log("checkRequest() called ...")

  const NEWGAME    = 1
  const CANCELGAME = 2
  const PLAYGAME   = 3

  if (resultMsg.action === NEWGAME) {
    try {
      await Game.findOne({finished: false})
        .then( game => {
          if (!game === null) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'Still an active game, new game not created'
              , error_id: 203 }
          }
          return game
        })
        .catch( err => {
          console.log("Error: ", err)
          resultMsg.status = false
          errorMsg = {
              error_message: 'Error creating new game'
            , error_id: 202 }
          return err
        })
    } catch (err) {
      console.log("Error: ", err)
      resultMsg.status = false
      errorMsg = {
          error_message: 'Error creating new game'
        , error_id: 201 }
      return err
    }
  }

  if (resultMsg.action === CANCELGAME) {
    try {
      await Game.findOne({finished: false})
        .then( game => {
          if (game === null) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'No active game, nothing to cancel'
              , error_id: 213 }
          }
          return game
        })
        .catch( err => {
          console.log("Error: ", err)
          resultMsg.status = false
          errorMsg = {
              error_message: 'Error searching for game'
            , error_id: 212 }
          return err
        })
    } catch (err) {
      console.log("Error: ", err)
      resultMsg.status = false
      errorMsg = {
          error_message: 'Error searching for game'
        , error_id: 211 }
      return err
    }
  }

  if (resultMsg.action === PLAYGAME) {
    try {
      await Game.findOne({finished: false})
        .then( game => {
          console.log(game)
          if (game === null) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'No active game, no play possible'
              , error_id: 223 }
          } else if (game.nrOfPlays === 42 /* MAXNROFPLAYS */) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'Maximum nr of plays reached'
              , error_id: 224 }
          } else if (game.lastPlayer === resultMsg.player) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'No 2 consecutive plays by same player'
              , error_id: 225 }
          } else if (game.lastPlayer === 0 && resultMsg.player === 2) {
            resultMsg.status = false
            errorMsg = {
                error_message: 'Game must be started by player 1'
              , error_id: 226 }
          } else {
            let column = game.state.filter(
              ( col ) => col.columnNumber === 1 //resultMsg.value
            )
            game.state.forEach( column =>  console.log(column.columnNumber) )
            console.log("state", game.state)
            console.log("column", column)
            console.log("moves", column.moves)
            resultMsg.status = false

            // let moves = column.moves
            // if (column.moves.length() >= 6) {
            //   resultMsg.status = false
            //   errorMsg = {
            //       error_message: 'Column is full'
            //     , error_id: 227 }
            // }
          }
        })
        .catch( err => {
          console.log("Error: ", err)
          resultMsg.status = false
          errorMsg = {
              error_message: 'Error searching for game'
            , error_id: 222 }
        })
    } catch (err) {
      console.log("Error: ", err)
      resultMsg.status = false
      errorMsg = {
          error_message: 'Error searching for game'
        , error_id: 221 }
      return err
    }
  }
}

const checkRequestBody = (req, res) => {
  console.log("checkRequestBody() called ...")
  // Import constants
  // const {
  //     NEWGAME, CANCELGAME, PLAYGAME
  //   , MINVALUE, MAXVALUE, MINPLAYER, MAXPLAYER
  //   , ERRACTIONUNDEF, ERRACTIONNOINT, ERRACTIONOUTOB
  //   , ERRVALUEUNDEF, ERRVALUENOINT, ERRVALUEOUTOB
  //   , ERRPLAYERUNDEF, ERRPLAYERNOINT, ERRPLAYEROUTOB
  //   } = require('../validations/crbConstants')

//==================
// Why won't these import?
  const NEWGAME    = 1
  const CANCELGAME = 2
  const PLAYGAME   = 3
  const MINVALUE   = 1
  const MAXVALUE   = 7
  const MINPLAYER  = 1
  const MAXPLAYER  = 2
  const ERRACTIONUNDEF = {
      error_message: "No action defined",
      error_id: 100
    }
  const ERRACTIONNOINT = {
      error_message: "Invalid action defined (NOINT)",
      error_id: 101
    }
  const ERRACTIONOUTOB = {
      error_message: "Invalid action defined (OUTOFBOUNDS)",
      error_id: 102
    }
  const ERRVALUEUNDEF = {
      error_message: "No value defined",
      error_id: 110
    }
  const ERRVALUENOINT = {
      error_message: "Invalid value defined (NOINT)",
      error_id: 111
    }
  const ERRVALUEOUTOB = {
      error_message: "Invalid value defined (OUTOFBOUNDS)",
      error_id: 112
    }
  const ERRPLAYERUNDEF = {
      error_message: "No player defined",
      error_id: 120
    }
  const ERRPLAYERNOINT = {
      error_message: "Invalid player defined (NOINT)",
      error_id: 121
    }
  const ERRPLAYEROUTOB = {
      error_message: "Invalid player defined (OUTOFBOUNDS)",
      error_id: 122
    }
//==================

  // Reset messages
  resultMsg = { action: 0, value: 0, player: 0,
    status: true, message: "", state: {} }
  errorMsg  = {}
  // Check Action
  if ( req.body.action === undefined ) {
    errorMsg = ERRACTIONUNDEF
    resultMsg.status = false
  } else if ( !Number.isInteger(req.body.action) ) {
    errorMsg = ERRACTIONNOINT
    resultMsg.status = false
  } else if ( ![NEWGAME, CANCELGAME, PLAYGAME].includes(req.body.action) ) {
    errorMsg = ERRACTIONOUTOB
    errorMsg.error_message += " (" + req.body.action + ")"
    resultMsg.status = false
  } else {
    resultMsg.action = req.body.action
  }

  // Check value if playing game
  if (resultMsg.status && resultMsg.action === PLAYGAME) {
    if ( req.body.value === undefined ) {
      errorMsg = ERRVALUEUNDEF
      resultMsg.status = false
    } else if ( !Number.isInteger(req.body.value) ) {
      errorMsg = ERRVALUENOINT
      resultMsg.status = false
    } else if ( req.body.value < MINVALUE || req.body.value > MAXVALUE ) {
      errorMsg = ERRVALUEOUTOB
      errorMsg.error_message += " (" + req.body.value + ")"
      resultMsg.status = false
    } else {
      resultMsg.value = req.body.value
    }
  }

  // Check player if playing game
  if (resultMsg.status && resultMsg.action === PLAYGAME) {
    if ( req.body.player === undefined ) {
      errorMsg = ERRPLAYERUNDEF
      resultMsg.status = false
    } else if ( !Number.isInteger(req.body.player) ) {
      errorMsg = ERRPLAYERNOINT
      resultMsg.status = false
    } else if ( req.body.player < MINPLAYER || req.body.player > MAXPLAYER ) {
      errorMsg = ERRPLAYEROUTOB
      errorMsg.error_message += " (" + req.body.player + ")"
      resultMsg.status = false
    } else {
      resultMsg.player = req.body.player
    }
  }
  console.log("leaving checkRequestBody()")
  return [resultMsg, errorMsg]
}

module.exports = app
