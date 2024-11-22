import { Component, computed, signal } from '@angular/core';
import { GameBoardComponent } from './components/game-board.component';
import { GameBoard, GameTurn, TwoPlayers } from './types';
import { WINNING_COMBINATIONS } from './winning-combinations';
import { PlayerComponent } from './components/player.component';
import { LogComponent } from './components/log.component';
import { GameOverComponent } from './components/game-over.component';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent, PlayerComponent, LogComponent, GameOverComponent],
  template: `
    <main>
      <div id="game-container">
        <ol id="players" class="highlight-player">
          <player
            [initialName]="players().X"
            symbol="X"
            [isActive]="activePlayer() === 'X'"
            (onChangeName)="handlePlayerNameChange($event)"
          ></player>
          <player
            [initialName]="players().O"
            symbol="O"
            [isActive]="activePlayer() === 'O'"
            (onChangeName)="handlePlayerNameChange($event)"
          ></player>
        </ol>
        @if(winner() || hasDraw()) {
          <game-over
            [winner]="winner()"
            [draw]="hasDraw()"
            (restart)="handleRestart()"
          ></game-over>
        }
        <game-board
          [board]="gameBoard"
          (onSelectSquare)="handleSelectSquare($event.row, $event.col)"
        ></game-board>
      </div>
      <log [turns]="gameTurns()"></log>
    </main>
  `,
})
export class AppComponent {
  players = signal({ ...initialPlayers });
  gameBoard = computed(() => {
    const newBoard = [...initialGameBoard.map((r) => [...r])]
    
    for (const turn of this.gameTurns()) {
      const { player, square } = turn;
      newBoard[square.row][square.col] = player;
    }

    return newBoard;
  });
  gameTurns = signal([] as GameTurn[]);
  activePlayer = computed(() => deriveActivePlayer(this.gameTurns()));

  winner = computed(() =>
    this.gameTurns().length >= 3 ? this._deriveWinner(this.gameBoard(), this.players()) : ''
  );

  hasDraw = computed(() => this.gameTurns().length === 9 && !this.winner());

  private _deriveWinner(gameBoard: GameBoard, players: TwoPlayers): string {
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

  // ! this has problems reactively updating the player state
  public handlePlayerNameChange(event: { symbol: 'X' | 'O'; name: string }) {
    const newPlayers = { ...this.players() };
    newPlayers[event.symbol] = event.name;
    this.players.set(newPlayers);
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
  }

  public handleRestart() {
    this.gameTurns.set([]);
  }
}
