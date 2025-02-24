import { PlayCircleIcon } from "lucide-react";
import { SavedLevel } from "../../lib/types";
import { Link } from "@tanstack/react-router";

export const LevelCard = ({ level }: { level: SavedLevel }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40"></div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <button className="transition-all hover:scale-up-center relative hover:ring-4 hover:ring-offset-2 rounded-full hover:ring-green-600">
                        <div className="w-full h-full flex flex-col justify-center peer ">
                            <PlayCircleIcon
                                className="text-green-500"
                                size={38}
                            />
                        </div>
                    </button>
                </div>
                <p className="text-gray-600 mb-2">by {level.creator}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {level.plays} plays
                    </span>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{level.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SavedLevelCard = ({ level }: { level: SavedLevel }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40"></div>
            <div className="p-4">
                <div className="flex flex-col justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <div>
                        <Link
                            to="/create"
                            search={{ levelId: level.id }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                            EDIT
                        </Link>
                        <button>publish</button>
                    </div>
                </div>
                <div className="flex justify-between items-center"></div>
            </div>
        </div>
    );
};

