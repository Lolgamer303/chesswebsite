export interface ChessCaseType {
    piece: "ql" | "qd" | "kl" | "kd" | "pl" | "pd" | "bl" | "bd" | "nl" | "nd" | "rl" | "rd" | null;
    color: "white" | "black";
    isHighlighted: boolean;
    isPossibleMove: boolean;
}

export type ChessboardType = {
    cases: ChessCaseType[][];
    currentTurn: "white" | "black";
    isInCheck: null | "white" | "black"; // null if no check, otherwise the color in check
    moveHistory: {
        hasKingMoved: { white: boolean; black: boolean };
        hasRookMoved: { 
            white: { queenside: boolean; kingside: boolean }; 
            black: { queenside: boolean; kingside: boolean };
        };
    };
    kingPositions: {
    
    
    
    
    
    
        white: { row: number; col: number };
        black: { row: number; col: number };
    };
}
