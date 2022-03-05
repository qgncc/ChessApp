import ChessView from "./ChessView";

import * as t from "./types";

const ChessState = require("src/ts/GameState");
const Chess = require('chess.js');


let ChessGame = function(root: HTMLElement|null){
    if(!root) throw new Error("Render error: root is null")

    const ROOKS: t.Rooks = {
        b: {q: {file: 1, rank: 8}, k: {file: 8, rank: 8}},
        w: {q: {file: 1, rank: 1}, k: {file: 8, rank: 1}}
    }
    let ChessEngine = new Chess();
    let Board = ChessView();
    let side: t.Color;
    let state = ChessState();
    //from algebraic notation to numeric notation
    function isGameOver(){
        if(ChessEngine.game_over()){
            if(ChessEngine.in_checkmate()){
                if(ChessEngine.turn() === 'b'){
                    state.set(state.WHITE_WON_BY_CHECKMATE);
                    return state
                }
                else {
                    state.set(state.BLACK_WON_BY_CHECKMATE);
                    return state;
                }
            }
            if (ChessEngine.in_stalemate()) {
                state.set(state.STALEMATE);
                return state;
            }
            if (ChessEngine.in_threefold_repetition()) {
                state.set(state.THREEFOLD_REPETITION);
                return state;
            }
            if (ChessEngine.insufficient_material()) {
                state.set(state.INSUFFICIENT_MATERIAL);
                return state
            }
        }else{
            return false;
        }
    }
    function updateBoard(piece: t.Piece, squareTo: t.Square, flag: string, promotion?: t.PieceType){
        if (flag.includes('c')){
            Board.removePieceFromSquare(squareTo);
        }
        if (flag === 'e'){
            let oldSquare = piece.square;
            let enPassantSquare = {file: squareTo.file, rank: oldSquare.rank}
            Board.removePieceFromSquare(enPassantSquare);
        }
        if (flag === 'q' || flag === 'k'){
            castleRookMove(flag, piece.color, squareTo)
        }
        if (flag.includes('p')){
            let newClass = piece.color+promotion;
            let oldClass = piece.color+'p'

            piece.html.classList.replace(oldClass,newClass);
            Board.removePieceFromSquare(squareTo);

        }

        Board.movePieceToSquare(piece,squareTo);
    }
    let movePieceToSquare = function(piece: t.Piece, squareTo: t.Square, promotion?: t.PieceType){
        if(side !== piece.color) return;
        let move = createMove(piece.square, squareTo, promotion);
        let resultMove = ChessEngine.move(move);
        root.dispatchEvent(new CustomEvent("chess_move", {detail: {move}}))

        if(resultMove){
            updateBoard(piece,squareTo, resultMove.flags, promotion);
            if (isGameOver()){
                root.dispatchEvent(new CustomEvent("game_ended", {detail: {result:state.value}}))
            }

        }else{
            throw new Error("wrong move");
        }
        console.log(ChessEngine.ascii())
        return resultMove;
    }

    let promotionFunction = function(promotion: t.PieceType, pieceColor: t.Color, pawn: t.Piece, squareTo: t.Square){
        movePieceToSquare(pawn,squareTo,promotion);
    }

    let castleRookMove = function(type: 'q'|'k', color: t.Color, kingSquare: t.Square){
        let from: t.Square = ROOKS[color][type];
        let to: t.Square;
        if(type === 'q'){
            to = {file: (kingSquare.file + 1), rank: kingSquare.rank} as t.Square;
        }
        else{
            to = {file: (kingSquare.file - 1), rank: kingSquare.rank} as t.Square;
        }

        Board.moveFromSquareToSquare(from, to);
    }
    let isMoveLegal = function(from: t.Square,to: t.Square){
        return !!getMoveFlag(from, to);
    }
    let getMoveFlag = function(from: t.Square, to: t.Square){
        let moves = ChessEngine.moves({square:Board.toAlgebraic(from), verbose: true});
        for (let move of moves) {
            if(move.to === Board.toAlgebraic(to)) {
                return move.flags;
            }
        }
        return null;
    }

    //from numeric notation to algebraic notation





    let createMove = function (
        squareFrom: t.Square,
        squareTo: t.Square,
        promotion: string | undefined = undefined
    ):t.Move
    {
        let notationFrom = Board.toAlgebraic(squareFrom);
        let notationTo = Board.toAlgebraic(squareTo);


        return promotion ? {from: notationFrom, to: notationTo, promotion: promotion} :
            {from: notationFrom, to: notationTo};
    }

    let makeMove = function (piece:t.Piece, squareTo: t.Square){
        let squareFrom = piece.square;
        let flag = getMoveFlag(squareFrom, squareTo);
        if (flag.includes("p")) {
            Board.openPromotionWindow(squareTo, piece.color, promotionFunction, piece, squareTo);
        }
        else {
            movePieceToSquare(piece, squareTo);
        }
        Board.setSelectedPiece(null);
    }
    let onMouseUp = function(event: MouseEvent){
        let piece = Board.getSelectedPiece();
        if(piece){
            let squareTo = Board.getSquareFromXY({x: event.clientX, y: event.clientY}, "client");
            let squareFrom = piece.square

            if (isMoveLegal(squareFrom, squareTo)) {
                Board.stopDragging();
                makeMove(piece, squareTo)
                Board.setSelectedPiece(null);
            }
        }
        Board.stopDragging();
        Board.HTMLElement().removeEventListener('mouseup', onMouseUp);
    }

    let onMouseDown = function (event:MouseEvent) {
        if(ChessEngine.game_over()) return;
        let coords:t.Coords = Board.calcBoardCoords({x:event.clientX,y:event.clientY});
        let piece = Board.getSelectedPiece();
        if(piece){
            let squareTo = Board.getSquareFromXY(coords, "board");
            let squareFrom = piece.square

            if (isMoveLegal(squareFrom, squareTo)) {
                makeMove(piece, squareTo)
            }
        }
        if(event.target !== Board.HTMLElement())Board.grabPiece(event.target as HTMLElement,coords);
        Board.HTMLElement().addEventListener('mouseup', onMouseUp);
    }
    return {
        startGame: function(color:t.Color){
            side = color;
            let wrapper = document.getElementById("wrapper");
            if(!wrapper) throw new Error("failed to start game: root doesn't exist")

            if(side === 'b') Board.render(wrapper,ChessEngine.board(), true)
            else Board.render(wrapper,ChessEngine.board());

            Board.HTMLElement().addEventListener('mousedown', onMouseDown);

        },
        move: function (
            from: t.AlgebraicNotation,
            to: t.AlgebraicNotation,
            promotion?: t.PieceType)
        {
            let resultMove = ChessEngine.move({from, to, promotion});
            let piece = Board.getPieceBySquare(Board.toNumeric(from));
            if(piece && resultMove)updateBoard(piece, Board.toNumeric(to),resultMove.flags, promotion);
            else throw new Error("Illegal move");
            if(isGameOver()) root.dispatchEvent(new CustomEvent("game_ended", {detail: {state:state.value}}));

        }
    }

}

export default ChessGame;