import { useState } from "react";
import { ChessCase } from "./ChessCase";
import type { ChessboardType, ChessCaseType } from "./Chesstypes";
import { isCheckmate, setBishopPossibleMoves, setKingPossibleMoves, setKnightPossibleMoves, setPawnPossibleMoves, setQueenPossibleMoves, setRookPossibleMoves, updateCheckStatus } from "./ChessPossiblesMoves";

interface ChessboardProps {
    chessboard?: ChessboardType;
    setChessboard?: (chessboard: ChessboardType) => void;
}

function setPossibleMoves(chessboard: ChessboardType, selectedCase: { row: number; col: number }, setChessboard?: (chessboard: ChessboardType) => void) {
    const selectedChessCase = chessboard.cases[selectedCase.row][selectedCase.col];
    // Make a deep copy and clear possible moves locally, not via setChessboard
    const newBoard: ChessboardType = {
        ...chessboard,
        cases: chessboard.cases.map(row =>
            row.map(cell => ({ ...cell, isPossibleMove: false }))
        ),
        moveHistory: {
            hasKingMoved: { ...chessboard.moveHistory.hasKingMoved },
            hasRookMoved: {
                white: { ...chessboard.moveHistory.hasRookMoved.white },
                black: { ...chessboard.moveHistory.hasRookMoved.black }
            }
        },
        kingPositions: { ...chessboard.kingPositions }
    };
    if (!selectedChessCase.piece) {
        if (setChessboard) setChessboard(newBoard);
        return;
    }

    // Check if it's the correct player's turn
    const pieceColor = selectedChessCase.piece.endsWith("l") ? "white" : "black";
    if (pieceColor !== chessboard.currentTurn) {
        if (setChessboard) setChessboard(newBoard);
        return;
    }

    // Set possible moves on the local copy
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
    // Only now update the board
    if (setChessboard) {
        setChessboard(newBoard);
    }
}

function checkmate() {
    alert("Checkmate! Game over.");
}

function resetPossibleMoves(chessboard: ChessboardType) {
    // Only return a new board, don't call setChessboard here!
    return {
        ...chessboard,
        cases: chessboard.cases.map(row => row.map(cell => ({
            ...cell,
            isPossibleMove: false
        }))),
        moveHistory: { ...chessboard.moveHistory }
    };
}

