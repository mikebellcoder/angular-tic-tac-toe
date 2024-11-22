export type PlayerSymbolType = 'X' | 'O';

export type Combo = {
    row: number;
    column: number;
}

export type Square = {
    row: number;
    col: number;
}

export type GameBoard = (string|null)[][];

export type GameTurn = {
    player: PlayerSymbolType;
    square: Square;
};

export type Player = {
    name: string;
    symbol: PlayerSymbolType;
}

export type TwoPlayers = {
    X: string;
    O: string;
}

export type WinningCombo = [Combo, Combo, Combo];