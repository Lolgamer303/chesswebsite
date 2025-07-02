import { ChessboardType, ChessCaseType } from "./Chesstypes";
function canAttackKing(
    newBoard: ChessboardType,
    pieceCase: ChessCaseType,
    pieceCasePosition: { row: number; col: number },
    kingPosition: { row: number; col: number }
): boolean {
    if (!pieceCase.piece) return false;
    
    const { row: pieceRow, col: pieceCol } = pieceCasePosition;
    const { row: kingRow, col: kingCol } = kingPosition;
    const piece = pieceCase.piece;
    const isLight = piece.endsWith("l");
    
    if (piece.startsWith("p")) {
        // Pawn attack pattern
        const forwardRow = pieceRow + (isLight ? -1 : 1);
        return (forwardRow === kingRow && Math.abs(pieceCol - kingCol) === 1);
    } else if (piece.startsWith("n")) {
        // Knight attack pattern
        const rowDiff = Math.abs(pieceRow - kingRow);
        const colDiff = Math.abs(pieceCol - kingCol);
        console.log("rowDiff:", rowDiff, "colDiff:", colDiff);
        console.log("piece:", piece, "kingPosition:", kingPosition);
        console.log("isLight:", isLight);
        console.log("pieceCasePosition:", pieceCasePosition);
        console.log(((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) ? true : false);
        return ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) ? true : false;
    } else if (piece.startsWith("b")) {
        // Bishop attack pattern - diagonal
        const rowDiff = Math.abs(pieceRow - kingRow);
        const colDiff = Math.abs(pieceCol - kingCol);
        if (rowDiff !== colDiff) return false;
        
        // Check if path is clear
        const rowDir = kingRow > pieceRow ? 1 : -1;
        const colDir = kingCol > pieceCol ? 1 : -1;
        for (let i = 1; i < rowDiff; i++) {
            if (newBoard.cases[pieceRow + i * rowDir][pieceCol + i * colDir].piece) {
                return false;
            }
        }
        return true;
    } else if (piece.startsWith("r")) {
        // Rook attack pattern - straight line
        if (pieceRow !== kingRow && pieceCol !== kingCol) return false;
        
        // Check if path is clear
        if (pieceRow === kingRow) {
            const start = Math.min(pieceCol, kingCol) + 1;
            const end = Math.max(pieceCol, kingCol);
            for (let c = start; c < end; c++) {
                if (newBoard.cases[pieceRow][c].piece) return false;
            }
        } else {
            const start = Math.min(pieceRow, kingRow) + 1;
            const end = Math.max(pieceRow, kingRow);
            for (let r = start; r < end; r++) {
                if (newBoard.cases[r][pieceCol].piece) return false;
            }
        }
        return true;
    } else if (piece.startsWith("q")) {
        // Queen combines rook and bishop - check both patterns directly
        // Check rook pattern
        const rookPattern = (pieceRow === kingRow || pieceCol === kingCol);
        if (rookPattern) {
            if (pieceRow === kingRow) {
                const start = Math.min(pieceCol, kingCol) + 1;
                const end = Math.max(pieceCol, kingCol);
                let pathClear = true;
                for (let c = start; c < end; c++) {
                    if (newBoard.cases[pieceRow][c].piece) {
                        pathClear = false;
                        break;
                    }
                }
                if (pathClear) return true;
            } else {
                const start = Math.min(pieceRow, kingRow) + 1;
                const end = Math.max(pieceRow, kingRow);
                let pathClear = true;
                for (let r = start; r < end; r++) {
                    if (newBoard.cases[r][pieceCol].piece) {
                        pathClear = false;
                        break;
                    }
                }
                if (pathClear) return true;
            }
        }
        
        // Check bishop pattern
        const rowDiff = Math.abs(pieceRow - kingRow);
        const colDiff = Math.abs(pieceCol - kingCol);
        if (rowDiff === colDiff) {
            const rowDir = kingRow > pieceRow ? 1 : -1;
            const colDir = kingCol > pieceCol ? 1 : -1;
            let pathClear = true;
            for (let i = 1; i < rowDiff; i++) {
                if (newBoard.cases[pieceRow + i * rowDir][pieceCol + i * colDir].piece) {
                    pathClear = false;
                    break;
                }
            }
            if (pathClear) return true;
        }
        
        return false;
    } else if (piece.startsWith("k")) {
        // King attack pattern - adjacent squares (but not the same square)
        const isAdjacent = Math.abs(pieceRow - kingRow) <= 1 && Math.abs(pieceCol - kingCol) <= 1;
        const isSameSquare = (pieceRow === kingRow && pieceCol === kingCol);
        return isAdjacent && !isSameSquare;
    }
    
    return false;
}

