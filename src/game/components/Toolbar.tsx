import { Pointer, RotateCw, Trash } from "lucide-react";
import { EventBus } from "../EventBus";
import block from "/assets/block_middle.png?url";
import blockLeft from "/assets/block_left.png?url";
import blockRight from "/assets/block_right.png";

export type ToolType =
    | "block_middle"
    | "block_left"
    | "block_right"
    | "select"
    | "start"
    | "end"
    | "delete";

export const Toolbar = () => {
    return (
        <div className="flex flex-col gap-2 bg-slate-500 p-2 rounded-lg  shadow-lg items-start">
            <div>
                <p className="text-white font-bold">Blocks</p>
                <div className="flex gap-2">
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() =>
                            EventBus.emit("toolSelected", "block_middle")
                        }
                    >
                        <img
                            src={block}
                            alt={`middle block`}
                            className="w-8 h-8"
                        />
                    </button>
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() =>
                            EventBus.emit("toolSelected", "block_left")
                        }
                    >
                        <img
                            src={blockLeft}
                            alt={`left block`}
                            className="w-8 h-8"
                        />
                    </button>
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() =>
                            EventBus.emit("toolSelected", "block_right")
                        }
                    >
                        <img
                            src={blockRight}
                            alt={`right block`}
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            </div>
            <div>
                <p className="text-white font-bold">Points</p>
                <div className="flex gap-2">
                    <button
                        className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                        onClick={() => {
                            EventBus.emit("toolSelected", "start");
                        }}
                    >
                        START
                    </button>
                    <button
                        className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                        onClick={() => {
                            EventBus.emit("toolSelected", "end");
                        }}
                    >
                        FINISH
                    </button>
                </div>
            </div>
            <button
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                onClick={() => EventBus.emit("toolSelected", "delete")}
            >
                <Trash />
            </button>
            <button className="w-12 h-12 bg-gray-700 ZFrounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <RotateCw />
            </button>
            <button
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                onClick={() => EventBus.emit("toolSelected", "select")}
            >
                <Pointer />
            </button>
            <div>
                <button
                    className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                    onClick={() => {
                        EventBus.emit();
                    }}
                >
                    TEST
                </button>
            </div>
            <div>
                <button
                    className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                    onClick={() => {
                        EventBus.emit("saveLevel");
                    }}
                >
                    SAVE
                </button>
            </div>
        </div>
    );
};

