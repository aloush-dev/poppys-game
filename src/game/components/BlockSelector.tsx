import { useState, useCallback, useRef } from "react";
import block from "/assets/block_middle.png?url";
import blockLeft from "/assets/block_left.png?url";
import blockRight from "/assets/block_right.png";
import { EventBus } from "../EventBus";

type BlockType = "block_middle" | "block_left" | "block_right";

const blockIcons = {
    block_middle: block,
    block_left: blockLeft,
    block_right: blockRight,
};

export default function BlockSelector() {
    const [selectedBlock, setSelectedBlock] =
        useState<BlockType>("block_middle");
    const [showSelector, setShowSelector] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = useCallback(() => {
        longPressTimer.current = setTimeout(() => {
            setShowSelector(true);
        }, 500);
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    }, []);

    const selectBlock = useCallback((block: BlockType) => {
        setSelectedBlock(block);
        EventBus.emit("toolSelected", block);
        setShowSelector(false);
    }, []);

    return (
        <div className="relative">
            <button
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                <img
                    src={blockIcons[selectedBlock]}
                    alt={`${selectedBlock} block`}
                    className="w-10 h-10"
                />
            </button>

            {showSelector && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-800 rounded-lg p-2 flex space-x-2">
                    {Object.entries(blockIcons).map(([type, icon]) => (
                        <button
                            key={type}
                            className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => selectBlock(type as BlockType)}
                        >
                            <img
                                src={icon}
                                alt={`${type} block`}
                                className="w-8 h-8"
                            />
                        </button>
                    ))}
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setShowSelector(false)}
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}

