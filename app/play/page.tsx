"use client";
import { useState } from "react";
import Chessboard from "../components/Chessboard";
import type { ChessCaseType, ChessboardType } from "../components/Chesstypes";

function defaultChessboard(): ChessboardType {
    // Initialize 8x8 board with alternating colors
    const cases: ChessCaseType[][] = [];
    
    for (let row = 0; row < 8; row++) {
        const boardRow: ChessCaseType[] = [];
        for (let col = 0; col < 8; col++) {
            // Determine square color (white/black pattern)
            const isWhiteSquare = (row + col) % 2 === 0;
            
            // Determine piece based on row and column
            let piece: ChessCaseType['piece'] = null;
            
            if (row === 0) {
                // Black back rank
                if (col === 0 || col === 7) piece = "rd";
                else if (col === 1 || col === 6) piece = "nd";
                else if (col === 2 || col === 5) piece = "bd";
                else if (col === 3) piece = "qd";
                else if (col === 4) piece = "kd";
            } else if (row === 1) {
                // Black pawns
                piece = "pd";
            } else if (row === 6) {
                // White pawns
                piece = "pl";
            } else if (row === 7) {
                // White back rank
                if (col === 0 || col === 7) piece = "rl";
                else if (col === 1 || col === 6) piece = "nl";
                else if (col === 2 || col === 5) piece = "bl";
                else if (col === 3) piece = "ql";
                else if (col === 4) piece = "kl";
            }
            
            boardRow.push({
                piece,
                color: isWhiteSquare ? "white" : "black",
                isHighlighted: false,
                isPossibleMove: false,
            });
        }
        cases.push(boardRow);
    }
    
    return { cases };
}

export default function Home() {
    const [chessboard, setChessboard] = useState<ChessboardType>(defaultChessboard());
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Chessboard chessboard={chessboard} setChessboard={setChessboard} />
        </div>
        
    );
}

