import { Scene } from "phaser";
import { LevelData } from "@/lib/types";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";

export const loadThemeAssets = (scene: Scene, levelData: LevelData) => {
    const themeConfig = gameThemes[levelData.theme];

    themeConfig.blocks.forEach((block) => {
        scene.load.image(
            block.id,
            `assets/theme_${levelData.theme}/${block.asset}`,
        );
    });

    themeConfig.enemies?.forEach((enemy) => {
        scene.load.image(
            enemy.id,
            `assets/theme_${levelData.theme}/${enemy.asset}`,
        );
    });

    scene.load.image(
        "start",
        `assets/theme_${levelData.theme}/${themeConfig.startPoint}`,
    );
    scene.load.image(
        "end",
        `assets/theme_${levelData.theme}/${themeConfig.endPoint}`,
    );

    gameBackgrounds.forEach((background) => {
        scene.load.image(
            background.id,
            `assets/backgrounds/${background.asset}`,
        );
    });
};

export const setupBackground = (scene: Scene, backgroundId: string) => {
    const background = gameBackgrounds.find((bg) => bg.id === backgroundId);
    if (background) {
        const bg = scene.add.image(
            scene.cameras.main.width / 2,
            scene.cameras.main.height / 2,
            backgroundId,
        );
        bg.setScale(background.scale);
        bg.setDepth(-10);
        bg.setData("backgroundId", backgroundId);
        return bg;
    }
    return null;
};

