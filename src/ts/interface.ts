export interface typeGameSave {
    [key: string]: {} | string | null[] | undefined;
    scoresSave: {
        done: number;
        won: number;
        points: number;
    };
    secretCode: (string | null)[];
    gameType: {
        pawnTotal: number;
        multiColor: boolean;
        winPawns: number;
        active: boolean;
    };
    boardMemory: (string | number)[][];
    gameStatusDisplay: {
        pawnTotal: string;
        multiColor: string;
    };
}

export interface typeColorsFr {
    [key: string]: string;
}

export interface typeScoresSave {
    [key: string]: number;
}