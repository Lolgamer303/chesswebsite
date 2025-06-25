import { useState } from "react";
import { ChessCase } from "./ChessCase";
import type { ChessboardType, ChessCaseType } from "./Chesstypes";

interface ChessboardProps {
    chessboard?: ChessboardType;
    setChessboard?: (chessboard: ChessboardType) => void;
}

export default function Chessboard({ chessboard, setChessboard }: ChessboardProps) {
    const [draggedPiece, setDraggedPiece] = useState<{
        piece: string;
        fromRow: number;
        fromCol: number;
    } | null>(null);

    const handleDragStart = (piece: string, row: number, col: number) => {
        setDraggedPiece({ piece, fromRow: row, fromCol: col });
    };

    const handleDrop = (toRow: number, toCol: number) => {
        if (!draggedPiece || !setChessboard || !chessboard) return;

        const newBoard = chessboard.map(row => [...row]);
        
        // Remove piece from original position
        newBoard[draggedPiece.fromRow][draggedPiece.fromCol].piece = null;
        
        // Place piece at new position
        newBoard[toRow][toCol].piece = draggedPiece.piece as ChessCaseType["piece"];
        
        setChessboard(newBoard);
        setDraggedPiece(null);
    };

    const handleDragEnd = () => {
        setDraggedPiece(null);
    };
    if (!chessboard) {
        return <div>Loading chessboard...</div>;
    }

    return (
        <div className="grid grid-cols-8 w-240 h-240 border-2 border-gray-800">
            {chessboard.map((row, rowIndex) =>
                row.map((chessCase, colIndex) => (
                    <ChessCase 
                        key={`${rowIndex}-${colIndex}`} 
                        chessCase={chessCase}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                    />
                ))
            )}
        </div>
    );
}