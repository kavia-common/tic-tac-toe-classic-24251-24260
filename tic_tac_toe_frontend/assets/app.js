(function () {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const currentPlayerEl = document.getElementById('currentPlayer');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const restartBtn = document.getElementById('restartBtn');

  let current = 'X';
  let board = Array(9).fill('');
  let score = { X: 0, O: 0 };

  function setTurn(player) {
    current = player;
    currentPlayerEl.textContent = player;
  }

  function clearBoardUI() {
    cells.forEach(c => {
      c.textContent = '';
      c.classList.remove('win');
      c.disabled = false;
      c.setAttribute('aria-disabled', 'false');
    });
  }

  function restart() {
    board = Array(9).fill('');
    clearBoardUI();
    setTurn('X');
    // return focus to first cell for accessibility
    cells[0]?.focus();
  }

  function inBounds(idx) {
    return idx >= 0 && idx < 9;
  }

  function createRipple(e, host) {
    const rect = host.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    host.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  function markCell(idx, player) {
    if (!inBounds(idx) || board[idx]) return false;
    board[idx] = player;
    cells[idx].textContent = player;
    return true;
  }

  // Returns 'X', 'O', 'draw', or null
  function checkGameState() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        [a,b,c].forEach(i => cells[i].classList.add('win'));
        return board[a];
      }
    }
    if (board.every(x => x)) return 'draw';
    return null;
  }

  function announce(message) {
    // Use currentPlayer pill as a polite live region to announce outcome
    currentPlayerEl.textContent = message;
  }

  function updateScore(winner) {
    if (winner === 'X' || winner === 'O') {
      score[winner] += 1;
      scoreXEl.textContent = score.X;
      scoreOEl.textContent = score.O;
    }
  }

  function handleClick(e) {
    const cell = e.currentTarget;
    const idx = Number(cell.dataset.index);
    createRipple(e, cell);

    if (!markCell(idx, current)) {
      return; // already marked
    }

    const state = checkGameState();
    if (state === 'X' || state === 'O') {
      updateScore(state);
      currentPlayerEl.classList.add('pill-primary');
      setTimeout(() => currentPlayerEl.classList.remove('pill-primary'), 450);
      announce(`${state} wins`);
      cells.forEach(c => { c.disabled = true; c.setAttribute('aria-disabled', 'true'); });
      return;
    } else if (state === 'draw') {
      announce('Draw');
      return;
    }

    // Swap turn
    setTurn(current === 'X' ? 'O' : 'X');
  }

  function enableCells() {
    cells.forEach(c => { c.disabled = false; c.setAttribute('aria-disabled', 'false'); });
  }

  // Bind events
  cells.forEach(c => c.addEventListener('click', handleClick));
  restartBtn.addEventListener('click', () => {
    restart();
    enableCells();
  });

  // Initial state
  setTurn('X');
})();
