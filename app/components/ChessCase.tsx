import type { ChessCaseType } from "./Chesstypes";
import Image from "next/image";

interface ChessCaseProps {
    selectedCase?: { row: number; col: number } | null;
    chessCase: ChessCaseType;
    rowIndex?: number;
    colIndex?: number;
    onDragStart?: (row: number, col: number, piece?: string) => void;
    onDrop?: (toRow: number, toCol: number) => void;
    onDragEnd?: () => void;
    selectCase: (pos: { row: number; col: number } | null) => void;
    onToggleHighlight?: (row: number, col: number) => void; // Add this
    switchTurn?: () => void; // Add this if you need to switch turns
    resetpossibleMoves?: () => void; // Add this if you need to reset possible moves
    resetHighlight?: () => void; // Add this if you need to reset highlights
}

export function ChessCase({
    chessCase,
    rowIndex,
    colIndex,
    onDragStart,
    onDrop,
    onDragEnd,
    selectedCase,
    selectCase,
    onToggleHighlight, // Add this
    switchTurn, // Add this if you need to switch turns
    resetpossibleMoves, // Add this if you need to reset possible moves
    resetHighlight, // Add this if you need to reset highlights
}: ChessCaseProps) {
    const isSelected =
        selectedCase?.row === rowIndex && selectedCase?.col === colIndex;
    // Handle drag and drop events
    const handleDragStart = (e: React.DragEvent | null) => {
        if (
            onDragStart &&
            rowIndex !== undefined &&
            colIndex !== undefined &&
            (chessCase.piece || !e)
        ) {
            onDragStart(rowIndex, colIndex, chessCase.piece || undefined);
            if (e) {
                e.dataTransfer.effectAllowed = "move";
            }
        }
        selectCase({ row: rowIndex ?? 0, col: colIndex ?? 0 });
    };

    const handleDragOver = (e: React.DragEvent | null) => {
        if (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        }
    };

    const handleDrop = (e: React.DragEvent | null) => {
        e?.preventDefault();
        if (onDrop && rowIndex !== undefined && colIndex !== undefined) {
            onDrop(rowIndex, colIndex);
            // Don't call selectCase(null) here - let the parent handle it
            switchTurn?.(); // Call switchTurn after move
        }
    };

    const handleDragEnd = () => {
        if (onDragEnd) {
            onDragEnd();
        }
    };
    return (
        <button
            className={`aspect-square w-30  ${
                isSelected
                    ? chessCase.color === "white"
                        ? "bg-[#F5F682]"
                        : "bg-[#B9CA43]"
                    : chessCase.isHighlighted
                        ? chessCase.color === "white"
                            ? "bg-red-200" // Different color to distinguish from selection
                            : "bg-red-400"
                        : chessCase.color === "white"
                            ? "bg-[#EBECD0]"
                            : "bg-[#739552]"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onContextMenu={(e) => {
                e.preventDefault();
                if (rowIndex !== undefined && colIndex !== undefined && onToggleHighlight) {
                    onToggleHighlight(rowIndex, colIndex); // Use callback instead
                }
            }}
            onClick={() => {
                console.log("ChessCase clicked:", { 
                    rowIndex, 
                    colIndex, 
                    isPossibleMove: chessCase.isPossibleMove, 
                    selectedCase, 
                    hasPiece: !!chessCase.piece 
                });
                
                if (chessCase.isPossibleMove && selectedCase) {
                    console.log("Making move via click");
                    // Move the selected piece to this position
                    if (
                        onDrop &&
                        rowIndex !== undefined &&
                        colIndex !== undefined
                    ) {
                        onDrop(rowIndex, colIndex);
                        switchTurn?.(); // Call switchTurn after move
                        resetpossibleMoves?.(); // Reset possible moves after move
                    }
                } else {
                    if (isSelected) {
                        selectCase(null);
                        resetHighlight?.(); // Reset highlights when deselecting
                    } else {
                        // Only reset highlights if we're not selecting a piece
                        if (!chessCase.piece) {
                            resetHighlight?.();
                        }
                        selectCase({ row: rowIndex ?? 0, col: colIndex ?? 0 });
                    }
                }
            }}
        >
            <div className='relative w-full h-full'>
                {chessCase.piece && (
                    <div className='flex items-center justify-center h-full'>
                        <Image
                            src={`/chesspieces/Chess_${chessCase.piece}t45.svg`}
                            alt={chessCase.piece}
                            width={120}
                            height={120}
                            className='object-contain cursor-pointer'
                            draggable={true}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    </div>
                )}
                {chessCase.isHighlighted && (
                    <div className={`absolute inset-0 flex items-center justify-center -z-50 pointer-events-none ${chessCase.color === "white" ? "bg-[#EB7D6A]" : "bg-[#D36C50]"}`}>
                    </div>
                )}
                {chessCase.isPossibleMove && !chessCase.piece && (
                    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                        <div className={`w-10 h-10 ${chessCase.color === "white" ? "bg-[#CACBB3]" : "bg-[#638046]"} rounded-full`}></div>
                    </div>
                )}
                {chessCase.isPossibleMove && chessCase.piece && (
                    <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                        <div className={`w-27 h-27 bg-transparent border-12 opacity-85 ${chessCase.color === "white" ? "border-[#CACBB3]" : "border-[#638046]"} rounded-full`}></div>
                    </div>
                )}

            </div>
        </button>
    );
}
