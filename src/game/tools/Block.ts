import { ToolType } from "../components/Toolbar";
import { LevelCreator } from "../scenes/LevelCreator";

export class Block extends Phaser.GameObjects.Image {
    public blockType: "block_middle" | "block_left" | "block_right";
    public body: Phaser.Physics.Arcade.StaticBody;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        selectedTool: ToolType = "block_middle",
    ) {
        super(scene, x, y, selectedTool);

        const scale = 32 / 512;
        this.setOrigin(0, 0);
        this.setScale(scale);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        this.body.setSize(32, 32);

        this.setInteractive();
        scene.input.setDraggable(this);

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
                    this.setPosition(snappedX, snappedY);
                    this.body.position.set(snappedX, snappedY);
                    this.body.updateFromGameObject();
                }
            },
        );
    }
}

