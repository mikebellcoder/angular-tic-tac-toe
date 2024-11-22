import { Component, input, output } from '@angular/core';

@Component({
  selector: 'game-over',
  standalone: true,
  template: `
    <div id="game-over">
      <h2>Game Over!</h2>
      @if (draw()) {
      <p>It's a draw!</p>
      } @else {
      <p>{{ winner() }} won</p>
      }
      <p>
        <button (click)="restart.emit()">Rematch</button>
      </p>
    </div>
  `,
})
export class GameOverComponent {
  winner = input<string>('');
  draw = input<boolean>(false);
  restart = output<void>();
}
