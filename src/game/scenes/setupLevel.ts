import { LevelData } from "@/lib/types";
import { LevelEditor } from "@/game/scenes/LevelEditor/LevelEditor";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";
import { Block } from "@/game/tools/Block";
import { Enemy } from "../tools/Enemy";
import { EndPoint, StartPoint } from "../tools/Points";
import { TestGame } from "./GameScreen/TestGame";
import { PlayGame } from "./GameScreen/PlayGame";

export const setupLevel = (
    scene: LevelEditor | TestGame | PlayGame,
    state: LevelData,
) => {
    scene.blocks.forEach((block) => block.destroy());
    scene.blocks = [];

    scene.enemies.forEach((enemy) => enemy.destroy());
    scene.enemies = [];

    if (scene.startPoint) {
        scene.startPoint.destroy();
        scene.startPoint = null;
    }

    if (scene.endPoint) {
        scene.endPoint.destroy();
        scene.endPoint = null;
    }

    const themeConfig = gameThemes[state.theme || scene.levelTheme];

    if (state.theme) {
        scene.levelTheme = state.theme;
    }

    if (state.backgroundId) {
        const backgroundConfig = gameBackgrounds.find(
            (bg) => bg.id === state.backgroundId,
        );
        if (backgroundConfig && scene.currentBackground) {
            scene.currentBackground.setTexture(state.backgroundId);
            scene.currentBackground.setScale(backgroundConfig.scale);
        }
    }

    if (state.blocks) {
        scene.blocks = state.blocks
            .map((blockData) => {
                const blockConfig = themeConfig.blocks.find(
                    (config) => config.baseId === blockData.baseId,
                );

                if (!blockConfig) {
                    console.warn(
                        `Block config not found for baseId: ${blockData.baseId}`,
                    );
                    return null;
                }

                return new Block(
                    scene,
                    blockData.x,
                    blockData.y,
                    scene.levelTheme,
                    blockConfig,
                );
            })
            .filter((block): block is Block => block !== null);
    }

    if (state.enemies) {
        scene.enemies = state.enemies
            .map((enemyData) => {
                const enemyConfig = themeConfig.enemies?.find(
                    (config) => config.baseId === enemyData.baseId,
                );

                if (!enemyConfig) {
                    console.warn(
                        `Enemy config not found for baseId: ${enemyData.baseId}`,
                    );
                    return null;
                }

                return new Enemy(
                    scene,
                    enemyData.x,
                    enemyData.y,
                    scene.levelTheme,
                    enemyConfig,
                );
            })
            .filter((enemy): enemy is Enemy => enemy !== null);
    }

    if (state.startPoint) {
        scene.startPoint = new StartPoint(
            scene,
            state.startPoint.x,
            state.startPoint.y,
        );
    }

    if (state.endPoint) {
        scene.endPoint = new EndPoint(
            scene,
            state.endPoint.x,
            state.endPoint.y,
        );
    }
};

