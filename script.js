const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const currentPlayerEl = document.getElementById('currentPlayer');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const xWinsEl = document.getElementById('xWins');
const oWinsEl = document.getElementById('oWins');
const drawCountEl = document.getElementById('drawCount');

let board = Array(9).fill(null);
let current = 'X';
let running = true;
let scores = { X: 0, O: 0, D: 0 };

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(msg){
  statusEl.innerHTML = msg;
}
function setCurrentPlayer(p){
  current = p;
  currentPlayerEl.textContent = p;
}
function handleMove(index){
  if (!running || board[index]) return;

  board[index] = current;
  const cell = cells[index];
  cell.dataset.player = current;
  cell.textContent = current;

  const winner = checkWinner();
  if (winner){
    running = false;
    highlightWin(winner.combo);
    scores[winner.player]++;
    updateScores();
    updateStatus(`Player <strong>${winner.player}</strong> wins!`);
  } else if (board.every(Boolean)){
    running = false;
    scores.D++;
    updateScores();
    updateStatus(`It's a draw!`);
  } else {
    setCurrentPlayer(current === 'X' ? 'O' : 'X');
    updateStatus(`Player <strong>${current}</strong>'s turn`);
  }
}
function checkWinner(){
  for (const combo of winCombos){
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]){
      return { player: board[a], combo };
    }
  }
  return null;
}
function highlightWin(combo){
  combo.forEach(i => cells[i].classList.add('win'));
}
function clearBoard(keepScore=true){
  board.fill(null);
  cells.forEach(c=>{
    c.textContent='';
    c.removeAttribute('data-player');
    c.classList.remove('win');
  });
  running=true;
  setCurrentPlayer('X');
  updateStatus(`Player <strong>${current}</strong>'s turn`);
  if (!keepScore){
    scores={X:0,O:0,D:0};
    updateScores();
  }
}
function updateScores(){
  xWinsEl.textContent = scores.X;
  oWinsEl.textContent = scores.O;
  drawCountEl.textContent = scores.D;
}

cells.forEach((cell,i)=> cell.addEventListener('click', ()=>handleMove(i)));
restartBtn.addEventListener('click', ()=> clearBoard(true));
resetScoreBtn.addEventListener('click', ()=> clearBoard(false));

clearBoard(true);
