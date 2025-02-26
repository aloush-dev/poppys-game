import { Scene } from "phaser";
import { Block } from "@/game/tools/Block";
import { Enemy } from "@/game/tools/Enemy";
import { EndPoint, StartPoint } from "@/game/tools/Points";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";
import { BlockData, EnemyData, LevelData } from "@/lib/types";
import { loadThemeAssets } from "../SceneSetup";
import { EventBus } from "@/game/EventBus";
import { usePlayGameStore } from "@/stores/usePlayGameStore";

export class PlayGame extends Scene {
    public blocks: { [key: string]: Block } = {};
    public enemies: { [key: string]: Enemy } = {};
    public startPoint: StartPoint | null = null;
    public endPoint: EndPoint | null = null;
    public currentBackground: Phaser.GameObjects.Image;
    public jumpKey: Phaser.Input.Keyboard.Key;

    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private levelData: LevelData;
    private levelComplete = false;

    constructor() {
        super({ key: "PlayGame" });
    }

    init() {
        const storeLevel = usePlayGameStore.getState().level;

        if (!storeLevel) {
            console.error("No level data found in store");
            return;
        }

        this.levelData = storeLevel;
    }

    preload() {
        if (!this.levelData) return;

        loadThemeAssets(this, this.levelData);

        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        if (!this.levelData) {
            this.add
                .text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    "Error loading level data",
                    { fontSize: "24px", color: "#fff" },
                )
                .setOrigin(0.5);

            this.time.delayedCall(2000, () => {
                this.scene.start("Menu");
            });
            return;
        }

        this.setupBackground();
        this.createBlocks();
        this.createEnemies();
        this.createStartAndEndPoints();

        if (this.levelData.startPoint) {
            this.setupPlayer(
                this.levelData.startPoint.x,
                this.levelData.startPoint.y,
            );
        }

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.jumpKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );

        if (this.player) {
            this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
            this.cameras.main.setBounds(
                0,
                0,
                this.game.config.width as number,
                this.game.config.height as number,
            );
        }

        if (this.endPoint) {
            this.physics.add.overlap(
                this.player,
                this.endPoint,
                this.handleLevelComplete,
                undefined,
                this,
            );
        }
    }

    update() {
        if (!this.player) return;

        this.handlePlayerMovement();

        if (this.player.y > Number(this.game.config.height)) {
            this.handlePlayerDeath();
        }
    }

    private setupBackground() {
        const backgroundId = this.levelData.backgroundId || "background_1";
        const background = gameBackgrounds.find((bg) => bg.id === backgroundId);

        if (background) {
            this.currentBackground = this.add.image(
                this.cameras.main.width / 2,
                this.cameras.main.height / 2,
                backgroundId,
            );
            this.currentBackground.setScale(background.scale);
            this.currentBackground.setDepth(-10);
        }
    }

    private createBlocks() {
        if (!this.levelData.blocks) return;

        this.levelData.blocks.forEach((blockData: BlockData) => {
            const key = `${blockData.x}-${blockData.y}`;
            const blockConfig = this.getBlockConfig(blockData.blockId);

            if (blockConfig) {
                this.blocks[key] = new Block(
                    this,
                    blockData.x,
                    blockData.y,
                    this.levelData.theme,
                    blockConfig,
                );
            }
        });
    }

    private createEnemies() {
        if (!this.levelData.enemies) return;

        this.levelData.enemies.forEach((enemyData: EnemyData) => {
            const key = `${enemyData.x}-${enemyData.y}`;
            const enemyConfig = this.getEnemyConfig(enemyData.enemyId);

            if (enemyConfig) {
                this.enemies[key] = new Enemy(
                    this,
                    enemyData.x,
                    enemyData.y,
                    this.levelData.theme,
                    enemyConfig,
                );
            }
        });
    }

    private createStartAndEndPoints() {
        if (this.levelData.startPoint) {
            this.startPoint = new StartPoint(
                this,
                this.levelData.startPoint.x,
                this.levelData.startPoint.y,
            );
        }

        if (this.levelData.endPoint) {
            this.endPoint = new EndPoint(
                this,
                this.levelData.endPoint.x,
                this.levelData.endPoint.y,
            );
        }
    }

    private setupPlayer(x: number, y: number) {
        this.player = this.physics.add
            .sprite(x + 16, y + 16, "player")
            .setCollideWorldBounds(false)
            .setGravityY(500)
            .setSize(18, 32);

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
            frameRate: 10,
            repeat: -1,
        });

        Object.values(this.blocks).forEach((block) => {
            this.physics.add.collider(this.player, block);
        });

        Object.values(this.enemies).forEach((enemy) => {
            this.physics.add.collider(
                this.player,
                enemy,
                this.handleEnemyCollision,
                undefined,
                this,
            );
        });

        this.player.anims.play("idle");
    }

    private handlePlayerMovement() {
        if (!this.player || !this.cursors) return;

        const onGround = this.player.body!.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            if (onGround) this.player.anims.play("run", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            if (onGround) this.player.anims.play("run", true);
        } else {
            this.player.setVelocityX(0);
            if (onGround) this.player.anims.play("idle", true);
        }

        if ((this.jumpKey.isDown || this.cursors.up.isDown) && onGround) {
            this.player.setVelocityY(-400);
            this.player.anims.play("jump", true);
        }

        if (!onGround && this.player.anims.currentAnim?.key !== "jump") {
            this.player.anims.play("jump");
        }
    }

    private handleEnemyCollision() {
        this.handlePlayerDeath();
    }

    private handlePlayerDeath() {
        if (!this.player) return;

        this.player.setTint(0xff0000);
        this.player.setVelocity(0, 0);
        this.player.body!.enable = false;

        this.time.delayedCall(1000, () => {
            this.scene.restart();
        });
    }

    private handleLevelComplete = () => {
        if (this.levelComplete || !this.player) return;

        this.levelComplete = true;

        this.player.setTint(0x00ff00);
        this.player.setVelocity(0, 0);
        this.player.body!.enable = false;

        EventBus.emit("levelComplete", this.levelData.id);

        this.time.delayedCall(1000, () => {
            this.scene.start("LevelComplete");
        });
    };

    private getBlockConfig(blockId: string) {
        return gameThemes[this.levelData.theme].blocks.find(
            (b) => b.id === blockId || b.baseId === blockId,
        );
    }

    private getEnemyConfig(enemyId: string) {
        return gameThemes[this.levelData.theme].enemies?.find(
            (e) => e.id === enemyId || e.baseId === enemyId,
        );
    }
}

