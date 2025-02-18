export class Erase extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "erase");
        this.setOrigin(0, 0);
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        this.setDisplaySize(32, 32);
    }
}