export function isKingInCheck(
    board: ChessboardType,
    kingColor?: "white" | "black"
): boolean {
    // If no color specified, use current turn
    const colorToCheck = kingColor || (board.currentTurn === "white" ? "white" : "black");
    const kingPosition = board.kingPositions[colorToCheck];
    const kingPiece = board.cases[kingPosition.row][kingPosition.col].piece;
    if (!kingPiece) return false;

    const isLight = kingPiece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";

    // Check for threats from all opponent pieces
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const targetCase = board.cases[r][c];
            if (
                targetCase.piece &&
                targetCase.piece.endsWith(opponentSuffix)
            ) {
                if (canAttackKing(board, targetCase, { row: r, col: c }, kingPosition)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function updateCheckStatus(board: ChessboardType): void {
    const kingPosition = board.kingPositions[board.currentTurn === "white" ? "white" : "black"];
    const kingPiece = board.cases[kingPosition.row][kingPosition.col].piece;
    if (!kingPiece) return;

    const isLight = kingPiece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";

    // Reset check status
    board.isInCheck = null;

    // Check for threats from all opponent pieces
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const targetCase = board.cases[r][c];
            if (
                targetCase.piece &&
                targetCase.piece.endsWith(opponentSuffix)
            ) {
                if (canAttackKing(board, targetCase, { row: r, col: c }, kingPosition)) {
                    board.isInCheck = isLight ? "white" : "black";
                    return;
                }
            }
        }
    }
}

export function isCheckmate(
    newBoard: ChessboardType,
) {
    let possiblemove = 0
    const kingPosition = newBoard.kingPositions[newBoard.currentTurn === "white" ? "white" : "black"];
    const { row, col } = kingPosition;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;
    
    const isLight = piece.endsWith("l");
    const suffix = isLight ? "l" : "d";

    // Store original king positions to restore later
    const originalKingPositions = {
        white: { ...newBoard.kingPositions.white },
        black: { ...newBoard.kingPositions.black }
    };

    // Reset all possible moves first
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            newBoard.cases[r][c].isPossibleMove = false;
        }
    }

    // Check all pieces on the board
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const currentCase = newBoard.cases[r][c];
            if (currentCase.piece && currentCase.piece.endsWith(suffix)) {
                // Create a deep copy of the board for testing moves
                const tempBoard: ChessboardType = {
                    ...newBoard,
                    cases: newBoard.cases.map((row) =>
                        row.map((cell) => ({ ...cell, isPossibleMove: false }))
                    ),
                    kingPositions: {
                        white: { ...newBoard.kingPositions.white },
                        black: { ...newBoard.kingPositions.black }
                    },
                    moveHistory: {
                        hasKingMoved: { ...newBoard.moveHistory.hasKingMoved },
                        hasRookMoved: {
                            white: { ...newBoard.moveHistory.hasRookMoved.white },
                            black: { ...newBoard.moveHistory.hasRookMoved.black }
                        }
                    }
                };

                // Get possible moves for this piece
                const currentPiecePosition = { row: r, col: c };
                if (currentCase.piece.startsWith("p")) {
                    setPawnPossibleMoves(tempBoard, currentPiecePosition);
                } else if (currentCase.piece.startsWith("n")) {
                    setKnightPossibleMoves(tempBoard, currentPiecePosition);
                } else if (currentCase.piece.startsWith("b")) {
                    setBishopPossibleMoves(tempBoard, currentPiecePosition);
                } else if (currentCase.piece.startsWith("r")) {
                    setRookPossibleMoves(tempBoard, currentPiecePosition);
                } else if (currentCase.piece.startsWith("q")) {
                    setQueenPossibleMoves(tempBoard, currentPiecePosition);
                } else if (currentCase.piece.startsWith("k")) {
                    setKingPossibleMoves(tempBoard, currentPiecePosition);
                }

                // Test each possible move
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const targetCase = tempBoard.cases[newRow][newCol];
                        if (targetCase.isPossibleMove) {
                            // Create a simulation board
                            const simulationBoard: ChessboardType = {
                                ...newBoard,
                                cases: newBoard.cases.map((row) =>
                                    row.map((cell) => ({ ...cell }))
                                ),
                                kingPositions: {
                                    white: { ...newBoard.kingPositions.white },
                                    black: { ...newBoard.kingPositions.black }
                                }
                            };
                            simulationBoard.cases[newRow][newCol].piece = currentCase.piece;
                            simulationBoard.cases[r][c].piece = null;

                            if (currentCase.piece.startsWith("k")) {
                                simulationBoard.kingPositions[isLight ? "white" : "black"] = {
                                    row: newRow,
                                    col: newCol
                                };
                            }

                            // Check if king is still in check using the simple check function
                            if (!isKingInCheck(simulationBoard, isLight ? "white" : "black")) {
                                possiblemove++;
                            }
                        }
                    }
                }

                // Restore original king positions after each piece check
                newBoard.kingPositions = {
                    white: { ...originalKingPositions.white },
                    black: { ...originalKingPositions.black }
                };
            }
        }
    }

    // Final restore of king positions
    newBoard.kingPositions = {
        white: { ...originalKingPositions.white },
        black: { ...originalKingPositions.black }
    };

    if (possiblemove > 0) {
        // If there's at least one possible move that doesn't leave the king in check, it's not checkmate
        return false;
    }
    // If no possible moves are found, it's checkmate
    return true;
}

