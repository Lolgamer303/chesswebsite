export interface ChessCaseType {
    piece: "ql" | "qd" | "kl" | "kd" | "pl" | "pd" | "bl" | "bd" | "nl" | "nd" | "rl" | "rd" | null;
    color: "white" | "black";
    highlighted?: boolean;
    selected?: boolean;
}

export type ChessboardType = ChessCaseType[][];