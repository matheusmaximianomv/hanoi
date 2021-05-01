interface Piece {
  weight: number;
}

interface Game {
  stems: Array<Piece[]>; // stems[[], [], []];
  moves: number;
  quantityPieces: number;
}

enum StemPosition {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

/* --------------------- Game --------------------- */
function builderGame(): Game {
  const quantityPieces: number = 3;
  const pieces: Array<Piece> = [];
  const stems: Array<Piece[]> = [];

  for (let i = 0; i < quantityPieces; i++) {
    pieces.push({ weight: quantityPieces - (i + 1) });
  }

  const quantityStems: number = 3;
  for (let i = 0; i < quantityStems; i++) {
    stems.push([]);
  }

  stems[StemPosition.LEFT] = pieces;
  // stems[StemPosition.LEFT] = [pieces[0]];
  // stems[StemPosition.CENTER] = [pieces[1]];
  // stems[StemPosition.RIGHT] = [pieces[2]];

  return {
    stems,
    moves: 0,
    quantityPieces,
  };
}

function movePiece(
  game: Game,
  stemPositionTarget: StemPosition,
  stemPositionCurrent: StemPosition
): boolean {
  const stemTarget = game.stems[stemPositionTarget];
  const stemCurrent = game.stems[stemPositionCurrent];
  const piece = stemCurrent[stemCurrent.length - 1];

  if (stemTarget.length) {
    const lastPiece = stemTarget[stemTarget.length - 1];

    if (lastPiece.weight > piece.weight) {
      stemTarget.push(piece);
      stemCurrent.pop();
      game.moves++;

      return true;
    }

    return false;
  } else {
    stemTarget.push(piece);
    stemCurrent.pop();
    game.moves++;

    return true;
  }
}

function movePieceLeft(game: Game, stemPosition: StemPosition): boolean {
  // Validar se não existir peça
  const stem = game.stems[stemPosition];
  if (!stem.length) {
    return false;
  }

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

function movePieceRight(game: Game, stemPosition: StemPosition): boolean {
  // Validar se não existir peça
  const stem = game.stems[stemPosition];
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

function gameOver(game: Game): boolean {
  const stemRight = game.stems[StemPosition.RIGHT];

  if (stemRight.length !== game.quantityPieces) {
    return false;
  }

  return stemRight.every((piece, index) => {
    if (piece.weight === game.quantityPieces - (index + 1)) {
      return true;
    }

    return false;
  });
}

function printGame(game: Game): void {
  console.log(`Quantidade de movimentos: ${game.moves}`);
  game.stems.forEach((stem) => {
    console.log(stem);
  });
  console.log();
}
/* --------------------- Game --------------------- */

/* --------------------- Auxiliar --------------------- */
function createCopyGame(game: Game): Game {
  return JSON.parse(JSON.stringify(game));
}

function isEqual(leftGame: Game, rightGame: Game): boolean {
  const result = leftGame.stems.every((stem, index) => {
    const stemToCompare = rightGame.stems[index];
    return stem.every((piece, index) => piece.weight === stemToCompare[index]?.weight);
  });

  return result;
}
/* --------------------- Auxiliar --------------------- */

/* --------------------- Geração de Estados --------------------- */
function generatePossibleLeftRightState(
  game: Game,
  stemPosition: StemPosition
): Array<Game> {
  const [copyStateGameToLeft, copyStateGameToRight] = [
    createCopyGame(game),
    createCopyGame(game),
  ];
  const states: Array<Game> = [];

  const itWorkedLeft = movePieceLeft(copyStateGameToLeft, stemPosition);
  if (itWorkedLeft) {
    states.push(copyStateGameToLeft);
  }

  const itWorkedRight = movePieceRight(copyStateGameToRight, stemPosition);
  if (itWorkedRight) {
    states.push(copyStateGameToRight);
  }

  return states;
}

function generatePossibleStates(game: Game): Array<Game> {
  const possibleStates: Array<Game> = [];

  if (game.stems[StemPosition.LEFT].length) {
    const states = generatePossibleLeftRightState(game, StemPosition.LEFT);
    possibleStates.push(...states);
  }

  if (game.stems[StemPosition.CENTER].length) {
    const states = generatePossibleLeftRightState(game, StemPosition.CENTER);
    possibleStates.push(...states);
  }

  if (game.stems[StemPosition.RIGHT].length) {
    const states = generatePossibleLeftRightState(game, StemPosition.RIGHT);
    possibleStates.push(...states);
  }

  return possibleStates;
}
/* --------------------- Geração de Estados --------------------- */

/* --------------------- Play --------------------- */
function startManualGame(): void {
  const game = builderGame();
  printGame(game);

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

function startGameWithWidthSearch(): void {
  const stateInitialGame = builderGame();
  printGame(stateInitialGame);
  const statesGame: Array<Game> = [stateInitialGame];

  for (let game of statesGame) {
    printGame(game);

    if (gameOver(game)) {
      printGame(game);
      break;
    }

    statesGame.shift();
    statesGame.push(...generatePossibleStates(game));
  }
}

function startGameWithInDepthSearch(): void {
  const stateInitialGame = builderGame();
  let statesGame: Array<Game> = [stateInitialGame];
  let previousStateGame: Game = stateInitialGame;

  while (!gameOver(statesGame[0])) {
    const currentState = statesGame[0];
    printGame(currentState);
    const statesGenerated = generatePossibleStates(currentState);

    const previousStatesGenerated = statesGame.slice(1);
    if (statesGenerated.length > 1) {
      const [nextState, ...otherStates] = statesGenerated;

      if (isEqual(nextState, previousStateGame)) {
        statesGame = [...otherStates, ...previousStatesGenerated];
      } else {
        statesGame = [nextState, ...otherStates, ...previousStatesGenerated];
      }

    } else if (statesGenerated.length === 1) {
      const [nextState] = statesGenerated;

      if (!isEqual(nextState, previousStateGame)) {
        statesGame = [nextState, ...previousStatesGenerated];
      }
    } else {
      statesGame = [...previousStatesGenerated];
    }

    previousStateGame = currentState;
  }

  printGame(statesGame[0]);
} 
/* --------------------- Play --------------------- */

// startManualGame();
// startGameWithInDepthSearch();
// startGameWithWidthSearch();
