import { Game } from "phaser";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { LevelCreator } from "./scenes/LevelCreator";
import { PlayGame } from "./scenes/PlayGame";

export interface IRefPhaserGame {
    game: Game | null;
}

interface PhaserGameProps {
    scene: "create" | "play";
}

export const PhaserGame = forwardRef<IRefPhaserGame, PhaserGameProps>(
    ({ scene }, ref) => {
        const gameRef = useRef<Game | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);

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
                scene: [LevelCreator, PlayGame],
            };

            gameRef.current = new Game(config);

            return () => {
                gameRef.current?.destroy(true);
                gameRef.current = null;
            };
        }, [scene]);

        return <div ref={containerRef} className="w-full h-full" />;
    },
);

PhaserGame.displayName = "PhaserGame";

