const boardElement = document.getElementById("game-board");
const gameHeadingElement = document.getElementById("status");
const restartButtonElement = document.getElementById("restart");
const allSquareElements = document.getElementsByClassName("square");
const allSquares = Array.from(allSquareElements);
let currentPlayer = 1; // 1 or 2
let moveCount = 0;

const PLAYER_MARKS = {
  1: 'X',
  2: 'O',
}

function setCurrentPlayer(playerNo) {
  currentPlayer = playerNo;
  gameHeadingElement.innerText = `Turn: Player ${currentPlayer}`;
}

function updateSquare (square, value) {
  square.innerText = value;

  if (value) {
    square.classList.add('disabled');
  } else {
    square.classList.remove('disabled');
  }
  
}

function handleSquareClick (e) {
    moveCount++;
    updateSquare(e.target, PLAYER_MARKS[currentPlayer]);
    const result = checkWinner();

    if (result) {
      endGame(result);
    } else {
      setCurrentPlayer(currentPlayer == 1 ? 2 : 1);
    }
}

function endGame(result) {
  if (result === 'X') {
    gameHeadingElement.innerText = `Winner: Player 1!`;
  } else if (result === 'O') {
    gameHeadingElement.innerText = `Winner: Player 2`;
  } else {
    gameHeadingElement.innerText = `Tie Game!`;
  }

  allSquares.forEach((square) => {
      square.classList.add('disabled');
  });

  restartButtonElement.style.display = 'block';
}

function checkWinner () {
  const boardState = sliceIntoChunks(allSquares, 3);

  const linesToBeValidated = [];

  for (let i = 0; i < boardState.length; i++) {
    const row = boardState[i];
    linesToBeValidated.push(row);
  }
  
  for (let i = 0; i < boardState.length; i++) {
    const col = [boardState[0][i], boardState[1][i], boardState[2][i]];
    linesToBeValidated.push(col);
  }
  
  const diagonal = [boardState[0][0], boardState[1][1], boardState[2][2]];
  const antiDiagonal = [boardState[0][2], boardState[1][1], boardState[2][0]];

  linesToBeValidated.push(diagonal);
  linesToBeValidated.push(antiDiagonal);

  for (let i =0; i < linesToBeValidated.length; i++) {
    const line = linesToBeValidated[i];
    const winner = validate(line);

    if (winner) {
      return winner;
    }
  }

  if (moveCount === 9) {
    return 'tie';
  }

  return false;

}

function validate (arr) {
  let sign = arr[0].innerText;
  if (!sign) return false;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].innerText !== sign) return false;
  }

  return sign;
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

function handleRestartClick () {
  moveCount = 0;
  restartButtonElement.style.display = 'none';
  setCurrentPlayer(1);
  for (let square of allSquareElements) {
    updateSquare(square, '');
  }
}

allSquares.forEach((square) => square.addEventListener('click', handleSquareClick));
restartButtonElement.addEventListener('click', handleRestartClick);
