export interface ChessCaseType {
    piece: "ql" | "qd" | "kl" | "kd" | "pl" | "pd" | "bl" | "bd" | "nl" | "nd" | "rl" | "rd" | null;
    color: "white" | "black";
    isHighlighted: boolean;
    isPossibleMove: boolean;
}

export type ChessboardType = {
    cases: ChessCaseType[][];
}