export default function ChessGameState(initialState = 0){
    let gameState = initialState; //0b 0 000 0000
    /*
    * 0  0 0 0  0000
    * |  | | | |____|
    * |  | | |   |
    * |  | | |   *details
    * |  | | black won
    * |  | draw
    * |  white won
    * is game ended
    *
    * *details:
    * if draw:
    * 0 0 0 0
    * | | | |
    * | | | |
    * | | | agreement
    * | | stalemate
    * | threefold repetition
    * insufficient material
    *
    * if result:
    * 0 0 0 0
    *     | |
    *     | checkmate
    *     resigned
    * if game not finished:
    * 0 0 0 0
    *     | |
    *     | waiting for players
    *     in process
    * */

    const WAITING_FOR_PLAYERS           = 0b00000001;
    const IN_PROCESS                    = 0b00000010;
    const GAME_FINISHED                 = 0b10000000;
        const BLACK_WON                 = 0b00010000;
        const WHITE_WON                 = 0b01000000;
            const CHECKMATE             = 0b00000001;
            const OPPONENT_RESIGNED     = 0b00000010;
        const DRAW                      = 0b00100000;
            const AGREEMENT             = 0b00000001;
            const STALEMATE             = 0b00000010;
            const THREEFOLD_REPETITION  = 0b00000100;
            const INSUFFICIENT_MATERIAL = 0b00001000;

    function isGameFinished(state = gameState){
        return state&GAME_FINISHED;
    }
    function isWaitingForPlayers(state = gameState) {
        return !(state&GAME_FINISHED) && state&WAITING_FOR_PLAYERS;
    }
    function isInProcess(state = gameState) {
        return !(state&GAME_FINISHED) && state&IN_PROCESS;
    }
    function isWhiteWon(state = gameState) {
        return state&GAME_FINISHED && state&WHITE_WON;
    }
    function isBlackWon(state = gameState) {
        return state&GAME_FINISHED && state&BLACK_WON;
    }
    function isCheckMate(state = gameState) {
        return state&GAME_FINISHED && (state&WHITE_WON || state&BLACK_WON) && state&CHECKMATE;
    }
    function isResigned(state = gameState) {
        return state&GAME_FINISHED && (state&WHITE_WON || state&BLACK_WON) && state&OPPONENT_RESIGNED;
    }
    function whoResigned(state = gameState) {
        return state&GAME_FINISHED && state&OPPONENT_RESIGNED? state&WHITE_WON? "b": state&BLACK_WON? "w" : console.log("No one resigned"): console.log("No one resigned");
    }
    function isDraw(state = gameState){
        return state&GAME_FINISHED && state&DRAW;
    }
    function isStalemate(state = gameState) {
        return state&GAME_FINISHED && state&DRAW && state&STALEMATE;
    }
    function isThreefoldRepetition(state = gameState) {
        return state&GAME_FINISHED && state&DRAW && state&THREEFOLD_REPETITION;
    }
    function isInsufficientMaterial(state = gameState) {
        return state&GAME_FINISHED && state&DRAW && state&INSUFFICIENT_MATERIAL;
    }
    function isAgreement(state = gameState) {
        return state&GAME_FINISHED && state&DRAW && state&AGREEMENT;
    }


    return{
        get value() { return gameState },
        get WAITING_FOR_PLAYERS() {return WAITING_FOR_PLAYERS},
        get IN_PROCESS() {return IN_PROCESS},
        get BLACK_WON_BY_CHECKMATE() { return GAME_FINISHED|BLACK_WON|CHECKMATE },
        get WHITE_WON_BY_CHECKMATE() { return GAME_FINISHED|WHITE_WON|CHECKMATE },
        get BLACK_WON_OPPONENT_RESIGNED() { return GAME_FINISHED|BLACK_WON|OPPONENT_RESIGNED },
        get WHITE_WON_OPPONENT_RESIGNED() { return GAME_FINISHED|WHITE_WON|OPPONENT_RESIGNED },
        get STALEMATE() { return GAME_FINISHED|DRAW|STALEMATE },
        get THREEFOLD_REPETITION() { return GAME_FINISHED|DRAW| THREEFOLD_REPETITION },
        get AGREEMENT() { return GAME_FINISHED|DRAW|AGREEMENT },
        get INSUFFICIENT_MATERIAL() { return GAME_FINISHED|DRAW|INSUFFICIENT_MATERIAL },

        set value(value) { gameState = value},

        set: (state) => gameState = state,
        isGameFinished,
        isWaitingForPlayers,
        isInProcess,
        isWhiteWon,
        isBlackWon,
        isCheckMate,
        isResigned,
        whoResigned,
        isDraw,
        isStalemate,
        isThreefoldRepetition,
        isInsufficientMaterial,
        isAgreement,
    }
}

