import { Scene } from "phaser";
import { Block } from "../tools/Block";
import { EndPoint, StartPoint } from "../tools/Points";
import { LevelData } from "../../lib/types";
import { gameBackgrounds, gameThemes } from "../../lib/gameThemes";
import { Enemy } from "../tools/Enemy";
import { EventBus } from "../EventBus";

export class PlayGame extends Scene {
    private blocks: Block[] = [];
    private enemies: Enemy[] = [];
    private startPoint: StartPoint | null = null;
    private endPoint: EndPoint | null = null;
    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private jumpKey: Phaser.Input.Keyboard.Key;
    private levelData: LevelData;
    private currentBackground: Phaser.GameObjects.Image;

    private readonly PLAYER_SPEED = 160;
    private readonly JUMP_VELOCITY = -330;

    constructor() {
        super({ key: "PlayGame" });
    }

    init(data: LevelData) {
        this.levelData = data;
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

        this.setupLevel(this.levelData);

        this.setupPlayer(this.startPoint!.x, this.startPoint!.y);

        this.setupAnimations();

        this.setupControls();

        if (this.levelData.testMode) {
            this.setupTestModeUI();
        }
    }

    private setupLevel(state: LevelData) {
        const themeConfig = gameThemes[state.theme || this.levelData.theme];

        this.blocks.forEach((block) => block.destroy());
        this.blocks = [];

        this.enemies.forEach((enemy) => enemy.destroy());
        this.enemies = [];

        if (state.backgroundId) {
            const backgroundConfig = gameBackgrounds.find(
                (bg) => bg.id === state.backgroundId,
            );
            if (backgroundConfig && this.currentBackground) {
                this.currentBackground.setTexture(state.backgroundId);
                this.currentBackground.setScale(backgroundConfig.scale);
            }
        }

        if (state.blocks) {
            this.blocks = state.blocks
                .map((blockData) => {
                    const blockConfig = themeConfig.blocks.find(
                        (config) => config.id === blockData.blockId,
                    );

                    if (!blockConfig) {
                        console.warn(
                            `Block config not found for id: ${blockData.blockId}`,
                        );
                        return null;
                    }

                    const block = new Block(
                        this,
                        blockData.x,
                        blockData.y,
                        this.levelData.theme,
                        blockConfig,
                        blockData.rotation,
                    );
                    return block;
                })
                .filter((block): block is Block => block !== null);
        }

        if (state.enemies) {
            this.enemies = state.enemies
                .map((enemyData) => {
                    const enemyConfig = themeConfig.enemies?.find(
                        (config) => config.id === enemyData.enemyId,
                    );

                    if (!enemyConfig) {
                        console.warn(
                            `Enemy config not found for id: ${enemyData.enemyId}`,
                        );
                        return null;
                    }

                    const enemy = new Enemy(
                        this,
                        enemyData.x,
                        enemyData.y,
                        this.levelData.theme,
                        enemyConfig,
                    );
                    return enemy;
                })
                .filter((enemy): enemy is Enemy => enemy !== null);
        }

        if (state.startPoint) {
            this.startPoint = new StartPoint(
                this,
                state.startPoint.x,
                state.startPoint.y,
            );
        }

        if (state.endPoint) {
            this.endPoint = new EndPoint(
                this,
                state.endPoint.x,
                state.endPoint.y,
            );
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
                this.scene.start("LevelCreator", this.levelData);
            });
    }

    update() {
        if (!this.player) return;

        this.handlePlayerMovement();

        if (this.player.y > this.scale.height) {
            this.handlePlayerDeath();
        }
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
}

