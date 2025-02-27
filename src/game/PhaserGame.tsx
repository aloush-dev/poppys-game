import { Game } from "phaser";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { LevelEditor } from "./scenes/LevelEditor/LevelEditor";
import { PlayGame } from "@/game/scenes/GameScreen/PlayGame";
import { TestGame } from "./scenes/GameScreen/TestGame";
import { useLevelEditorStore } from "@/stores/useLevelEditorStore";
import { GameOver } from "./scenes/GameOver";
import { GameOverScreen } from "./components/GameOverScreen";

export interface IRefPhaserGame {
    game: Game | null;
}

interface PhaserGameProps {
    scene: "create" | "play" | "test";
}

export const PhaserGame = forwardRef<IRefPhaserGame, PhaserGameProps>(
    ({ scene }, ref) => {
        const gameRef = useRef<Game | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const initializedRef = useRef(false);

        useImperativeHandle(ref, () => ({
            game: gameRef.current,
        }));

        useEffect(() => {
            if (!containerRef.current) return;

            if (gameRef.current) {
                try {
                    gameRef.current.destroy(true);
                } catch (e) {
                    console.warn("Error cleaning up previous game instance", e);
                }
                gameRef.current = null;
                useLevelEditorStore.getState().setGame(null);
            }

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
                scene: [LevelEditor, PlayGame, TestGame, GameOver],
            };

            gameRef.current = new Game(config);
            useLevelEditorStore.getState().setGame(gameRef.current);

            if (scene === "create" && !initializedRef.current) {
                gameRef.current.scene.start("LevelEditor");
                initializedRef.current = true;
            }

            if (scene === "play" && !initializedRef.current) {
                gameRef.current.scene.start("PlayGame");
                initializedRef.current = true;
            }

            return () => {
                gameRef.current?.destroy(true);
                gameRef.current = null;
                initializedRef.current = false;
                useLevelEditorStore.getState().setGame(null);
            };
        }, []);

        return (
            <div className="relative w-full h-full">
                <div ref={containerRef} className="w-full h-full" />
                <GameOverScreen />
            </div>
        );
    },
);

PhaserGame.displayName = "PhaserGame";

