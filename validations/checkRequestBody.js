const checkRequestBody = (req, res, resultMsg, errorMsg) => {
  // Import constants
  // const {
  //     NEWGAME, CANCELGAME, PLAYGAME,
  //     MINVALUE, MAXVALUE, MINPLAYER, MAXPLAYER
      // ERRACTIONUNDEF, ERRACTIONNOINT, ERRACTIONOUTOB,
      // ERRVALUEUNDEF, ERRVALUENOINT, ERRVALUEOUTOB,
      // ERRPLAYERUNDEF, ERRPLAYERNOINT, ERRPLAYEROUTOB
    // } = require('./crbConstants')


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
}
module.exports = checkRequestBody
