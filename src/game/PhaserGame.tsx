import { Game } from "phaser";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { LevelEditor } from "./scenes/LevelEditor/LevelEditor";
import { PlayGame } from "@/game/scenes/GameScreen/PlayGame";
import { LevelData } from "../lib/types";
import { TestGame } from "./scenes/GameScreen/TestGame";

export interface IRefPhaserGame {
    game: Game | null;
}

interface PhaserGameProps {
    scene: "create" | "play";
    levelData?: LevelData;
    levelId?: string;
}

export const PhaserGame = forwardRef<IRefPhaserGame, PhaserGameProps>(
    ({ levelData, levelId }, ref) => {
        const gameRef = useRef<Game | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const initializedRef = useRef(false);

        useImperativeHandle(ref, () => ({
            game: gameRef.current,
        }));

        useEffect(() => {
            if (!containerRef.current) return;

            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                parent: containerRef.current,
                backgroundColor: "#000000",
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 960,
                    height: 640,
                },
                physics: {
                    default: "arcade",
                    arcade: {
                        debug: process.env.NODE_ENV === "development",
                    },
                },
                scene: [LevelEditor, PlayGame, TestGame],
            };

            gameRef.current = new Game(config);

            if (levelData) {
                gameRef.current.scene.start("LevelEditor", {
                    levelData,
                    id: levelId,
                });
                initializedRef.current = true;
            }

            return () => {
                gameRef.current?.destroy(true);
                gameRef.current = null;
                initializedRef.current = false;
            };
        }, []);

        // useEffect(() => {
        //     if (gameRef.current && levelData && initializedRef.current) {
        //         if (gameRef.current.scene.isActive("LevelEditor")) {
        //             gameRef.current.scene.start("LevelEditor", {
        //                 levelData,
        //                 id: levelId,
        //             });
        //         } else {
        //             gameRef.current.scene.start("LevelEditor", {
        //                 levelData,
        //                 id: levelId,
        //             });
        //         }
        //     }
        // }, [levelData, levelId]);

        useEffect(() => {
            if (gameRef.current && levelData) {
                gameRef.current.scene.start("LevelEditor", {
                    levelData,
                    id: levelId,
                });
            }
        }, [levelData, levelId]);

        return <div ref={containerRef} className="w-full h-full" />;
    },
);

PhaserGame.displayName = "PhaserGame";

