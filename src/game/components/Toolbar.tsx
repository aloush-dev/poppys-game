import { Pointer, Trash } from "lucide-react";
import { EventBus } from "../EventBus";
import { useEffect, useState } from "react";
import { LevelThemes } from "../../lib/types";
import { gameThemes } from "../../lib/gameThemes";

export const Toolbar = () => {
    const [currentTheme, setCurrentTheme] = useState<LevelThemes>("standard");
    const [currentRotation, setCurrentRotation] = useState(0);
    const themeConfig = gameThemes[currentTheme];

    const handleThemeChange = (theme: LevelThemes) => {
        setCurrentTheme(theme);
        EventBus.emit("themeChanged", theme);
    };

    useEffect(() => {
        const handleRotationChange = (rotation: number) => {
            setCurrentRotation(rotation);
        };

        EventBus.on("rotationChanged", handleRotationChange);
        return () => {
            EventBus.off("rotationChanged", handleRotationChange);
        };
    }, []);

    return (
        <div className="flex flex-col gap-2 bg-slate-500 p-2 rounded-lg shadow-lg items-start">
            <div>
                <p className="text-white font-bold">Theme</p>
                <select
                    value={currentTheme}
                    onChange={(e) =>
                        handleThemeChange(e.target.value as LevelThemes)
                    }
                >
                    {Object.keys(gameThemes).map((theme) => (
                        <option key={theme} value={theme}>
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <p className="text-white font-bold">Blocks</p>
                <div className="flex gap-2 flex-wrap">
                    {themeConfig.blocks.map((block) => (
                        <button
                            key={block.id}
                            className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                            onClick={() =>
                                EventBus.emit("toolSelected", block.id)
                            }
                            title={block.displayName}
                        >
                            <img
                                src={`/assets/theme_${currentTheme}/${block.asset}`}
                                alt={block.displayName}
                                className="w-8 h-8"
                                style={{
                                    transform: `rotate(${currentRotation}deg)`,
                                }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {themeConfig.enemies && (
                <div>
                    <p className="text-white font-bold">Enemies</p>
                    <div className="flex gap-2 flex-wrap">
                        {themeConfig.enemies.map((enemy) => (
                            <button
                                key={enemy.id}
                                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                                onClick={() =>
                                    EventBus.emit("toolSelected", enemy.id)
                                }
                                title={enemy.displayName}
                            >
                                <img
                                    src={`/assets/theme_${currentTheme}/${enemy.asset}`}
                                    alt={enemy.displayName}
                                    className="w-8 h-8"
                                    style={{
                                        transform: `rotate(${currentRotation}deg)`,
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <p className="text-white font-bold">Points</p>
                <div className="flex gap-2">
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                        onClick={() => {
                            EventBus.emit("toolSelected", "start");
                        }}
                    >
                        START
                    </button>
                    <button
                        className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                        onClick={() => {
                            EventBus.emit("toolSelected", "end");
                        }}
                    >
                        FINISH
                    </button>
                </div>
            </div>

            <button
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                onClick={() => EventBus.emit("toolSelected", "delete")}
            >
                <Trash />
            </button>

            {/* <button
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                onClick={() => EventBus.emit("rotate")}
            >
                <RotateCw />
            </button> */}

            <button
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                onClick={() => EventBus.emit("toolSelected", "select")}
            >
                <Pointer />
            </button>

            <button
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs"
                onClick={() => {
                    EventBus.emit("testLevel");
                }}
            >
                TEST
            </button>

            <div className="flex-grow"></div>

            <button className="w-full h-12 bg-gray-700 rounded-lg flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xs">
                Publish
            </button>
        </div>
    );
};

