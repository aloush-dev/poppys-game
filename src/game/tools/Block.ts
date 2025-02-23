import { gameThemes } from "../../lib/gameThemes";
import { BlockConfig } from "../../lib/types";
import { LevelCreator } from "../scenes/LevelCreator";

export class Block extends Phaser.GameObjects.Image {
    public blockId: string;
    public body: Phaser.Physics.Arcade.StaticBody;
    public config: BlockConfig;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        theme: string,
        blockConfig: BlockConfig,
        rotation: number = 0,
    ) {
        super(scene, x + 16, y + 16, blockConfig.id);

        const themeConfig = gameThemes[theme];

        this.blockId = blockConfig.id;
        this.config = blockConfig;
        this.rotation = rotation;

        const scale = 32 / themeConfig.blockSize;
        this.setOrigin(0.5, 0.5);
        this.setScale(scale);
        this.setAngle(rotation);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        // if (blockConfig.physics) {
        //     if (blockConfig.physics.bounce !== undefined) {
        //         this.body.set(blockConfig.physics.bounce);
        //     }
        //     if (blockConfig.physics.friction !== undefined) {
        //         this.body.setFriction(blockConfig.physics.friction);
        //     }
        // }

        this.body.setSize(32, 32);
        this.body.position.set(x, y);
        this.body.updateFromGameObject();

        if (scene.scene.key === "LevelCreator") {
            this.setInteractive();
            scene.input.setDraggable(this);
            this.setupDragEvents(scene);
        }
    }

    private setupDragEvents(scene: Phaser.Scene) {
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Block,
                dragX: number,
                dragY: number,
            ) => {
                if (
                    gameObject === this &&
                    (scene as LevelCreator).selectedTool === "select"
                ) {
                    const snappedX = Math.floor(dragX / 32) * 32;
                    const snappedY = Math.floor(dragY / 32) * 32;
                    this.setPosition(snappedX + 16, snappedY + 16);
                    this.body.position.set(snappedX, snappedY);
                    this.body.updateFromGameObject();
                }
            },
        );
    }

    public getGridPosition() {
        return {
            x: this.x - 16,
            y: this.y - 16,
        };
    }
}