export default function Chessboard({ chessboard, setChessboard }: ChessboardProps) {
    const [draggedPiece, setDraggedPiece] = useState<{
        piece: string;
        fromRow: number;
        fromCol: number;
    } | null>(null);
    const [selectedCase, setSelectedCase] = useState<{ row: number; col: number } | null>(null);

    const handleDragStart = (row: number, col: number, piece?: string) => {
        const currentPiece = piece || chessboard?.cases[row][col].piece;
        if (!currentPiece || !chessboard) return;
        
        // Check if it's the correct player's turn
        const pieceColor = currentPiece.endsWith("l") ? "white" : "black";
        if (pieceColor !== chessboard.currentTurn) return;
        
        setDraggedPiece({ 
            piece: currentPiece, 
            fromRow: row, 
            fromCol: col 
        });
    };

    function selectCase(pos: { row: number; col: number } | null) {
        setSelectedCase(pos);
        if (chessboard && pos) {
            setPossibleMoves(chessboard, pos, setChessboard);
        }
        else if (chessboard) {
            const cleared = resetPossibleMoves(chessboard);
            if (setChessboard) setChessboard(cleared);
        }
    };

    const handleDrop = (toRow: number, toCol: number) => {
        console.log("handleDrop called:", { toRow, toCol, draggedPiece, selectedCase });
        
        if (!setChessboard || !chessboard) return;
        
        let fromRow: number, fromCol: number, piece: string;
        
        // Check if we're dragging a piece or clicking on a possible move
        if (draggedPiece) {
            console.log("Using draggedPiece");
            fromRow = draggedPiece.fromRow;
            fromCol = draggedPiece.fromCol;
            piece = draggedPiece.piece;
        } else if (selectedCase && chessboard.cases[selectedCase.row][selectedCase.col].piece) {
            console.log("Using selectedCase");
            fromRow = selectedCase.row;
            fromCol = selectedCase.col;
            piece = chessboard.cases[selectedCase.row][selectedCase.col].piece!;
        } else {
            console.log("No piece to move - returning");
            return; // No piece to move
        }
        
        console.log("Move details:", { fromRow, fromCol, toRow, toCol, piece });
        
        // Check if it's the correct player's turn
        const pieceColor = piece.endsWith("l") ? "white" : "black";
        if (pieceColor !== chessboard.currentTurn) {
            console.log("Wrong turn - returning");
            setDraggedPiece(null);
            setSelectedCase(null);
            return;
        }
        
        // Check if this is a valid move (target square is a possible move)
        const isPossible = chessboard.cases[toRow][toCol].isPossibleMove;
        console.log("Is possible move:", isPossible);
        
        if (!isPossible) {
            console.log("Not a possible move - returning");
            setDraggedPiece(null);
            setSelectedCase(null);
            return;
        }
        
        console.log("Executing move...");
        
        const newBoard = { 
            ...chessboard,
            cases: chessboard.cases.map(row => [...row]),
            moveHistory: {
                hasKingMoved: { ...chessboard.moveHistory.hasKingMoved },
                hasRookMoved: {
                    white: { ...chessboard.moveHistory.hasRookMoved.white },
                    black: { ...chessboard.moveHistory.hasRookMoved.black }
                }
            }
        };
        
        // Execute the move since we know it's valid
        // Check if this is a castling move
        const isCastling = piece.startsWith("k") && Math.abs(toCol - fromCol) === 2;
        
        if (isCastling) {
            // Handle castling
            const isKingside = toCol > fromCol;
            const rookFromCol = isKingside ? 7 : 0;
            const rookToCol = isKingside ? 5 : 3;
            const backRank = fromRow;
            
            // Move king
            newBoard.cases[fromRow][fromCol].piece = null;
            newBoard.cases[toRow][toCol].piece = piece as ChessCaseType["piece"];
            
            // Move rook
            const rookPiece = newBoard.cases[backRank][rookFromCol].piece;
            newBoard.cases[backRank][rookFromCol].piece = null;
            newBoard.cases[backRank][rookToCol].piece = rookPiece;
            
            // Update castling rights
            newBoard.moveHistory.hasKingMoved[pieceColor] = true;
            if (isKingside) {
                newBoard.moveHistory.hasRookMoved[pieceColor].kingside = true;
            } else {
                newBoard.moveHistory.hasRookMoved[pieceColor].queenside = true;
            }
        } else {
            // Regular move
            newBoard.cases[fromRow][fromCol].piece = null;
            newBoard.cases[toRow][toCol].piece = piece as ChessCaseType["piece"];
            // Track piece movements for castling rights
            if (piece.startsWith("k")) {
                newBoard.moveHistory.hasKingMoved[pieceColor] = true;
            } else if (piece.startsWith("r")) {
                // Check which rook moved
                const isKingsideRook = (pieceColor === "white" && fromRow === 7 && fromCol === 7) ||
                                     (pieceColor === "black" && fromRow === 0 && fromCol === 7);
                const isQueensideRook = (pieceColor === "white" && fromRow === 7 && fromCol === 0) ||
                                      (pieceColor === "black" && fromRow === 0 && fromCol === 0);
                
                if (isKingsideRook) {
                    newBoard.moveHistory.hasRookMoved[pieceColor].kingside = true;
                } else if (isQueensideRook) {
                    newBoard.moveHistory.hasRookMoved[pieceColor].queenside = true;
                }
            }
        }
        
        // Update king positions after the move
        if (piece.startsWith("k")) {
            const kingColor = piece.endsWith("l") ? "white" : "black";
            newBoard.kingPositions[kingColor] = { row: toRow, col: toCol };
        }
        
        // Switch turns
        newBoard.currentTurn = (newBoard.currentTurn === "white" ? "black" : "white") as "white" | "black";

        // Update check status for the new current player (who just became the active player)
        updateCheckStatus(newBoard);
        
        // Check for checkmate
        if (newBoard.isInCheck && isCheckmate(newBoard)) {
            console.log("Checkmate detected!");
            checkmate();
        }
        
        // Reset possible moves and update the board
        const finalBoard = {
            ...newBoard,
            cases: newBoard.cases.map(row => row.map(cell => ({
                ...cell,
                isPossibleMove: false
            })))
        };
        
        setChessboard(finalBoard);
        
        // Always clear selection and draggedPiece after any move attempt
        setSelectedCase(null);
        setDraggedPiece(null);
    };

    const handleDragEnd = () => {
        setDraggedPiece(null);
    };

    const switchTurn = () => {
        if (!chessboard || !setChessboard) return;
        const newBoard = {
            ...chessboard,
            currentTurn: (chessboard.currentTurn === "white" ? "black" : "white") as "white" | "black"
        };
        setChessboard(newBoard);
    };
    
    const handleToggleHighlight = (row: number, col: number) => {
        if (!chessboard || !setChessboard) return;
        
        const newBoard = {
            ...chessboard,
            cases: chessboard.cases.map((boardRow, rowIndex) =>
                boardRow.map((cell, colIndex) =>
                    rowIndex === row && colIndex === col
                        ? { ...cell, isHighlighted: !cell.isHighlighted }
                        : cell
                )
            )
        };
        
        setChessboard(newBoard);
    };
    const resetHighlight = () => {
        if (!chessboard || !setChessboard) return;
        const newBoard = {
            ...chessboard,
            cases: chessboard.cases.map(row => row.map(cell => ({
                ...cell,
                isHighlighted: false
            })))
        };

        setChessboard(newBoard);
    };

    if (!chessboard) {
        return <div>Loading chessboard...</div>;
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-bold">
                Current Turn: <span className={chessboard.currentTurn === "white" ? "text-gray-700" : "text-gray-900"}>
                    {chessboard.currentTurn === "white" ? "White" : "Black"}
                </span>
            </div>
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
                            onToggleHighlight={handleToggleHighlight}
                            switchTurn={switchTurn}
                            resetpossibleMoves={() => {
                                if (chessboard && setChessboard) {
                                    const cleared = {
                                        ...chessboard,
                                        cases: chessboard.cases.map(row => row.map(cell => ({
                                            ...cell,
                                            isPossibleMove: false
                                        }))),
                                        currentTurn: chessboard.currentTurn === "white" ? "black" : "white" as "white" | "black",
                                    };
                                    setChessboard(cleared);
                                }
                            }}
                            resetHighlight={resetHighlight}
                        
                        
                        
                        
                        
                        
                        />
                    ))
                )}
            </div>
        </div>
    );
}