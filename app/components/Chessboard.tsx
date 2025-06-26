import { useState } from "react";
import { ChessCase } from "./ChessCase";
import type { ChessboardType, ChessCaseType } from "./Chesstypes";
import { setBishopPossibleMoves, setKingPossibleMoves, setKnightPossibleMoves, setPawnPossibleMoves, setQueenPossibleMoves, setRookPossibleMoves } from "./ChessPossiblesMoves";

interface ChessboardProps {
    chessboard?: ChessboardType;
    setChessboard?: (chessboard: ChessboardType) => void;
}

function setPossibleMoves(chessboard: ChessboardType, selectedCase: { row: number; col: number }, setChessboard?: (chessboard: ChessboardType) => void) {
    const selectedChessCase = chessboard.cases[selectedCase.row][selectedCase.col];
    chessboard = resetPossibleMoves(chessboard, setChessboard); // Reset previous possible moves
    if (!selectedChessCase.piece) return;
    
    // Create a deep copy of the chessboard to avoid mutating the original
    const newBoard = chessboard
    if (selectedChessCase.piece.startsWith("p")) {
        setPawnPossibleMoves(newBoard, selectedCase);
    }
    else if (selectedChessCase.piece.startsWith("n")) {
        setKnightPossibleMoves(newBoard, selectedCase);
    }
    else if (selectedChessCase.piece.startsWith("b")) {
        setBishopPossibleMoves(newBoard, selectedCase);
    }
    else if (selectedChessCase.piece.startsWith("r")) {
        setRookPossibleMoves(newBoard, selectedCase);
    }
    else if (selectedChessCase.piece.startsWith("q")) {
        setQueenPossibleMoves(newBoard, selectedCase);
    }
    else if (selectedChessCase.piece.startsWith("k")) {
        setKingPossibleMoves(newBoard, selectedCase);
    }    
    // Update the chessboard with the modified board
    if (setChessboard) {
        setChessboard(newBoard);
    }
}

function resetPossibleMoves(chessboard: ChessboardType, setChessboard?: (chessboard: ChessboardType) => void) {
    const newBoard = {
        ...chessboard,
        cases: chessboard.cases.map(row => row.map(cell => ({
            ...cell,
            isPossibleMove: false
        })))
    };

    // Update the chessboard with the modified board
    if (setChessboard) {
        setChessboard(newBoard);
    }
    return newBoard;
}

export default function Chessboard({ chessboard, setChessboard }: ChessboardProps) {
    const [draggedPiece, setDraggedPiece] = useState<{
        piece: string;
        fromRow: number;
        fromCol: number;
    } | null>(null);
    const [selectedCase, setSelectedCase] = useState<{ row: number; col: number } | null>(null);

    const handleDragStart = (row: number, col: number, piece?: string) => {
        if (piece) {
            setDraggedPiece({ piece, fromRow: row, fromCol: col });
        }
        else {
            setDraggedPiece({ piece: chessboard?.cases[row][col].piece ?? "", fromRow: row, fromCol: col });
        }
    };

    function selectCase(pos: { row: number; col: number } | null) {
        setSelectedCase(pos);
        if (chessboard && pos) {
            setPossibleMoves(chessboard, pos, setChessboard);
        }
        else if (chessboard) {
            resetPossibleMoves(chessboard, setChessboard);
        }
    };

    const handleDrop = (toRow: number, toCol: number) => {
        if (!setChessboard || !chessboard) return;
        
        let fromRow: number, fromCol: number, piece: string;
        
        // Check if we're dragging a piece or clicking on a possible move
        if (draggedPiece) {
            fromRow = draggedPiece.fromRow;
            fromCol = draggedPiece.fromCol;
            piece = draggedPiece.piece;
        } else if (selectedCase && chessboard.cases[selectedCase.row][selectedCase.col].piece) {
            fromRow = selectedCase.row;
            fromCol = selectedCase.col;
            piece = chessboard.cases[selectedCase.row][selectedCase.col].piece!;
        } else {
            return; // No piece to move
        }
        
        const newBoard = { 
            ...chessboard,
            cases: chessboard.cases.map(row => [...row])
        };
        
        if (newBoard.cases[toRow][toCol].isPossibleMove) {
            // Remove piece from original position
            newBoard.cases[fromRow][fromCol].piece = null;
            
            // Place piece at new position
            newBoard.cases[toRow][toCol].piece = piece as ChessCaseType["piece"];
            
            resetPossibleMoves(newBoard, setChessboard);
            setSelectedCase(null);
        } else {
            setChessboard(newBoard);
        }
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
            {chessboard.cases.map((row, rowIndex) =>
                row.map((chessCase, colIndex) => (
                    <ChessCase 
                        key={`${rowIndex}-${colIndex}`} 
                        chessCase={chessCase}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                        onDragStart={(row, col, piece) => handleDragStart(row, col, piece)}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        selectedCase={selectedCase}
                        selectCase={selectCase}
                    />
                ))
            )}
        </div>
    );
}