export function setPawnPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number },
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const playerColor = isLight ? "white" : "black";

    const forwardRow = row + (isLight ? -1 : 1);
    const rightCol = col + 1;
    const leftCol = col - 1;

    const forwardCase = newBoard.cases[forwardRow]?.[col];
    const rightCase = newBoard.cases[forwardRow]?.[rightCol];
    const leftCase = newBoard.cases[forwardRow]?.[leftCol];
    
    // Forward move (one square)
    if (forwardCase && forwardCase.piece === null) {
        // Simulate the move to check if it's legal
        const originalPiece = forwardCase.piece;
        const originalFromPiece = newBoard.cases[row][col].piece;
        
        forwardCase.piece = piece;
        newBoard.cases[row][col].piece = null;

        // Check if the king is still in check after this move
        if (!isKingInCheck(newBoard, playerColor)) {
            forwardCase.isPossibleMove = true;
        }

        // Restore the original state
        newBoard.cases[row][col].piece = originalFromPiece;
        forwardCase.piece = originalPiece;

        // Two-square move on first move
        const isOnStartingRank = (isLight && row === 6) || (!isLight && row === 1);
        if (isOnStartingRank) {
            const twoSquareRow = row + (isLight ? -2 : 2);
            const twoSquareCase = newBoard.cases[twoSquareRow]?.[col];
            if (twoSquareCase && twoSquareCase.piece === null) {            // Simulate the two-square move
            const originalTwoSquarePiece = twoSquareCase.piece;
            const originalFromPiece = newBoard.cases[row][col].piece;
            
            twoSquareCase.piece = piece;
            newBoard.cases[row][col].piece = null;

            // Check if the king is still in check after this move
            if (!isKingInCheck(newBoard, playerColor)) {
                twoSquareCase.isPossibleMove = true;
            }

            // Restore the original state
            newBoard.cases[row][col].piece = originalFromPiece;
            twoSquareCase.piece = originalTwoSquarePiece;
            }
        }
    }

    // Capture right
    if (rightCase && rightCase.piece && rightCase.piece.endsWith(opponentSuffix)) {
        // Simulate the capture to check if it's legal
        const originalPiece = rightCase.piece;
        const originalFromPiece = newBoard.cases[row][col].piece;
        
        rightCase.piece = piece;
        newBoard.cases[row][col].piece = null;

        // Check if the king is still in check after this move
        if (!isKingInCheck(newBoard, playerColor)) {
            rightCase.isPossibleMove = true;
        }

        // Restore the original state
        newBoard.cases[row][col].piece = originalFromPiece;
        rightCase.piece = originalPiece;
    }
    
    // Capture left
    if (leftCase && leftCase.piece && leftCase.piece.endsWith(opponentSuffix)) {
        // Simulate the capture to check if it's legal
        const originalPiece = leftCase.piece;
        const originalFromPiece = newBoard.cases[row][col].piece;
        
        leftCase.piece = piece;
        newBoard.cases[row][col].piece = null;

        // Check if the king is still in check after this move
        if (!isKingInCheck(newBoard, playerColor)) {
            leftCase.isPossibleMove = true;
        }

        // Restore the original state
        newBoard.cases[row][col].piece = originalFromPiece;
        leftCase.piece = originalPiece;
    }
}

