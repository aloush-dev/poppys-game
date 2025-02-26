import { Scene } from "phaser";
import { Block } from "@/game/tools/Block";
import { Enemy } from "@/game/tools/Enemy";
import { EndPoint, StartPoint } from "@/game/tools/Points";
import { gameBackgrounds, gameThemes } from "@/lib/gameThemes";
import { BlockData, EnemyData, LevelData } from "@/lib/types";
import { loadThemeAssets } from "../SceneSetup";

export class TestGame extends Scene {
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
        super({ key: "TestGame" });
    }

    init(data: { levelData: LevelData }) {
        this.levelData = data.levelData;
    }

    preload() {
        loadThemeAssets(this, this.levelData);

        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
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

        this.createUI();
    }

    update() {
        if (!this.player || this.levelComplete) return;

        this.handlePlayerMovement();

        this.checkCollisions();
    }

    private setupBackground() {
        if (!this.cameras?.main) {
            console.warn("Camera not ready in setupBackground");
            return;
        }

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
        const blocks = this.levelData.blocks || [];

        blocks.forEach((blockData: BlockData) => {
            const key = `${blockData.x}-${blockData.y}`;
            const theme = this.levelData.theme;
            const blockConfig = this.getBlockConfig(blockData.blockId, theme);

            if (blockConfig) {
                this.blocks[key] = new Block(
                    this,
                    blockData.x,
                    blockData.y,
                    theme,
                    blockConfig,
                );
            }
        });
    }

    private createEnemies() {
        const enemies = this.levelData.enemies || [];

        enemies.forEach((enemyData: EnemyData) => {
            const key = `${enemyData.x}-${enemyData.y}`;
            const theme = this.levelData.theme;
            const enemyConfig = this.getEnemyConfig(enemyData.enemyId, theme);

            if (enemyConfig) {
                this.enemies[key] = new Enemy(
                    this,
                    enemyData.x,
                    enemyData.y,
                    theme,
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
        this.player = this.physics.add.sprite(x + 16, y + 16, "player");
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1);
        this.player.setGravityY(500);
        this.player.setSize(18, 32);

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
        Object.values(this.blocks).forEach((block) => {
            this.physics.add.collider(this.player, block);
        });
    }

    private handlePlayerMovement() {
        const onGround = this.player.body!.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.setFlipX(true);
            if (onGround) this.player.anims.play("run", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.setFlipX(false);
            if (onGround) this.player.anims.play("run", true);
        } else {
            this.player.setVelocityX(0);
            if (onGround) this.player.anims.play("idle", true);
        }

        if ((this.jumpKey.isDown || this.cursors.up.isDown) && onGround) {
            this.player.setVelocityY(-330);
            this.player.anims.play("jump", true);
        }

        if (!onGround) {
            this.player.anims.play("jump", true);
        }
    }

    private checkCollisions() {
        if (this.endPoint && this.physics.overlap(this.player, this.endPoint)) {
            this.levelComplete = true;
            this.showLevelCompleteMessage();
        }

        Object.values(this.enemies).forEach((enemy) => {
            if (this.physics.overlap(this.player, enemy)) {
                this.handlePlayerDeath();
            }
        });
    }

    private handlePlayerDeath() {
        this.player.setTint(0xff0000);
        this.player.setVelocity(0, 0);

        this.time.delayedCall(1000, () => {
            if (this.levelData.startPoint) {
                this.player.setPosition(
                    this.levelData.startPoint.x,
                    this.levelData.startPoint.y,
                );
                this.player.clearTint();
            }
        });
    }

    private showLevelCompleteMessage() {
        if (!this.cameras?.main) {
            console.warn("Camera not ready in showLevelCompleteMessage");
            return;
        }

        const textStyle = {
            font: "32px Arial",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
        };

        const text = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "Level Complete!",
            textStyle,
        );
        text.setOrigin(0.5);
        text.setScrollFactor(0);

        const buttonStyle = {
            font: "24px Arial",
            color: "#ffffff",
            backgroundColor: "#4a6c9b",
            padding: { x: 15, y: 10 },
        };

        const button = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 60,
            "Back to Editor",
            buttonStyle,
        );
        button.setOrigin(0.5);
        button.setScrollFactor(0);
        button.setInteractive({ useHandCursor: true });

        button.on("pointerdown", () => {
            this.returnToEditor();
        });
    }

    private returnToEditor() {
        this.scene.stop("TestGame");
        this.scene.start("LevelEditor");
    }

    private createUI() {
        if (!this.cameras?.main) {
            console.warn("Camera not ready in createUI");
            return;
        }
        const backButton = this.add.text(20, 20, "Back to Editor", {
            font: "18px Arial",
            color: "#ffffff",
            backgroundColor: "#4a6c9b",
            padding: { x: 10, y: 5 },
        });
        backButton.setScrollFactor(0);
        backButton.setInteractive({ useHandCursor: true });

        backButton.on("pointerdown", () => {
            this.returnToEditor();
        });
    }

    private getBlockConfig(blockId: string, theme: string) {
        return gameThemes[theme].blocks.find(
            (b) => b.id === blockId || b.baseId === blockId,
        );
    }

    private getEnemyConfig(enemyId: string, theme: string) {
        return gameThemes[theme].enemies?.find(
            (e) => e.id === enemyId || e.baseId === enemyId,
        );
    }

    shutdown() {
        Object.values(this.blocks).forEach((block) => block.destroy());
        Object.values(this.enemies).forEach((enemy) => enemy.destroy());
        if (this.startPoint) this.startPoint.destroy();
        if (this.endPoint) this.endPoint.destroy();
        if (this.currentBackground) this.currentBackground.destroy();
        if (this.player) this.player.destroy();

        this.blocks = {};
        this.enemies = {};
        this.startPoint = null;
        this.endPoint = null;
    }
}

