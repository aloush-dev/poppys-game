// import { EventBus } from "../game/EventBus";
import BlockSelector from "./BlockSelector";

export type ToolType = "block_middle" | "block_left" | "block_right" | "erase";

export const Toolbar = () => {
    return (
        <div className="flex flex-col items-center bg-slate-500 p-2 rounded-lg  shadow-lg">
            <div>
                <p className="text-white font-bold">Blocks</p>
                <BlockSelector />
            </div>
        </div>
    );
};

