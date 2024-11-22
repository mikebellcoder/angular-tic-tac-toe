import { Component, input, output, Signal } from '@angular/core';
import { GameBoard, Square } from '../types';

@Component({
  standalone: true,
  selector: 'game-board',
  template: `
    <ol id="game-board">
      @for (row of (board())!(); track $index; let rowIndex = $index) {
      <li>
        <ol>
          @for (playerSymbol of row; track $index; let colIndex = $index) {
          <li>
            <button
              (click)="onSelectSquare.emit({ row: rowIndex, col: colIndex })"
            >
              {{ playerSymbol }}
            </button>
          </li>
          }
        </ol>
      </li>
      }
    </ol>
  `,
})
export class GameBoardComponent {
  board = input<Signal<GameBoard>>([] as any);
  onSelectSquare = output<Square>();
}
