export class StartPoint extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "start");

        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);

        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);

        this.play("start_portal");

        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: StartPoint,
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

export class EndPoint extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "end");
        this.setOrigin(0, 0);
        this.setDisplaySize(32, 32);
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);

        this.play("end_portal");

        // Add drag events with grid snapping
        scene.input.on(
            "drag",
            (
                pointer: Phaser.Input.Pointer,
                gameObject: EndPoint,
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

