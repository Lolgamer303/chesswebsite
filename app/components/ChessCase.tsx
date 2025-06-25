import type { ChessCaseType } from "./Chesstypes";
import Image from "next/image";

interface ChessCaseProps {
    chessCase: ChessCaseType;
    rowIndex?: number;
    colIndex?: number;
    onDragStart?: (piece: string, row: number, col: number) => void;
    onDrop?: (toRow: number, toCol: number) => void;
    onDragEnd?: () => void;
}

export function ChessCase({ 
    chessCase, 
    rowIndex = 0, 
    colIndex = 0, 
    onDragStart, 
    onDrop, 
    onDragEnd 
}: ChessCaseProps) {
    const handleDragStart = (e: React.DragEvent) => {
        if (chessCase.piece && onDragStart && rowIndex !== undefined && colIndex !== undefined) {
            onDragStart(chessCase.piece, rowIndex, colIndex);
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (onDrop && rowIndex !== undefined && colIndex !== undefined) {
            onDrop(rowIndex, colIndex);
        }
    };

    const handleDragEnd = () => {
        if (onDragEnd) {
            onDragEnd();
        }
    };
    return (
        <div
            className={`aspect-square w-30 ${chessCase.color === "white" ? "bg-[#d1d4cd]" : "bg-[#4e7837]"}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {chessCase.piece && (
                <div className="flex items-center justify-center h-full">
                    <Image
                        src={`/chesspieces/Chess_${chessCase.piece}t45.svg`}
                        alt={chessCase.piece}
                        width={120}
                        height={120}
                        className="object-contain cursor-pointer"
                        draggable={true}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                </div>
            )}
        </div>
    )
}