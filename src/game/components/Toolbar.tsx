import { Trash } from "lucide-react";
import BlockSelector from "./BlockSelector";
import { EventBus } from "../EventBus";

export type ToolType =
    | "block_middle"
    | "block_left"
    | "block_right"
    | "erase"
    | "start"
    | "end";

export const Toolbar = () => {
    return (
        <div className="flex flex-col gap-2 bg-slate-500 p-2 rounded-lg  shadow-lg items-start">
            <div>
                <p className="text-white font-bold">Blocks</p>
                <BlockSelector />
            </div>
            <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <Trash />
            </button>
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

