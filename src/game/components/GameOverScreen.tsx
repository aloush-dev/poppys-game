import { LevelCard, LevelCardNoCreator } from "@/app/components/LevelCards";
import { getAllLevels, getPublishedLevelsByUserId } from "@/firebase/firestore";
import { SavedLevel } from "@/lib/types";
import { usePlayGameStore } from "@/stores/usePlayGameStore";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export const GameOverScreen = () => {
    const { isComplete, likeLevel, level } = usePlayGameStore();

    const [levels, setLevels] = useState<SavedLevel[]>([]);
    const [sameUserLevels, setSameUserLevels] = useState<SavedLevel[]>([]);

    useEffect(() => {
        const fetchLevels = async () => {
            const userLevels = await getPublishedLevelsByUserId(
                level?.creator || "",
            );
            const allLevels = await getAllLevels();

            setLevels(allLevels);
            setSameUserLevels(userLevels);
        };

        fetchLevels();
    }, []);

    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(true);
        if (!liked) {
            likeLevel();
        }
    };

    if (!isComplete) {
        return null;
    }

    return (
        <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
                background:
                    "linear-gradient(135deg, #ffd6e7 0%, #d9f2ff 50%, #d1ffe5 100%)",
            }}
        >
            <div className="grid grid-cols-3 gap-6 m-5">
                {sameUserLevels.length > 0 ? (
                    <div>
                        <p className="text-white font-bold  mb-4 bg-pink-500 p-2 rounded-lg">
                            More levels from this creator
                        </p>
                        {sameUserLevels.map((level) => (
                            <LevelCardNoCreator key={level.id} level={level} />
                        ))}
                    </div>
                ) : (
                    <div>
                        <p className="text-white mb-4 font-bold  bg-pink-500 p-2 rounded-lg">
                            Explore more levels
                        </p>
                        {levels.map((level) => (
                            <LevelCard key={level.id} level={level} />
                        ))}
                    </div>
                )}
            </div>
            <div className="absolute bottom-8 right-8 pointer-events-auto">
                <button
                    onClick={handleLike}
                    className="px-6 py-3 bg-pink-500 text-white rounded-full cursor-pointer
                       hover:bg-pink-600 hover:scale-105 transition-all
                       focus:outline-none focus:ring-2 focus:ring-pink-400
                       shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <Heart size={24} />
                    Like This Level
                </button>
            </div>
        </div>
    );
};