export function setKnightPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number }
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const playerColor = isLight ? "white" : "black";
    const knightMoves = [
        { row: -2, col: -1 },
        { row: -2, col: 1 },
        { row: -1, col: -2 },
        { row: -1, col: 2 },
        { row: 1, col: -2 },
        { row: 1, col: 2 },
        { row: 2, col: -1 },
        { row: 2, col: 1 },
    ];
    knightMoves.forEach((move) => {
        const newRow = row + move.row;
        const newCol = col + move.col;
        const targetCase = newBoard.cases[newRow]?.[newCol];
        if (targetCase) {
            if (targetCase.piece === null || targetCase.piece.endsWith(opponentSuffix)) {
                // Simulate the move to check if it's legal
                const originalPiece = targetCase.piece;
                const originalFromPiece = newBoard.cases[row][col].piece;
                
                targetCase.piece = piece;
                newBoard.cases[row][col].piece = null;

                // Check if the king is still in check after this move
                if (!isKingInCheck(newBoard, playerColor)) {
                    targetCase.isPossibleMove = true;
                }

                // Restore the original state
                newBoard.cases[row][col].piece = originalFromPiece;
                targetCase.piece = originalPiece;
            }
        }
    });
}

export function setBishopPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number }
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const playerColor = isLight ? "white" : "black";
    const directions = [
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
    ];
    directions.forEach((direction) => {
        let newRow = row;
        let newCol = col;
        while (true) {
            newRow += direction.row;
            newCol += direction.col;
            const targetCase = newBoard.cases[newRow]?.[newCol];
            if (!targetCase) break; // Out of bounds
            
            if (targetCase.piece === null || targetCase.piece.endsWith(opponentSuffix)) {
                // Simulate the move to check if it's legal
                const originalPiece = targetCase.piece;
                const originalFromPiece = newBoard.cases[row][col].piece;
                
                targetCase.piece = piece;
                newBoard.cases[row][col].piece = null;

                // Check if the king is still in check after this move
                if (!isKingInCheck(newBoard, playerColor)) {
                    targetCase.isPossibleMove = true;
                }

                // Restore the original state
                newBoard.cases[row][col].piece = originalFromPiece;
                targetCase.piece = originalPiece;

                // If we captured an opponent piece, stop here
                if (originalPiece && originalPiece.endsWith(opponentSuffix)) {
                    break;
                }
            } else {
                break; // Stop if own piece is encountered
            }
        }
    });
}

