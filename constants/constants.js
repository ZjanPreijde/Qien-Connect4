module.exports = {
  NEWGAME:      1,
  CANCELGAME:   2,
  PLAYGAME:     3,
  MINVALUE:     1,
  MAXVALUE:     7,
  MINPLAYER:    1,
  MAXPLAYER:    2,
  MAXNROFPLAYS: 42,

  ERRACTIONUNDEF: {
      error_message: "No action defined",
      error_id: 100
    },
  ERRACTIONNOINT: {
      error_message: "Invalid action defined (NOINT)",
      error_id: 101
    },
  ERRACTIONOUTOB: {
      error_message: "Invalid action defined (OUTOFBOUNDS)",
      error_id: 102
    },

  ERRVALUEUNDEF: {
      error_message: "No value defined",
      error_id: 110
    },
  ERRVALUENOINT: {
      error_message: "Invalid value defined (NOINT)",
      error_id: 111
    },
  ERRVALUEOUTOB: {
      error_message: "Invalid value defined (OUTOFBOUNDS)",
      error_id: 112
    },

  ERRPLAYERUNDEF: {
      error_message: "No player defined",
      error_id: 120
    },
  ERRPLAYERNOINT: {
      error_message: "Invalid player defined (NOINT)",
      error_id: 121
    },
  ERRPLAYEROUTOB: {
      error_message: "Invalid player defined (OUTOFBOUNDS)",
      error_id: 122
    },

  ERRNEWERROR1: {
      error_message: 'Error creating new game',
      error_id: 201
    },
  ERRNEWERROR2: {
      error_message: 'Error creating new game',
      error_id: 202
    },
  ERRNEWSTILLACTIVE: {
      error_message: 'Still an active game, new game not created',
      error_id: 203
    },

  ERRCNCERROR1: {
      error_message: 'Error cancelling game',
      error_id: 211
    },
  ERRCNCERROR2: {
      error_message: 'Error cancelling game',
      error_id: 212
    },
  ERRCNCNOACTIVE: {
      error_message: 'No active game, nothing to cancel',
      error_id: 213
    },

  ERRPLAYERROR1: {
      error_message: 'Error cancelling game',
      error_id: 221
    },
  ERRPLAYERROR2: {
      error_message: 'Error searching for game',
      error_id: 222
    },
  ERRPLAYNOACTIVE: {
      error_message: 'No active game, no play possible',
      error_id: 223
  },
  ERRPLAYMAXREACHED: {
      error_message: 'Maximum nr of plays reached',
      error_id: 224
  },
  ERRPLAYSAMEPLAYER: {
      error_message: 'No 2 consecutive plays by same player',
      error_id: 225
  },
  ERRPLAYSTARTFIRST: {
      error_message: 'Game must be started by Player 1',
      error_id: 226
  },
  ERRPLAYCOLUMNFULL: {
      error_message: 'Column is full',
      error_id: 227
  },
  ERRCHKERROR1: {
      error_message: 'Error checking game',
      error_id: 301
  }
}
