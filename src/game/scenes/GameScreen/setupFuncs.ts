import { EventBus } from "@/game/EventBus";
import { PlayGame } from "./PlayGame";
import { TestGame } from "./TestGame";

export const setupPlayer = (
    scene: PlayGame | TestGame,
    x: number,
    y: number,
) => {
    scene.player = scene.physics.add
        .sprite(x + 16, y + 16, "player")
        .setCollideWorldBounds(true)
        .setGravityY(500)
        .setOffset(0, 0)
        .setSize(18, 32);

    scene.blocks.forEach((block) => {
        // const collider =
        scene.physics.add.collider(
            scene.player,
            block,
            undefined,
            undefined,
            scene,
        );

        scene.enemies.forEach((enemy) => {
            scene.physics.add.collider(
                scene.player,
                enemy,
                scene.handleEnemyCollision,
                undefined,
                scene,
            );
        });
    });

    if (scene.endPoint) {
        scene.physics.add.overlap(
            scene.player,
            scene.endPoint,
            () => scene.handleLevelComplete(),
            undefined,
            scene,
        );
    }
};



export const setupAnimations = (scene: PlayGame | TestGame) => {
    scene.anims.create({
        key: "idle",
        frames: scene.anims.generateFrameNumbers("player", {
            start: 0,
            end: 7,
        }),
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: "run",
        frames: scene.anims.generateFrameNumbers("player", {
            start: 12,
            end: 19,
        }),
        frameRate: 10,
        repeat: -1,
    });

    scene.anims.create({
        key: "jump",
        frames: scene.anims.generateFrameNumbers("player", {
            start: 8,
            end: 9,
        }),
        frameRate: 2,
        repeat: -1,
    });
};

export const setupControls = (scene: PlayGame | TestGame) => {
    scene.cursors = scene.input.keyboard!.createCursorKeys();
    scene.jumpKey = scene.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
};

export const setupTestModeUI = (scene: PlayGame | TestGame) => {
    scene.add
        .text(16, 16, "Return to Editor", {
            backgroundColor: "#444",
            padding: { x: 10, y: 5 },
            color: "#ffffff",
        })
        .setScrollFactor(0)
        .setDepth(1000)
        .setInteractive()
        .on("pointerdown", () => {
            EventBus.emit("editorMode");
            scene.scene.start("LevelEditor", scene.levelData);
        });
};

