import { Trash } from "lucide-react";
import BlockSelector from "./BlockSelector";

export type ToolType = "block_middle" | "block_left" | "block_right" | "erase";

export const Toolbar = () => {
    return (
        <div className="flex items-end gap-2 bg-slate-500 p-2 rounded-lg  shadow-lg absolute bottom-0">
            <div>
                <p className="text-white font-bold">Blocks</p>
                <BlockSelector />
            </div>
            <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <Trash />
            </button>
            <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                START
            </button>
            <button className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                FINISH
            </button>
        </div>
    );
};

