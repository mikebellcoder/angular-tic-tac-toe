import { Component, input, OnInit, output, signal } from '@angular/core';
import { Player, PlayerSymbolType } from '../types';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'player',
  imports: [NgClass],
  template: `
    <li [ngClass]="isActive() ? 'active' : ''">
      <span class="player">
        @if (isEditing()) {
        <input
          type="text"
          required
          [value]="playerName()"
          (change)="handleChange($event)"
        />
        } @else {
        <span class="player-name">{{ playerName() }}</span>
        }
        <span class="player-symbol">{{ symbol() }}</span>
      </span>
      <button (click)="handleEditClick()">
        {{ isEditing() ? 'Save' : 'Edit' }}
      </button>
    </li>
  `,
})
export class PlayerComponent implements OnInit {
  initialName = input<string>('');
  symbol = input<PlayerSymbolType>();
  isActive = input<boolean>(false);
  isEditing = signal<boolean>(false);
  playerName = signal<string>('');
  onChangeName = output<Player>();

  ngOnInit() {
    this.playerName.set(this.initialName());
  }

  public handleChange(event: any) {
    this.playerName.set((event.target as HTMLInputElement).value);
  }

  public handleEditClick() { // ! this was found to be firing despite if condition, required setting local state to avoid issue
    const isEditing = this.isEditing();
    this.isEditing.set(!isEditing);
    if (isEditing && this.symbol()) {
      this.onChangeName.emit({
        name: this.playerName(),
        symbol: this.symbol()!,
      });
    }
    return false;
  }
}