export function setRookPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number }
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const playerColor = isLight ? "white" : "black";
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];
    directions.forEach((direction) => {
        let newRow = row;
        let newCol = col;
        while (true) {
            newRow += direction.row;
            newCol += direction.col;
            const targetCase = newBoard.cases[newRow]?.[newCol];
            if (!targetCase) break; // Out of bounds
            
            if (targetCase.piece === null || targetCase.piece.endsWith(opponentSuffix)) {
                // Simulate the move to check if it's legal
                const originalPiece = targetCase.piece;
                const originalFromPiece = newBoard.cases[row][col].piece;
                
                targetCase.piece = piece;
                newBoard.cases[row][col].piece = null;

                // Check if the king is still in check after this move
                if (!isKingInCheck(newBoard, playerColor)) {
                    targetCase.isPossibleMove = true;
                }

                // Restore the original state
                newBoard.cases[row][col].piece = originalFromPiece;
                targetCase.piece = originalPiece;

                // If we captured an opponent piece, stop here
                if (originalPiece && originalPiece.endsWith(opponentSuffix)) {
                    break;
                }
            } else {
                break; // Stop if own piece is encountered
            }
        }
    });
}

export function setQueenPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number }
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    // Set bishop-like moves
    setBishopPossibleMoves(newBoard, selectedCase);

    // Set rook-like moves
    setRookPossibleMoves(newBoard, selectedCase);
}

