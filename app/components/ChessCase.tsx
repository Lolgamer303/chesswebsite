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
            selectCase(null);
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
                        ? "bg-yellow-300"
                    : chessCase.color === "white"
                        ? "bg-[#EBECD0]"
                        : "bg-[#739552]"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => {
                if (chessCase.isPossibleMove && selectedCase) {
                    // Move the selected piece to this position
                    if (
                        onDrop &&
                        rowIndex !== undefined &&
                        colIndex !== undefined
                    ) {
                        onDrop(rowIndex, colIndex);
                    }
                } else {
                    if (isSelected) {
                        selectCase(null);
                    } else {
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
