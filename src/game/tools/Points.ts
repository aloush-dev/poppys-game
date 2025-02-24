import { LevelEditor } from "../scenes/LevelEditor";

export class StartPoint extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "start");

        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: StartPoint,
                dragX: number,
                dragY: number,
            ) => {
                if (
                    gameObject === this &&
                    (scene as LevelEditor).selectedTool === "select"
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

export class EndPoint extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.StaticBody;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "end");
        this.body = this.body as Phaser.Physics.Arcade.StaticBody;

        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: EndPoint,
                dragX: number,
                dragY: number,
            ) => {
                if (
                    gameObject === this &&
                    (scene as LevelEditor).selectedTool === "select"
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

