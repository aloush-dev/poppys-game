export class Block extends Phaser.GameObjects.Image {
    public blockType: "block_middle" | "block_left" | "block_right";
    public body: Phaser.Physics.Arcade.StaticBody;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: "block_middle" | "block_left" | "block_right" = "block_middle",
    ) {
        super(scene, x, y, type);
        this.blockType = type;

        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        if (scene.scene.key === "LevelEditor") {
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
                    if (gameObject === this) {
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
}

