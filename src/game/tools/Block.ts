export class Block extends Phaser.GameObjects.Image {
    public blockType: "block_middle" | "block_left" | "block_right";

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: "block_middle" | "block_left" | "block_right" = "block_middle",
    ) {
        super(scene, x, y, type);
        this.blockType = type;

        // Initialize the block
        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);

        // Add to scene and enable interactions
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);

        // Add drag events
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: Block,
                dragX: number,
                dragY: number,
            ) => {
                if (gameObject === this) {
                    const snappedX = Math.floor(dragX / 32) * 32;
                    const snappedY = Math.floor(dragY / 32) * 32;
                    this.setPosition(snappedX, snappedY);
                }
            },
        );
    }
}
