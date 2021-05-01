var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var StemPosition;
(function (StemPosition) {
    StemPosition[StemPosition["LEFT"] = 0] = "LEFT";
    StemPosition[StemPosition["CENTER"] = 1] = "CENTER";
    StemPosition[StemPosition["RIGHT"] = 2] = "RIGHT";
})(StemPosition || (StemPosition = {}));
/* --------------------- Game --------------------- */
function builderGame() {
    var quantityPieces = 3;
    var pieces = [];
    var stems = [];
    for (var i = 0; i < quantityPieces; i++) {
        pieces.push({ weight: quantityPieces - (i + 1) });
    }
    var quantityStems = 3;
    for (var i = 0; i < quantityStems; i++) {
        stems.push([]);
    }
    stems[StemPosition.LEFT] = pieces;
    // stems[StemPosition.LEFT] = [pieces[0]];
    // stems[StemPosition.CENTER] = [pieces[1]];
    // stems[StemPosition.RIGHT] = [pieces[2]];
    return {
        stems: stems,
        moves: 0,
        quantityPieces: quantityPieces
    };
}
function movePiece(game, stemPositionTarget, stemPositionCurrent) {
    var stemTarget = game.stems[stemPositionTarget];
    var stemCurrent = game.stems[stemPositionCurrent];
    var piece = stemCurrent[stemCurrent.length - 1];
    if (stemTarget.length) {
        var lastPiece = stemTarget[stemTarget.length - 1];
        if (lastPiece.weight > piece.weight) {
            stemTarget.push(piece);
            stemCurrent.pop();
            game.moves++;
            return true;
        }
        return false;
    }
    else {
        stemTarget.push(piece);
        stemCurrent.pop();
        game.moves++;
        return true;
    }
}
function movePieceLeft(game, stemPosition) {
    // Validar se não existir peça
    var stem = game.stems[stemPosition];
    if (!stem.length) {
        return false;
    }
    // Validar se a haste escolhida é possível devida a outra peça
    switch (stemPosition) {
        case StemPosition.LEFT:
            // direita
            return movePiece(game, StemPosition.RIGHT, StemPosition.LEFT);
        case StemPosition.CENTER:
            // esquerda
            return movePiece(game, StemPosition.LEFT, StemPosition.CENTER);
        case StemPosition.RIGHT:
            // centro
            return movePiece(game, StemPosition.CENTER, StemPosition.RIGHT);
    }
}
function movePieceRight(game, stemPosition) {
    // Validar se não existir peça
    var stem = game.stems[stemPosition];
    if (!stem.length) {
        return false;
    }
    // Validar se a haste escolhida é possível devida a outra peça
    switch (stemPosition) {
        case StemPosition.LEFT:
            // center
            return movePiece(game, StemPosition.CENTER, StemPosition.LEFT);
        case StemPosition.CENTER:
            // direito
            return movePiece(game, StemPosition.RIGHT, StemPosition.CENTER);
        case StemPosition.RIGHT:
            // esquerdo
            return movePiece(game, StemPosition.LEFT, StemPosition.RIGHT);
    }
}
function gameOver(game) {
    var stemRight = game.stems[StemPosition.RIGHT];
    if (stemRight.length !== game.quantityPieces) {
        return false;
    }
    return stemRight.every(function (piece, index) {
        if (piece.weight === game.quantityPieces - (index + 1)) {
            return true;
        }
        return false;
    });
}
function printGame(game) {
    console.log("Quantidade de movimentos: " + game.moves);
    game.stems.forEach(function (stem) {
        console.log(stem);
    });
    console.log();
}
/* --------------------- Game --------------------- */
/* --------------------- Auxiliar --------------------- */
function createCopyGame(game) {
    return JSON.parse(JSON.stringify(game));
}
function isEqual(leftGame, rightGame) {
    var result = leftGame.stems.every(function (stem, index) {
        var stemToCompare = rightGame.stems[index];
        return stem.every(function (piece, index) { var _a; return piece.weight === ((_a = stemToCompare[index]) === null || _a === void 0 ? void 0 : _a.weight); });
    });
    return result;
}
/* --------------------- Auxiliar --------------------- */
/* --------------------- Geração de Estados --------------------- */
function generatePossibleLeftRightState(game, stemPosition) {
    var _a = [
        createCopyGame(game),
        createCopyGame(game),
    ], copyStateGameToLeft = _a[0], copyStateGameToRight = _a[1];
    var states = [];
    var itWorkedLeft = movePieceLeft(copyStateGameToLeft, stemPosition);
    if (itWorkedLeft) {
        states.push(copyStateGameToLeft);
    }
    var itWorkedRight = movePieceRight(copyStateGameToRight, stemPosition);
    if (itWorkedRight) {
        states.push(copyStateGameToRight);
    }
    return states;
}
function generatePossibleStates(game) {
    var possibleStates = [];
    if (game.stems[StemPosition.LEFT].length) {
        var states = generatePossibleLeftRightState(game, StemPosition.LEFT);
        possibleStates.push.apply(possibleStates, states);
    }
    if (game.stems[StemPosition.CENTER].length) {
        var states = generatePossibleLeftRightState(game, StemPosition.CENTER);
        possibleStates.push.apply(possibleStates, states);
    }
    if (game.stems[StemPosition.RIGHT].length) {
        var states = generatePossibleLeftRightState(game, StemPosition.RIGHT);
        possibleStates.push.apply(possibleStates, states);
    }
    return possibleStates;
}
/* --------------------- Geração de Estados --------------------- */
/* --------------------- Play --------------------- */
function startManualGame() {
    var game = builderGame();
    printGame(game);
    // Fluxo feliz
    movePieceLeft(game, StemPosition.LEFT);
    printGame(game);
    movePieceRight(game, StemPosition.LEFT);
    printGame(game);
    movePieceLeft(game, StemPosition.RIGHT);
    printGame(game);
    movePieceLeft(game, StemPosition.LEFT);
    printGame(game);
    movePieceLeft(game, StemPosition.CENTER);
    printGame(game);
    movePieceRight(game, StemPosition.CENTER);
    printGame(game);
    movePieceLeft(game, StemPosition.LEFT);
    printGame(game);
    console.log("O jogo acabou: ", gameOver(game));
}
function startGameWithWidthSearch() {
    var stateInitialGame = builderGame();
    printGame(stateInitialGame);
    var statesGame = [stateInitialGame];
    for (var _i = 0, statesGame_1 = statesGame; _i < statesGame_1.length; _i++) {
        var game = statesGame_1[_i];
        printGame(game);
        if (gameOver(game)) {
            printGame(game);
            break;
        }
        statesGame.shift();
        statesGame.push.apply(statesGame, generatePossibleStates(game));
    }
}
function startGameWithInDepthSearch() {
    var stateInitialGame = builderGame();
    var statesGame = [stateInitialGame];
    var previousStateGame = stateInitialGame;
    while (!gameOver(statesGame[0])) {
        var currentState = statesGame[0];
        printGame(currentState);
        var statesGenerated = generatePossibleStates(currentState);
        var previousStatesGenerated = statesGame.slice(1);
        if (statesGenerated.length > 1) {
            var nextState = statesGenerated[0], otherStates = statesGenerated.slice(1);
            if (isEqual(nextState, previousStateGame)) {
                statesGame = __spreadArray(__spreadArray([], otherStates), previousStatesGenerated);
            }
            else {
                statesGame = __spreadArray(__spreadArray([nextState], otherStates), previousStatesGenerated);
            }
        }
        else if (statesGenerated.length === 1) {
            var nextState = statesGenerated[0];
            if (!isEqual(nextState, previousStateGame)) {
                statesGame = __spreadArray([nextState], previousStatesGenerated);
            }
        }
        else {
            statesGame = __spreadArray([], previousStatesGenerated);
        }
        previousStateGame = currentState;
    }
    printGame(statesGame[0]);
}
/* --------------------- Play --------------------- */
startManualGame();
// startGameWithInDepthSearch();
// startGameWithWidthSearch();
