import { Component, input } from "@angular/core";
import { GameTurn } from "../types";

@Component({
    standalone: true,
    selector: 'log',
    template: `
        <ol id="log">
            @for (turn of turns(); track $index; let index = $index) {
                <li>
                    {{ turn.player }} selected {{turn.square.row}}, {{turn.square.col}}
                </li>
            }
        </ol>
    `,
})
export class LogComponent {
    turns = input<GameTurn[]>([]);
}