import { Component, input, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'player',
  template: `
    <li ngClass="{ active: isActive }">
      <span class="player">
        @if (isEditing()) {
        <input
          type="text"
          [value]="playerName()"
          (change)="handleChange($event)"
        />
        } @else {
        <span class="player-name">{{ playerName() }}</span>
        }
        <span class="player-symbol">{{ symbol() }}</span>
      </span>
    </li>
  `,
})
export class PlayerComponent {
  initialName = input<string>('');
  symbol = input<string>('');

  isActive = input<boolean>(false);
  isEditing = signal<boolean>(false);

  playerName = signal<string>(this.initialName());

  public handleChange(event: any) {
    this.playerName.set((event.target as HTMLInputElement).value);
  }
}
