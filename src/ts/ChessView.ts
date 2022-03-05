import * as t from "./types";

let ChessView = function () {


    const BLACK_PIECES_CLASSES = {
        'r': 'br',
        'n': 'bn',
        'b': 'bb',
        'q': 'bq',
        'k': 'bk',
        'p': 'bp',
    } as const

    const WHITE_PIECES_CLASSES = {
        'r': 'wr',
        'n': 'wn',
        'b': 'wb',
        'q': 'wq',
        'k': 'wk',
        'p': 'wp',
    } as const

    const PIECE_CLASSES_LIST:any = Object.values(WHITE_PIECES_CLASSES).concat(Object.values(BLACK_PIECES_CLASSES) as any);

    const PROMOTION_PIECES = ["r", "n", "b", "q"] as const;



    let boardHTMLElement = document.createElement('div');
    boardHTMLElement.className = "chessboard chessboard-t";
    boardHTMLElement.id = "chessboard";

    let boardWidth: number;
    let boardHeight: number;

    let selectedPiece: t.Piece | null = null;

    let promotionWindowHTML: HTMLElement;
    let promotionCallback: (pieceType: t.PieceType, pieceColor: t.Color, promotionArgs?:any) => void;
    let promotionArgs: any;

    let isFlipped: boolean;

    let toNumeric = function(i: t.AlgebraicNotation): t.Square{
        return {file :(i.charCodeAt(0)-96), rank: (parseInt(i.charAt(1)))} as t.Square;
    }
    let toAlgebraic = function(i: t.Square): t.AlgebraicNotation{
        return ("abcdefgh".slice(i.file-1,i.file)+i.rank.toString()) as t.AlgebraicNotation;
    }


    // UTILITIES
    let translateBoardCoordsSystemToMatrix = function ({file, rank}: t.Square): t.Indexes {
        return {x: 8 - rank, y: file - 1} as t.Indexes;
    }
    let translateMatrixIndexesToBoardCoords = function ({x, y}: t.Indexes): t.Square {
        return {file: x + 1, rank: 8 - y} as t.Square;
    }

    let dragPiece = function (event: MouseEvent) {
        let boardCoords = calcBoardCoords(event);
        moveAtBoardCoords(boardCoords, selectedPiece);
    };

    // PIECE THINGS
    let getPieceClassFromHTML = function (piece: HTMLElement): undefined| t.PieceClassName{
        let pieceClass;
        piece.classList.forEach(
            (value) => {
                if(PIECE_CLASSES_LIST.includes(value)) pieceClass = value;
            }
        )
        return pieceClass
    }

    let getPieceTypeFromHTML = function (piece: HTMLElement): t.PieceType|undefined {
        let pieceClass = getPieceClassFromHTML(piece);
        return pieceClass? pieceClass[1] as t.PieceType: pieceClass;
    }
    let getPieceColorFromHTML = function (piece: HTMLElement): t.Color|undefined {
        let pieceClass = getPieceClassFromHTML(piece);
        return pieceClass? pieceClass[0] as t.Color: pieceClass;
    }

    let createPieceObjFromHTML = function (piece: HTMLElement): t.Piece {
        return {
            html: piece,
            type: getPieceTypeFromHTML(piece),
            color: getPieceColorFromHTML(piece),
            square: getSquareFromHTML(piece)
        } as t.Piece;
    }


    let getPieceBySquare = function ({file, rank}: t.Square): t.Piece | null {
        let piece = boardHTMLElement.getElementsByClassName(getSquareClass({file, rank}))[0];
        if (typeof piece === 'undefined') {
            console.log("Фигура на поле " + file + rank + " не найдена");
            return null;
        }
        return createPieceObjFromHTML(piece as HTMLElement);
    }


    let grabPiece = function (piece: HTMLElement, {x, y}: t.Coords) {
        selectedPiece = createPieceObjFromHTML(piece);
        selectedPiece.html.classList.add("dragging");

        moveAtBoardCoords({x, y}, selectedPiece);

        document.addEventListener("mousemove", dragPiece);
    }


    let removePieceFromSquare = function ({file, rank}: t.Square) {

        let piece = getPieceBySquare({file, rank});
        if (piece && piece.html.parentNode) {
            piece.html.parentNode.removeChild(piece.html);
        } else {
            console.log("Не удалочь удалить фигуру на " + file + rank + ". Фигура отсутствует");
        }
    }

    let createPieceHTML = function (pieceType: t.PieceType, color: t.Color, square: t.Square | null = null) {
        let pieceIMG = color === 'w' ? WHITE_PIECES_CLASSES[pieceType] :
            BLACK_PIECES_CLASSES[pieceType];
        let squareClass: string = square ? getSquareClass(square) : "";

        let div = document.createElement('div');

        div.className = `piece ${pieceIMG} ${squareClass}`;
        div.style.cssText = "";
        return div;
    }

    //SQUARE

    let getSquareFromHTML = function (piece: HTMLElement) {
        let coords = piece.className.match(/square-(\d)(\d)/)
        if(!coords) return null;
        let [file, rank] = [parseInt(coords[1]), parseInt(coords[2])];
        return {file, rank} as t.Square
    }

    let getSquareClass = function ({file, rank}: t.Square) {
        return `square-${file}${rank}`;
    }

    let calcBoardCoords = function ({x, y}: t.Coords) {
        let bounds = boardHTMLElement.getBoundingClientRect()
        let boardX = x - bounds.x;
        let boardY = y - bounds.y;

        return {x: boardX, y: boardY} as t.Coords;
    }

    let getSquareFromXY = function ({x, y}: t.Coords, coordsType: "board" | "client") {
        let coords = {x, y}
        if (coordsType === "client") {
            coords = calcBoardCoords({x, y});
        }


        let col = isFlipped?8 - (Math.floor((coords.x / boardWidth) / 0.125)) :
                            (Math.floor((coords.x / boardWidth) / 0.125)) + 1;

        let row = isFlipped?(Math.floor((coords.y / boardHeight) / 0.125)+1) :
                            8 - (Math.floor((coords.y / boardHeight) / 0.125));

        return {file: col, rank: row} as t.Square;

    };

    let movePieceToSquare = function (piece: t.Piece | HTMLElement,to: t.Square) {
        if (typeof piece !== "object" || piece === null) {
            throw new Error("movePieceToSquare: wrong arguments passed to function")
        }

        let pieceHTML;
        if (piece instanceof HTMLElement) {
            pieceHTML = piece;

        } else {
            pieceHTML = piece.html;

        }

        let from = getSquareFromHTML(pieceHTML)
        if(!from) throw new Error("Piece doesn't belong to any square");
        let oldSquareClass = getSquareClass(from);
        let newSquareClass = getSquareClass(to);
        pieceHTML.classList.replace(oldSquareClass, newSquareClass);

    }

    let moveFromSquareToSquare = function (from: t.Square, to: t.Square): void {
        let piece = getPieceBySquare(from);
        if (!piece) throw new Error("moveFromSquareToSquare: no piece on the square");

        let oldSquareClass = getSquareClass(from);
        let newSquareClass = getSquareClass(to);
        piece.html.classList.replace(oldSquareClass, newSquareClass);

    }
    let setPromotionWindowPosition = function(square: t.Square,promotionWindow: HTMLElement){
        let promotionWindowHasClassTop = promotionWindow.classList.contains("top");
        let isPromotionRankAtTopOfBoard = (!isFlipped && square.rank === 8) ||
                                         (isFlipped && square.rank === 1);
        let promotionWindowTranslateX = isFlipped? (8-square.file)*100 : (square.file-1)*100;
        if(isPromotionRankAtTopOfBoard){
            if(!promotionWindowHasClassTop){
                promotionWindow.classList.add("top");
            }
        }
        else {
            if(promotionWindowHasClassTop) {
                promotionWindow.classList.remove("top");
            }
        }
        promotionWindow.style.transform = "translateX("+promotionWindowTranslateX+"%)";

    }
    let closePromotionWindow = function(event?: MouseEvent){

        if(promotionWindowHTML.style.display !== "none") {
            promotionWindowHTML.style.display = "none";
            window.removeEventListener('mousedown', closePromotionWindow);
        }
    }


    let renderPromotionWindow = function (square: t.Square,piecesColor: t.Color)
    {
        let promotionWindow = document.createElement('div');
        promotionWindow.className = "promotion-window";

        for (let pieceType of PROMOTION_PIECES) {
            let piece = createPieceHTML(pieceType, piecesColor);
            piece.classList.replace("piece","promotion-piece");
            promotionWindow.append(piece)
            piece.addEventListener('mousedown',onPromotion);
        }

        setPromotionWindowPosition(square,promotionWindow);
        boardHTMLElement.append(promotionWindow);
        promotionWindowHTML = promotionWindow;
    }
    let openPromotionWindow = function(square: t.Square,
                                       piecesColor: t.Color,
                                       promotionFunction:(...args:any)=>void,
                                       ...promotionArguments:any
    ){
        promotionCallback = promotionFunction;
        promotionArgs = promotionArguments;
        setTimeout(()=>window.addEventListener('mousedown', closePromotionWindow),0);
        if(typeof promotionWindowHTML === "undefined"){
            renderPromotionWindow(square,piecesColor);
            return;
        }


        setPromotionWindowPosition(square,promotionWindowHTML);
        let promotionWindowPieces = promotionWindowHTML.getElementsByClassName("promotion-piece");
        for (let promotionWindowPiece of promotionWindowPieces) {
            if(getPieceColorFromHTML(promotionWindowPiece as HTMLElement) !== piecesColor){
                let currentClass = getPieceClassFromHTML(promotionWindowPiece as HTMLElement);
                if(!currentClass) throw new Error("openPromotionWindow: promotion pieces somehow doesn't have piece class")
                promotionWindowPiece.classList.replace(
                             currentClass,
                    piecesColor+getPieceTypeFromHTML(promotionWindowPiece as HTMLElement)
                );
            }
        }
        console.log("here");
        promotionWindowHTML.style.display = "";
    }


    let onPromotion = function (event: MouseEvent) {
        event.stopPropagation();
        let pieceType = getPieceTypeFromHTML(event.target as HTMLElement);
        let pieceColor = getPieceColorFromHTML(event.target as HTMLElement);
        if(!pieceType || !pieceColor) throw new Error("promotion piece has wrong classes");
        closePromotionWindow();
        promotionCallback(
            pieceType,
            pieceColor,
            ...promotionArgs
        );
    }


    let moveAtBoardCoords = function ({x, y}: t.Coords, piece: t.Piece | null = selectedPiece) {
        if(!piece){
            throw new Error("piece is null");
        }
        let halfOfPieceWidth = 0.5 * piece.html.offsetWidth;
        let halfOfPieceHeight = 0.5 * piece.html.offsetHeight;


        let centerX = x - halfOfPieceWidth;
        let centerY = y - halfOfPieceHeight;

        if (x < 0) centerX = -halfOfPieceWidth;
        if (x > boardWidth) centerX = boardWidth - halfOfPieceWidth;
        if (y < 0) centerY = -halfOfPieceHeight;
        if (y > boardHeight) centerY = boardHeight - halfOfPieceHeight;

        piece.html.style.transform = `translate(${centerX}px, ${centerY}px)`;

    }

    let stopDragging = function () {
        if(!selectedPiece) return;
        selectedPiece.html.classList.remove('dragging');
        selectedPiece.html.style.cssText = "";
        document.removeEventListener("mousemove", dragPiece);

    };


    return {

        HTMLElement: function () {
            return boardHTMLElement;
        },
        width: function(){
            return boardWidth;
        },
        height: function(){
            return boardHeight;
        },
        movePieceToSquare: function(piece: t.Piece | HTMLElement, newSquare: t.Square,  ){
            movePieceToSquare(piece, newSquare)
        },

        grabPiece: function(piece: HTMLElement, {x,y}: t.Coords){
            grabPiece(piece,{x,y});
        },
        removePieceFromSquare: function ({file,rank}: t.Square) {
            removePieceFromSquare({file,rank});
        },
        moveFromSquareToSquare:function(from: t.Square, to: t.Square) {
            moveFromSquareToSquare(from, to)
        },
        isPieceSelected: function(){
            return selectedPiece !== null;
        },
        setSelectedPiece: function(piece: HTMLElement|null){
            if(piece === null){
                selectedPiece = null;
            }else{
                selectedPiece = createPieceObjFromHTML(piece);
            }
        },
        getPieceBySquare: function (square: t.Square){
            return getPieceBySquare(square);
        },
        createPieceObjFromHTML: function(piece: HTMLElement){
            return createPieceObjFromHTML(piece);
        },
        getPieceClassFromHTML: function(piece :HTMLElement){
            return getPieceClassFromHTML(piece);
        },
        getPieceColorFromHTML: function(piece:HTMLElement){
            return getPieceColorFromHTML(piece);
        },
        getPieceTypeFromHTML: function(piece: HTMLElement){
            return getPieceTypeFromHTML(piece);
        },
        getSelectedPiece: function(){
            return selectedPiece;
        },
        getSquareFromXY: function ({x,y}:t.Coords, coordsType: "board" | "client" = "board"){
            return getSquareFromXY({x,y}, coordsType);
        },
        stopDragging:function () {
            stopDragging();
        },
        calcBoardCoords: function({x,y}:t.Coords){
            return calcBoardCoords({x,y});
        },

        createPieceHTML: function(pieceType:t.PieceType, color: t.Color, square: t.Square| null = null){
            return createPieceHTML(pieceType,color,square) as HTMLElement;
        },
        openPromotionWindow: function(square: t.Square, color: t.Color, promotionFunction: any, ...promotionArgs: any){
            openPromotionWindow(square,color,promotionFunction,...promotionArgs);
        },

        toAlgebraic: function (i:t.Square) {
            return toAlgebraic(i);
        },
        toNumeric: function (i: t.AlgebraicNotation) {
            return toNumeric(i);
        },
        render: function (root: HTMLElement,board: (t.Piece|null)[][],flipped: boolean = false) {
            let pieces = boardHTMLElement.getElementsByClassName("piece");
            while(pieces.length > 0){
                pieces[0].remove();
            }
            if(!boardHTMLElement.isConnected){
                root.append(boardHTMLElement);
                boardWidth = boardHTMLElement.offsetWidth;
                boardHeight = boardHTMLElement.offsetHeight;
            }

            isFlipped = flipped
            if(isFlipped) boardHTMLElement.classList.add("flipped");
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    let piece = board[i][j] ? board[i][j] : null;

                    if (piece) {
                        let square = translateMatrixIndexesToBoardCoords({x: j, y: i} as t.Indexes);
                        let pieceHTML = createPieceHTML(piece.type,piece.color, square);
                        boardHTMLElement.append(pieceHTML);
                    }
                }

            }
        }
    }

};

export default ChessView;
