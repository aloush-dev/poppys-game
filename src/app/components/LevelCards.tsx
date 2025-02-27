import {
    Edit,
    Play,
    PlayCircleIcon,
    Rocket,
    ThumbsUp,
    Trash,
} from "lucide-react";
import { SavedLevel } from "../../lib/types";
import { Link } from "@tanstack/react-router";
import { deleteSavedLevel } from "@/firebase/firestore";
import { generateLevelPreviewSVG } from "@/lib/generatePreview";

export const LevelCard = ({ level }: { level: SavedLevel }) => {
    const levelPreviewSVG = generateLevelPreviewSVG(level);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40">
                <div dangerouslySetInnerHTML={{ __html: levelPreviewSVG }} />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <button className="transition-all hover:scale-up-center relative hover:ring-4 hover:ring-offset-2 rounded-full hover:ring-green-600">
                        <Link
                            to="/play"
                            search={{ levelId: level.id }}
                            className="w-full h-full flex flex-col justify-center peer "
                        >
                            <PlayCircleIcon
                                className="text-green-500"
                                size={38}
                            />
                        </Link>
                    </button>
                </div>
                <p className="text-gray-600 mb-2">by {level.creator}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {level.plays || 0} plays
                    </span>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">
                            <ThumbsUp />
                        </span>
                        <span>{level.likes || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const SavedLevelCard = ({ level }: { level: SavedLevel }) => {
    const levelPreviewSVG = generateLevelPreviewSVG(level);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40">
                <div dangerouslySetInnerHTML={{ __html: levelPreviewSVG }} />
            </div>
            <div className="p-4">
                <div className="flex flex-col justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <div className="flex justify-between items-center w-full gap-2">
                        <Link
                            to="/create"
                            search={{ levelId: level.id }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-md flex justify-center items-center gap-1"
                        >
                            <Edit size={14} />
                            edit
                        </Link>
                        <button className="flex bg-green-500 text-white px-2 py-1 rounded-md justify-center items-center gap-1">
                            <Rocket size={14} /> publish
                        </button>
                        <button
                            className="flex bg-red-500 text-white px-2 py-1 rounded-md justify-center items-center gap-1"
                            onClick={() => deleteSavedLevel(level.id)}
                        >
                            <Trash size={14} /> delete
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center"></div>
            </div>
        </div>
    );
};

export const PublishedLevelCard = ({ level }: { level: SavedLevel }) => {
    const levelPreviewSVG = generateLevelPreviewSVG(level);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40">
                <div dangerouslySetInnerHTML={{ __html: levelPreviewSVG }} />
            </div>
            <div className="p-4">
                <div className="flex flex-col justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <div className="flex justify-between items-center w-full gap-2">
                        <Link
                            to="/play"
                            search={{ levelId: level.id }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-md flex justify-center items-center gap-1"
                        >
                            <Play size={14} />
                            play
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center"></div>
            </div>
        </div>
    );
};

export const LevelCardNoCreator = ({ level }: { level: SavedLevel }) => {
    const levelPreviewSVG = generateLevelPreviewSVG(level);
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-40">
                <div dangerouslySetInnerHTML={{ __html: levelPreviewSVG }} />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg mb-2">{level.name}</h3>
                    <button className="transition-all hover:scale-up-center relative hover:ring-4 hover:ring-offset-2 rounded-full hover:ring-green-600">
                        <Link
                            to="/play"
                            search={{ levelId: level.id }}
                            className="w-full h-full flex flex-col justify-center peer "
                        >
                            <PlayCircleIcon
                                className="text-green-500"
                                size={38}
                            />
                        </Link>
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {level.plays || 0} plays
                    </span>
                    <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">
                            <ThumbsUp />
                        </span>
                        <span>{level.likes || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
