import { Scene } from "phaser";
import { Block } from "@/game/tools/Block";
import { EndPoint, StartPoint } from "@/game/tools/Points";
import { LevelData, LevelThemes } from "@/lib/types";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";
import { Enemy } from "@/game/tools/Enemy";
import { EventBus } from "@/game/EventBus";
import { setupLevel } from "../setupLevel";

export class TestGame extends Scene {
    blocks: Block[] = [];
    enemies: Enemy[] = [];
    startPoint: StartPoint | null = null;
    endPoint: EndPoint | null = null;
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    jumpKey: Phaser.Input.Keyboard.Key;
    levelData: LevelData;
    currentBackground: Phaser.GameObjects.Image;
    levelTheme: LevelThemes;
    levelId?: string;

    readonly PLAYER_SPEED = 160;
    readonly JUMP_VELOCITY = -330;

    constructor() {
        super({ key: "TestGame" });
    }

    init(data: LevelData) {
        this.levelData = data;
        this.levelId = data.id;
    }

    preload() {
        const themeConfig = gameThemes[this.levelData.theme];

        themeConfig.blocks.forEach((block) => {
            this.load.image(block.id, this.getThemeAssetPath(block.asset));
        });

        themeConfig.enemies?.forEach((enemy) => {
            this.load.image(enemy.id, this.getThemeAssetPath(enemy.asset));
        });

        this.load.image(
            "start",
            this.getThemeAssetPath(themeConfig.startPoint),
        );
        this.load.image("end", this.getThemeAssetPath(themeConfig.endPoint));

        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        gameBackgrounds.forEach((background) => {
            this.load.image(
                background.id,
                `assets/theme_${this.levelData.theme}/backgrounds/${background.asset}`,
            );
        });
    }
    create() {
        const backgroundId =
            this.levelData.backgroundId || gameBackgrounds[0].id;
        const backgroundConfig = gameBackgrounds.find(
            (bg) => bg.id === backgroundId,
        );

        if (backgroundConfig) {
            this.currentBackground = this.add
                .image(0, 0, backgroundId)
                .setOrigin(0, 0)
                .setScale(backgroundConfig.scale);
        }

        setupLevel(this, this.levelData);

        this.setupPlayer(this.startPoint!.x, this.startPoint!.y);

        this.setupAnimations();

        this.setupControls();

        this.setupTestModeUI();
    }

    update() {
        if (!this.player) return;

        this.handlePlayerMovement();

        if (this.player.y > this.scale.height) {
            this.handlePlayerDeath();
        }
    }

    private setupPlayer(x: number, y: number) {
        this.player = this.physics.add
            .sprite(x + 16, y + 16, "player")
            .setCollideWorldBounds(true)
            .setGravityY(500)
            .setOffset(0, 0)
            .setSize(18, 32);

        this.blocks.forEach((block) => {
            // const collider =
            this.physics.add.collider(
                this.player,
                block,
                undefined,
                undefined,
                this,
            );

            this.enemies.forEach((enemy) => {
                this.physics.add.collider(
                    this.player,
                    enemy,
                    this.handleEnemyCollision,
                    undefined,
                    this,
                );
            });
        });

        if (this.endPoint) {
            this.physics.add.overlap(
                this.player,
                this.endPoint,
                () => this.handleLevelComplete(),
                undefined,
                this,
            );
        }
    }

    private setupAnimations() {
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 12,
                end: 19,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("player", {
                start: 8,
                end: 9,
            }),
            frameRate: 2,
            repeat: -1,
        });
    }

    private setupControls() {
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.jumpKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );
    }

    private setupTestModeUI() {
        this.add
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
                this.scene.start("LevelEditor", {
                    levelData: this.levelData,
                    id: this.levelId,
                });
            });
    }

    private handlePlayerDeath() {
        this.player.setTint(0xff0000);
        this.player.setVelocity(0, 0);
        this.player.body!.enable = false;

        this.time.delayedCall(500, () => {
            this.restartLevel();
        });
    }

    private handlePlayerMovement() {
        const onGround = this.player.body!.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.PLAYER_SPEED);
            this.player.setFlipX(true);
            if (onGround) this.player.anims.play("run", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.PLAYER_SPEED);
            this.player.setFlipX(false);
            if (onGround) this.player.anims.play("run", true);
        } else {
            this.player.setVelocityX(0);
            if (onGround) this.player.anims.play("idle", true);
        }

        if ((this.jumpKey.isDown || this.cursors.up.isDown) && onGround) {
            this.player.setVelocityY(this.JUMP_VELOCITY);
            this.player.anims.play("jump", true);
        }

        if (!onGround) {
            this.player.anims.play("jump", true);
        }
    }

    private getThemeAssetPath(assetName: string): string {
        return `assets/theme_${this.levelData.theme}/${assetName}`;
    }

    private handleEnemyCollision() {
        this.player.setTint(0xff0000);

        this.player.setVelocity(0);
        this.player.body!.enable = false;

        this.time.delayedCall(500, () => {
            this.restartLevel();
        });
    }

    private restartLevel() {
        this.scene.restart(this.levelData);
    }

    private handleLevelComplete = () => {
        this.player.body!.enable = false;
        this.player.setVelocity(0, 0);

        this.player.setTint(0x00ff00);

        this.time.delayedCall(500, () => {
            EventBus.emit("editorMode");
            this.scene.start("LevelEditor", {
                levelData: this.levelData,
                id: this.levelId,
            });
        });
    };
}

