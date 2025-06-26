import { ChessboardType } from "./Chesstypes";

export function setPawnPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;
    
    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";

    const forwardRow = row + (isLight ? -1 : 1);
    const rightCol = col + 1;
    const leftCol = col - 1;

    const forwardCase = newBoard.cases[forwardRow]?.[col];
    const rightCase = newBoard.cases[forwardRow]?.[rightCol];
    const leftCase = newBoard.cases[forwardRow]?.[leftCol];

    // Forward move
    if (forwardCase && forwardCase.piece === null) {
        forwardCase.isPossibleMove = true;
    }
    // Capture right
    if (
        rightCase &&
        rightCase.piece &&
        rightCase.piece.endsWith(opponentSuffix)
    ) {
        rightCase.isPossibleMove = true;
    }
    // Capture left
    if (
        leftCase &&
        leftCase.piece &&
        leftCase.piece.endsWith(opponentSuffix)
    ) {
        leftCase.isPossibleMove = true;
    }
}

export function setKnightPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const knightMoves = [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
    ];
    knightMoves.forEach(move => {
        const newRow = row + move.row;
        const newCol = col + move.col;
        const targetCase = newBoard.cases[newRow]?.[newCol];
        if (targetCase) {
            if (targetCase.piece === null) {
                targetCase.isPossibleMove = true;
            } else if (targetCase.piece.endsWith(opponentSuffix)) {
                targetCase.isPossibleMove = true;
            }
        }
    });
}

export function setBishopPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const directions = [
        { row: -1, col: -1 }, { row: -1, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 1 }
    ];
    directions.forEach(direction => {
        let newRow = row;
        let newCol = col;
        while (true) {
            newRow += direction.row;
            newCol += direction.col;
            const targetCase = newBoard.cases[newRow]?.[newCol];
            if (!targetCase) break; // Out of bounds
            if (targetCase.piece === null) {
                targetCase.isPossibleMove = true;
            } else if (targetCase.piece.endsWith(opponentSuffix)) {
                targetCase.isPossibleMove = true;
                break; // Stop after capturing
            } else {
                break; // Stop if own piece is encountered
            }
        }
    });
}
export function setRookPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const directions = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
    ];
    directions.forEach(direction => {
        let newRow = row;
        let newCol = col;
        while (true) {
            newRow += direction.row;
            newCol += direction.col;
            const targetCase = newBoard.cases[newRow]?.[newCol];
            if (!targetCase) break; // Out of bounds
            if (targetCase.piece === null) {
                targetCase.isPossibleMove = true;
            } else if (targetCase.piece.endsWith(opponentSuffix)) {
                targetCase.isPossibleMove = true;
                break; // Stop after capturing
            } else {
                break; // Stop if own piece is encountered
            }
        }
    });
}

export function setQueenPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;

    // Set bishop-like moves
    setBishopPossibleMoves(newBoard, selectedCase);
    
    // Set rook-like moves
    setRookPossibleMoves(newBoard, selectedCase);
}

export function setKingPossibleMoves(newBoard: ChessboardType, selectedCase: { row: number; col: number }) {
    const { row, col } = selectedCase;
    const piece = newBoard.cases[row][col].piece;
    if (!piece) return;
    const isLight = piece.endsWith("l");
    const opponentSuffix = isLight ? "d" : "l";
    const kingMoves = [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];
    kingMoves.forEach(move => {
        const newRow = row + move.row;
        const newCol = col + move.col;
        const targetCase = newBoard.cases[newRow]?.[newCol];
        if (targetCase) {
            if (targetCase.piece === null) {
                targetCase.isPossibleMove = true;
            } else if (targetCase.piece.endsWith(opponentSuffix)) {
                targetCase.isPossibleMove = true;
            }
        }
    });
}
