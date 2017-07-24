class Board {
  constructor(state = ['', '', '', '', '', '', '', '', '']) {
    this.state = state;
  }

  isEmpty() {
    return this.state.every(cell => !cell);
  }

  isFull() {
    return this.state.every(cell => cell);
  }

  isTerminal() {
    if (this.isEmpty()) {
      return false;
    }

    if (this.state[0] == this.state[1] && this.state[0] == this.state[2] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'hori', 'row': 1};
    }
    if (this.state[3] == this.state[4] && this.state[3] == this.state[5] && this.state[3]) {
      return {'winner': this.state[3], 'direction': 'hori', 'row': 2};
    }
    if (this.state[6] == this.state[7] && this.state[6] == this.state[8] && this.state[6]) {
      return {'winner': this.state[6], 'direction': 'hori', 'row': 3};
    }

    if (this.state[0] == this.state[3] && this.state[0] == this.state[6] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'vert', 'col': 1};
    }
    if (this.state[1] == this.state[4] && this.state[1] == this.state[7] && this.state[1]) {
      return {'winner': this.state[1], 'direction': 'vert', 'col': 2};
    }
    if (this.state[2] == this.state[5] && this.state[2] == this.state[8] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'vert', 'col': 3};
    }

    if (this.state[0] == this.state[4] && this.state[0] == this.state[8] && this.state[0]) {
      return {'winner': this.state[0], 'direction': 'diag', 'ltr': 1};
    }
    if (this.state[2] == this.state[4] && this.state[2] == this.state[6] && this.state[2]) {
      return {'winner': this.state[2], 'direction': 'diag', 'ltr': 2};
    }

    if (this.isFull()) {
      return {
        'winner': 'draw'
      };
    }

    return false;
  }

  symbol(symbol) {
    let img = $('<img>').attr('src', `../pa3_tic_tac_toe/images/${symbol}.png`);
    return img[0];
  }

  insert(symbol, index) {
    if (index > 8 || this.state[index]) {
      return false;
    }
    this.state[index] = symbol;
    return true;
  }

  getAvailableMoves() {
    const moves = [];
    this.state.forEach((cell, index) => {
      if(!cell) {
        moves.push(index);
      }
    });
    return moves;
  }
}

class AI {
  constructor(symbol) {
    this.symbol = symbol;
    this.nodes_map = new Map();
  }

  minimax(board, maximizing = true, callback = () => {}, depth = 0) {
    if (depth == 0) {
      this.nodes_map.clear();
    }

    if (board.isTerminal()) {
      if (board.isTerminal().winner == 'x') {
        return 100 - depth;
      } else if (board.isTerminal().winner == 'o') {
        return depth - 100;
      }
      return 0;
    }

    if (maximizing) {
      let maxVal = -100;

      board.getAvailableMoves().forEach(index => {
        let currentBoard = new Board(board.state.slice());
        currentBoard.insert('x', index);
        let node_value = this.minimax(currentBoard, false, callback, depth + 1);
        maxVal = Math.max(maxVal, node_value);

        if (depth == 0) {
          if (this.nodes_map.has(node_value)) {
            this.nodes_map.get(node_value).push(index);
          } else {
            this.nodes_map.set(node_value, [index]);
          }
        }
      });

      if (depth == 0) {
        if (this.nodes_map.get(maxVal).length > 1) {
          let random = Math.floor((Math.random() * this.nodes_map.get(maxVal).length));
          return this.nodes_map.get(maxVal)[random];
        } else {
          return this.nodes_map.get(maxVal)[0];
        }
      }

      return maxVal;
    }

    if (!maximizing) {
      let minVal = 100;

      board.getAvailableMoves().forEach(index => {
        let currentBoard = new Board(board.state.slice());
        currentBoard.insert('o', index);
        let node_value = this.minimax(currentBoard, true, callback, depth + 1);
        minVal = Math.min(minVal, node_value);

        if (depth == 0) {
          if (this.nodes_map.has(node_value)) {
            this.nodes_map.get(node_value).push(index);
          } else {
            this.nodes_map.set(node_value, [index]);
          }
        }
      });

      if (depth == 0) {
        if (this.nodes_map.get(minVal).length > 1) {
          let random = Math.floor((Math.random() * this.nodes_map.get(minVal).length));
          return this.nodes_map.get(minVal)[random];
        } else {
          return this.nodes_map.get(minVal)[0];
        }
      }

      return minVal;
    }
  }

}

function init() {
  let board = new Board(['', '', '', '', '', '', '', '', '']);
  let computer = new AI();
  let board_ui = $('#board');

  board_ui.removeClass();
  board_ui.html("<div class='cell' id='0'></div><div class='cell' id='1'></div><div class='cell' id='2'></div><div class='cell' id='3'></div><div class='cell' id='4'></div><div class='cell' id='5'></div><div class='cell' id='6'></div><div class='cell' id='7'></div><div class='cell' id='8'></div>");

  $('.cover').addClass('hidden');

  $('.announcement').html("Your turn first");

  $('.cell').each((index, cell) => {
    $(cell).on('click', () => {
      let cell_id = $(cell).attr('id');
      if (board.insert('x', cell_id)) {
        board.insert('x', cell_id);
        $(board.symbol('x', cell_id)).appendTo($(cell));
      } else {
        return false;
      }
      if (checkGameState()) {
        return false;
      } else {
        let computerMove = computer.minimax(board, false);
        let bestMoveIndex = $(`#${computerMove}`);
        board.insert('o', computerMove);
        let delay = setTimeout(() => {
          $(board.symbol('o', computerMove)).appendTo($(bestMoveIndex));
        }, 250);
        checkGameState();
      }
    });
  });

  function drawWinningLine() {
    let direction = board.isTerminal().direction;
    let row_col_ltr = board.isTerminal().row || board.isTerminal().col || board.isTerminal().ltr;
    board_ui.addClass(direction);
    board_ui.addClass(`${direction}-${row_col_ltr}`);
    let delay = setTimeout(() => {
      board_ui.addClass(`${direction}-animate`);
    }, 500);
  }

  function checkGameState() {
    if (board.isTerminal()) {
      $('.cover').removeClass('hidden');
      if (board.isTerminal().winner !== 'draw') {
        drawWinningLine();
        let winner = board.isTerminal().winner == 'x' ? 'x' : 'o';
        $('.announcement').html(`${winner.toUpperCase()} wins!`);
      } else {
        $('.announcement').html("It's a draw!");
      }
      return true;
    }
    return false;
  }
}

$(document).on('DOMContentLoaded', () => {
  $('#start').on('click', init);
});