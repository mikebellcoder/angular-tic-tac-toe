import { Component, computed, signal } from '@angular/core';
import { GameBoardComponent } from './components/game-board.component';
import { GameBoard, GameTurn, TwoPlayers } from './types';
import { WINNING_COMBINATIONS } from './winning-combinations';
import { PlayerComponent } from './components/player.component';

const initialGameBoard: GameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const initialPlayers: TwoPlayers = {
  X: 'Player 1',
  O: 'Player 2',
};

function deriveActivePlayer(gameTurns: GameTurn[]) {
  let currentPlayer = 'X';
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') currentPlayer = 'O';

  return currentPlayer;
}

function deriveWinner(gameBoard: GameBoard, players: TwoPlayers): string {
  let winner: string = '';

  for (const combo of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combo[0].row][combo[0].column];
    const secondSquareSymbol = gameBoard[combo[1].row][combo[1].column];
    const thirdSquareSymbol = gameBoard[combo[2].row][combo[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol as 'X' | 'O'];
    }
  }

  return winner;
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main>
      <div id="game-container">
        <ol id="players" class="highlight-player">
          <player
            initialName="Player 1"
            symbol="X"
            [isActive]="activePlayer() === 'X'"            
          ></player>
          <player
            initialName="Player 2"
            symbol="O"
            [isActive]="activePlayer() === 'O'"            
          ></player>
        </ol>
        <game-board
          [board]="gameBoard"
          (onSelectSquare)="handleSelectSquare($event.row, $event.col)"
        ></game-board>
      </div>
    </main>
  `,
  imports: [GameBoardComponent, PlayerComponent],
})
export class AppComponent {
  players = signal({ ...initialPlayers });
  gameBoard = signal([...initialGameBoard.map((r) => [...r])]);
  gameTurns = signal([] as GameTurn[]);
  activePlayer = computed(() => deriveActivePlayer(this.gameTurns()));

  winner = computed(() => deriveWinner(this.gameBoard(), this.players()));

  hasDraw = computed(() => this.gameTurns().length === 9 && !this.winner());

  private _updateGameboard() {
    // TODO update this private method to use a computed signal instead, will be called based on gameTurns updating.
    const newBoard = this.gameBoard();
    for (const turn of this.gameTurns()) {
      const { player, square } = turn;
      newBoard[square.row][square.col] = player;
    }
    this.gameBoard.set(newBoard);
  }

  public handlePlayerNameChange(newSymbol: string, newName: string) {
    this.players.set({ ...this.players(), [newSymbol]: newName });
  }

  public handleSelectSquare(rowIndex: number, colIndex: number) {
    // update list of turns taken
    const prevTurns = this.gameTurns();
    const updatedTurns: GameTurn[] = [
      {
        square: { row: rowIndex, col: colIndex },
        player: this.activePlayer(),
      } as GameTurn,
      ...prevTurns,
    ];
    this.gameTurns.set(updatedTurns);
    // update game board
    this._updateGameboard();
  }

  public handleRestart() {
    this.gameTurns.set([]);
    this.players.set({ ...initialPlayers });
  }
}