export function setKingPossibleMoves(
    newBoard: ChessboardType,
    selectedCase: { row: number; col: number }
) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const playerColor = isLight ? "white" : "black";

    // Store original king position at the start
    const originalKingPosition = { ...newBoard.kingPositions[playerColor] };

    // Regular king moves
    const kingMoves = [
        { row: -1, col: -1 },
        { row: -1, col: 0 },
        { row: -1, col: 1 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
    ];
    kingMoves.forEach((move) => {
        const newRow = row + move.row;
        const newCol = col + move.col;
        const targetCase = newBoard.cases[newRow]?.[newCol];
        if (targetCase) {
            if (targetCase.piece === null || targetCase.piece.endsWith(opponentSuffix)) {
                // Simulate the move to check if it's legal
                const originalPiece = targetCase.piece;
                const originalFromPiece = newBoard.cases[row][col].piece;
                
                targetCase.piece = piece;
                newBoard.cases[row][col].piece = null;
                
                // Update king position temporarily for the check
                newBoard.kingPositions[playerColor] = { row: newRow, col: newCol };

                // Check if the king would be in check after this move
                if (!isKingInCheck(newBoard, playerColor)) {
                    targetCase.isPossibleMove = true;
                }

                // Restore the original state
                newBoard.cases[row][col].piece = originalFromPiece;
                targetCase.piece = originalPiece;
                newBoard.kingPositions[playerColor] = originalKingPosition;
            }
        }
    });

    // Castling logic - ensure king position is restored before castling checks
    newBoard.kingPositions[playerColor] = originalKingPosition;
    
    const hasKingMoved = newBoard.moveHistory.hasKingMoved[playerColor];
    if (!hasKingMoved) {
        const backRank = isLight ? 7 : 0;

        // Kingside castling (short castling)
        const hasKingsideRookMoved =
            newBoard.moveHistory.hasRookMoved[playerColor].kingside;
        if (!hasKingsideRookMoved && row === backRank && col === 4) {
            const kingsideRook = newBoard.cases[backRank][7];
            if (kingsideRook.piece === (isLight ? "rl" : "rd")) {
                // Check if squares between king and rook are empty
                const f1 = newBoard.cases[backRank][5];
                const g1 = newBoard.cases[backRank][6];
                if (f1.piece === null && g1.piece === null) {
                    // Check that king is not in check and doesn't pass through check
                    let canCastle = true;
                    
                    // Check current position (king not in check)
                    if (isKingInCheck(newBoard, playerColor)) {
                        canCastle = false;
                    }
                    
                    // Check intermediate square (f1)
                    if (canCastle) {
                        newBoard.cases[backRank][5].piece = piece;
                        newBoard.cases[row][col].piece = null;
                        newBoard.kingPositions[playerColor] = { row: backRank, col: 5 };
                        
                        if (isKingInCheck(newBoard, playerColor)) {
                            canCastle = false;
                        }
                        
                        // Restore
                        newBoard.cases[row][col].piece = piece;
                        newBoard.cases[backRank][5].piece = null;
                        newBoard.kingPositions[playerColor] = originalKingPosition;
                    }
                    
                    // Check final position (g1)
                    if (canCastle) {
                        newBoard.cases[backRank][6].piece = piece;
                        newBoard.cases[row][col].piece = null;
                        newBoard.kingPositions[playerColor] = { row: backRank, col: 6 };
                        
                        if (isKingInCheck(newBoard, playerColor)) {
                            canCastle = false;
                        }
                        
                        // Restore
                        newBoard.cases[row][col].piece = piece;
                        newBoard.cases[backRank][6].piece = null;
                        newBoard.kingPositions[playerColor] = originalKingPosition;
                    }
                    
                    if (canCastle) {
                        newBoard.cases[backRank][6].isPossibleMove = true;
                    }
                }
            }
        }

        // Queenside castling (long castling)
        const hasQueensideRookMoved =
            newBoard.moveHistory.hasRookMoved[playerColor].queenside;
        if (!hasQueensideRookMoved && row === backRank && col === 4) {
            const queensideRook = newBoard.cases[backRank][0];
            if (queensideRook.piece === (isLight ? "rl" : "rd")) {
                // Check if squares between king and rook are empty
                const d1 = newBoard.cases[backRank][3];
                const c1 = newBoard.cases[backRank][2];
                const b1 = newBoard.cases[backRank][1];
                if (
                    d1.piece === null &&
                    c1.piece === null &&
                    b1.piece === null
                ) {
                    // Check that king is not in check and doesn't pass through check
                    let canCastle = true;
                    
                    // Check current position (king not in check)
                    if (isKingInCheck(newBoard, playerColor)) {
                        canCastle = false;
                    }
                    
                    // Check intermediate square (d1)
                    if (canCastle) {
                        newBoard.cases[backRank][3].piece = piece;
                        newBoard.cases[row][col].piece = null;
                        newBoard.kingPositions[playerColor] = { row: backRank, col: 3 };
                        
                        if (isKingInCheck(newBoard, playerColor)) {
                            canCastle = false;
                        }
                        
                        // Restore
                        newBoard.cases[row][col].piece = piece;
                        newBoard.cases[backRank][3].piece = null;
                        newBoard.kingPositions[playerColor] = originalKingPosition;
                    }
                    
                    // Check final position (c1)
                    if (canCastle) {
                        newBoard.cases[backRank][2].piece = piece;
                        newBoard.cases[row][col].piece = null;
                        newBoard.kingPositions[playerColor] = { row: backRank, col: 2 };
                        
                        if (isKingInCheck(newBoard, playerColor)) {
                            canCastle = false;
                        }
                        
                        // Restore
                        newBoard.cases[row][col].piece = piece;
                        newBoard.cases[backRank][2].piece = null;
                        newBoard.kingPositions[playerColor] = originalKingPosition;
                    }
                    
                    if (canCastle) {
                        newBoard.cases[backRank][2].isPossibleMove = true;
                    }
                }
            }
        }
    }

    // Final restore to ensure king position is correct
    newBoard.kingPositions[playerColor] = originalKingPosition;
}