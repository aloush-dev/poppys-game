export class Block extends Phaser.GameObjects.Image {
    sprite: Phaser.GameObjects.Image | null;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "block");
        this.setOrigin(0, 0);
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        this.setDisplaySize(32, 32);
    }
}

export class BlockLeft extends Block {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.setTexture("block_left");
        this.setOrigin(0, 0);
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        this.setDisplaySize(32, 32);
    }
}

export class BlockRight extends Block {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.setTexture("block_right");
        this.setOrigin(0, 0);
        scene.add.existing(this);
        this.setInteractive();
        scene.input.setDraggable(this);
        this.setDisplaySize(32, 32);
    }
}

