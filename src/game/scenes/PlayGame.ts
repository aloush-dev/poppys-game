import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { LevelData, TempLevelData } from "../../lib/types";
import { Block } from "../tools/Block";
import { EndPoint } from "../tools/Points";

export class PlayGame extends Scene {
    private levelData: LevelData | TempLevelData;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private blocks: Block[] = [];
    private endPoint: EndPoint;
    private isTestMode: boolean = false;

    private player: Phaser.Physics.Arcade.Sprite;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private jumpKey: Phaser.Input.Keyboard.Key;

    private readonly PLAYER_SPEED = 160;
    private readonly JUMP_VELOCITY = -330;

    constructor() {
        super({ key: "PlayGame" });
    }

    init(data: { levelData: LevelData; isTest?: boolean }) {
        this.isTestMode = data.isTest || false;
        const tempLevel = localStorage.getItem("tempLevel");
        this.levelData = tempLevel
            ? (JSON.parse(tempLevel) as TempLevelData)
            : data.levelData;

        this.createLevel();
    }

    preload() {
        this.load.image("background", "assets/backgrounds/forrest.png");
        this.load.image("block_middle", "assets/block_middle.png");
        this.load.image("block_left", "assets/block_left.png");
        this.load.image("block_right", "assets/block_right.png");
        this.load.spritesheet("end", "assets/portal_blue.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("player", "assets/player.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        this.camera = this.cameras.main;
        this.add.image(0, 0, "background").setScale(1.8).setOrigin(0, 0);

        this.player = this.physics.add
            .sprite(
                this.levelData.startPoint.x,
                this.levelData.startPoint.y,
                "player",
            )
            .setCollideWorldBounds(true)
            .setGravityY(500)
            .setOffset(0, -16)
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
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: "end_portal",
            frames: this.anims.generateFrameNumbers("end", {
                start: 0,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.jumpKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );

        this.physics.add.collider(this.player, this.blocks);

        this.player.anims.play("idle", true);

        if (this.isTestMode) {
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
                    this.scene.start("LevelCreator");
                    EventBus.emit("returnToEditor");
                });
        }

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        if (!this.player) return;

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

    private createLevel() {
        this.levelData.blocks.forEach((block) => {
            this.blocks.push(new Block(this, block.x, block.y, block.type));
        });

        if (this.endPoint) {
            this.endPoint = new EndPoint(
                this,
                this.levelData.endPoint.x,
                this.levelData.endPoint.y,
            );
        }
    }
}

